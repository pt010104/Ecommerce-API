'use strict'

const express = require ("express")
const CartController = require ("../../controllers/cart.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")

//authetication
router.use(authentication)
//////////////////////////
router.get('', asyncHandler(CartController.getListCart))
router.post ('', asyncHandler(CartController.addToCart))
router.post ('/update', asyncHandler(CartController.updateCart))
router.delete ('', asyncHandler(CartController.deleteCart))

module.exports = router 

