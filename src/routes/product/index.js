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
router.post ('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post ('/unpublish/:id', asyncHandler(ProductController.unpublishProductByShop))


//QUERY 
router.get ('/draft/all', asyncHandler(ProductController.getAllDraftsForShop))  
router.get("/published/all", asyncHandler(ProductController.getAllPublishedForShop))

module.exports = router 

