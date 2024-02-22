'use strict'

const express = require ("express")
const DiscountController = require ("../../controllers/discount.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")

router.post ('/update/:id', asyncHandler(DiscountController.updateDiscountCode))
router.post("/delete", asyncHandler(DiscountController.deleteDiscount))
router.post("/cancel/:id", asyncHandler(DiscountController.cancelDiscount))

//authetication
router.use(authentication)
//////////////////////////
router.get("", asyncHandler(DiscountController.getAllProductsOfDiscount))
router.post ('', asyncHandler(DiscountController.createDiscountCode))
router.post ('/amount', asyncHandler(DiscountController.getDiscountAmount))

module.exports = router 

