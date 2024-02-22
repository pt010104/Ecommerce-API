'use strict'
const DiscountService = require ("../services/discount.service")

const {OK,CREATED,SuccessResponse} = require ("../core/success.response")

class DiscountController
{
    createDiscountCode = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Created Discount Code Successfully!",
                metadata: await DiscountService.createDiscount({...req.body, discount_shopId: req.user.userId})
          }
        ).send(res)
    }

    updateDiscountCode = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Updated Discount Code Successfully!",
                metadata: await DiscountService.updateDiscount(req.params.id, req.body)
          }
        ).send(res)
    }

    getAllProductsOfDiscount = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Retrieved Products Successfully!",
                metadata: await DiscountService.getAllProductsOfDiscount(req.body)
          }
        ).send(res)
    }

    getDiscountAmount = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Retrieved Discount Amount Successfully!",
                metadata: await DiscountService.getDiscountAmount({...req.body, userId:  req.user.userId})
          }
        ).send(res)
    }

    deleteDiscount = async (req, res, next) =>{
      console.log(req.body)
        new SuccessResponse (
          {
                message:"Deleted Discount Code Successfully!",
                metadata: await DiscountService.deleteDiscount(req.body)
          }
        ).send(res)
    }

    cancelDiscount = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Cancelled Discount Code Successfully!",
                metadata: await DiscountService.cancelDiscount(req.params.id)
          }
        ).send(res)
    }

}

module.exports = new DiscountController()