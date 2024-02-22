"use strict"
const {cart} = require("../models/cart.model")
const {BadRequestError,NotFoundError} = require("../core/error.response")
const { findProduct } = require("./product.service")

class CartService {

    static createCart = async({userId, product}) => {
        return await cart.create({
            cart_userId: userId,
            cart_products: product,
        })
    }


    static updateCartQuantity = async({userId, product}) => {
        const {productId, quantity} = product
        return await cart.Upsert(
            {
                cart_products: {
                    productId: productId,
                    quantity: +quantity
                }
            },
            {
                where: {
                    cart_userId: userId,
                    cart_state: 'active'
                }
            }
        )

    }

    static addToCart = async({userId, product = {}}) => {
        const cartFound = await cart.findOne({
            where: {
                cart_userId: userId,
                cart_state: 'active'
            }
        })
        if(!cartFound){
            return await CartService.createCart({userId, product})
        }

        if(cartFound.cart_products.length == 0) {
            cartFound.cart_products = product
            return await cartFound.save()
        }

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
