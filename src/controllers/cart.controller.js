"use strict"
const {SuccessResponse} = require ("../core/success.response")
const CartService = require ("../services/cart.service")

class CartController
{
    static addToCart = async (req, res, next) => {
        new SuccessResponse(
            {
                message:"Added to Cart Successfully!",
                metadata: await CartService.addToCart({userId: req.user.userId, product: req.body.product})
            }
        ).send(res)
    }

    static updateCart = async (req, res, next) => {
        new SuccessResponse(
            {
                message:"Updated Cart Successfully!",
                metadata: await CartService.addToCartV2({userId: req.user.userId, product: req.body.product})
            }
        ).send(res)
    }

    static deleteCart = async (req, res, next) => {
        new SuccessResponse(
            {
                message:"Deleted Cart Successfully!",
                metadata: await CartService.deleteFromCart({userId: req.user.userId, productId: req.body.productId})
            }
        ).send(res)
    }

    static getListCart = async (req, res, next) => {
        new SuccessResponse(
            {
                message:"Retrieved Cart Successfully!",
                metadata: await CartService.getListCart({userId: req.user.userId})
            }
        ).send(res)
    }
}

module.exports = CartController