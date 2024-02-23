'use strict'

const express = require ("express")
const CheckoutController = require ("../../controllers/checkout.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")

//authetication
router.use(authentication)
//////////////////////////
router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router 

