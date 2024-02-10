'use strict'

const express = require ("express")
const ProductController = require ("../../controllers/product.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")


//authetication
router.use(authentication)
//////////////////////////
router.post ('', asyncHandler(ProductController.createProduct))

module.exports = router

