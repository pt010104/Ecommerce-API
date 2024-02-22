"use strict"
const {cart} = require("../models/cart.model")
const {BadRequestError,NotFoundError} = require("../core/error.response")
const { findProduct } = require("./product.service")

class CartService {

    static createCart = async({userId, product}) => {
        console.log("productcreate::", product)
        const productFound = await findProduct({id: product.productId})
        const newProduct = {
            productId: product.productId,
            shopId: productFound.product_shop,
            name: productFound.product_name,
            quantity: 1,
            price: productFound.product_price
        };
        console.log("newProduct::", newProduct)
        return await cart.create({
            cart_userId: userId,
            cart_products: [
                newProduct
            ],
            cart_count_products: 1
        });
    }


    static updateCartQuantity = async({userId, product}) => {
        const {productId} = product
        const productFound = await findProduct({id: productId})
        const newProduct = {
            productId: product.productId,
            shopId: productFound.product_shop,
            name: productFound.product_name,
            quantity: 1,
            price: productFound.product_price
        };

        console.log("productFound::", productFound)
        const cartList = await cart.findOne({
            where: {
                cart_userId: userId,
                cart_state: 'active'
            }
        })
        const cartProducts = cartList.cart_products
        const productIndex = cartProducts.findIndex((item) => item.productId == productId)
        if(productIndex < 0)
        {
            cartList.cart_products.push(newProduct)
            cartList.cart_count_products += 1
            return await cartList.save()
        }
        

        cartList.cart_products[productIndex].quantity += 1
        cartList.cart_count_products += 1
        cartList.cart_products[productIndex].price = productFound.product_price * cartList.cart_products[productIndex].quantity

        cartList.changed('cart_products', true);

        return await cartList.save()
    }

    static addToCart = async({userId, product = {}}) => {
        console.log("product::", product)
        const cartFound = await cart.findOne({
            where: {
                cart_userId: userId,
                cart_state: 'active'
            }
        })
        if(!cartFound) return await this.createCart({userId, product})

        return await CartService.updateCartQuantity({userId, product})
    }

    static addToCartV2 = async({userId, product = {}}) => {
        const {productId, shopId, quantity, old_quantity} = shop_order_ids[0].item_products[0]
        
        const productFound = await findProduct({id: productId})
        if(!productFound) throw new NotFoundError("Product not found")

        if(productFound.product_shop != shopId)
            throw new NotFoundError("Product not belong to shop")

        if (quantity == 0)
            //delete

        return await this.updateCartQuantity({userId, product: {
            productId: productId,
            quantity: quantity - old_quantity
        }})
    }

    static deleteFromCart = async({userId, productId}) => {
        return await cart.destroy({
            where: {
                cart_userId: userId,
                cart_state: 'active',
                cart_products: {
                    productId: productId
                }
            }
        })

    }

    static getListCart = async({userId}) => {
        return await cart.findOne({
            where:{
                cart_userId: userId,
                cart_state: 'active'
            }
        })
    }
}
module.exports = CartService
