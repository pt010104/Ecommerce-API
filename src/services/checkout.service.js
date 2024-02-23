"use strict"
const {BadRequestError} = require("../core/error.response")
const CartService = require("./cart.service")
const { getDiscountAmount } = require("./discount.service")
const { ProductFactory } = require("./product.service")

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

        return {
            shop_order_ids,
            checkoutOrder
        }
    }
}

module.exports = CheckoutService