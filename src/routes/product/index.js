'use strict'

const express = require ("express")
const ProductController = require ("../../controllers/product.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")

router.get ('/search/:keySearch', asyncHandler(ProductController.getProductByUser))
router.get ("/sortBy=:sort", asyncHandler(ProductController.getAllProducts))
router.get ("/:id", asyncHandler(ProductController.getProduct))
//authetication
router.use(authentication)
//////////////////////////
router.post ('', asyncHandler(ProductController.createProduct))
router.post ('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post ('/unpublish/:id', asyncHandler(ProductController.unpublishProductByShop))
router.patch ('/update/:id', asyncHandler(ProductController.updateProduct))


//QUERY 
router.get ('/draft/all', asyncHandler(ProductController.getAllDraftsForShop))  
router.get("/published/all", asyncHandler(ProductController.getAllPublishedForShop))

module.exports = router 

