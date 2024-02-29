"use strict"
const {SuccessResponse} = require ("../core/success.response")
const CheckoutService = require ("../services/checkout.service")

class CheckoutController
{
    static checkoutReview = async (req, res, next) => {
        new SuccessResponse(
            {
                message:"Checkout Review Successfully!",
                metadata: await CheckoutService.checkoutReview({...req.body, userId: req.user.userId})
            }
        ).send(res)
    }

    static order = async (req,res,next) => {
        new SuccessResponse(
            {
                message: "Checkout Successfully",
                metadata: await CheckoutService.orderByUser({...req.body, userId: req.user.userId})
            }
        ).send(res)
    }
}

module.exports = CheckoutController