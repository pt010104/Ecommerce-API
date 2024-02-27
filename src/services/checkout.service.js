"use strict"
const {BadRequestError} = require("../core/error.response")
const CartService = require("./cart.service")
const { getDiscountAmount } = require("./discount.service")
const { ProductFactory } = require("./product.service")
const RedisService = require("./redis.service")
const order = require ("../models/order.model")
const { addStockToInventory } = require("./inventory.service")
class CheckoutService {
    /**
     cartId:,
     userId:,
     shop_order_ids: [
        {
            shopId,
            shop_discounts[
                {
                    shopId,
                    discountId,
                    code
                }
            ],
            item_products: [
                {
                    productId,
                    quantity,
                    price
                }
            ]
        }
     ]
     
    */
    static checkoutReview = async({cartId, userId, shop_order_ids = [] }) => {

        const cartFound = await CartService.getListCart({userId})
        cartFound.cart_products.forEach(async (item) => {
            const itemIndex = shop_order_ids.findIndex((shop) => shop.shopId === item.shopId)
            shop_order_ids[itemIndex].item_products.push(item)             
        })

        if(!cartFound) throw new BadRequestError("Cart not found")

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalPayment: 0,
        }

        for (let i = 0; i< shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]

            const checkProductByServer = item_products
            if(!checkProductByServer) throw new BadRequestError("Product not found")

            checkoutOrder.totalPrice = checkProductByServer.reduce((acc, item) => 
                acc + (item.quantity * item.price)
            ,0)
            checkoutOrder.totalPayment =  checkoutOrder.totalPrice

            if (shop_discounts.length > 0) {
                const {code, shopId, userId} = shop_discounts[0]
                console.log("checkProductByServer::",checkProductByServer)
                const {totalOrder, amount, totalPrice} = await getDiscountAmount({code, shopId, userId, products: checkProductByServer})
                checkoutOrder.totalPrice += totalOrder
                checkoutOrder.totalDiscount += amount
                checkoutOrder.totalPayment += totalPrice

            }

        }
        const shop_order_ids_new = shop_order_ids
        return {
            shop_order_ids_new,
            checkoutOrder
        }
    }

    static orderByUser = async ({cartId, userId, shop_order_ids, user_address = {}, user_payment = {}}) => {
        const {shop_order_ids_new, checkoutOrder} = await this.checkoutReview({cartId, userId, shop_order_ids})
        let products = []
        shop_order_ids_new.forEach((item) => {
            products = item.item_products
        })

        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i]
            const keyLock = await RedisService.acquireLock({productId, cartId, quantity})

            if(!keyLock)
                throw new BadRequestError("There are products has been updated, Check your cart again")
            else 
                await RedisService.releaseLock(keyLock)
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        //if insert successfully, Remove the products in user cart
        if(newOrder)
        {
            
        }
    }
}

module.exports = CheckoutService