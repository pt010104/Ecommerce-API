'use strict'
const ProductFactory = require ("../services/product.service")

const {OK,CREATED,SuccessResponse} = require ("../core/success.response")

class ProductController
{
    createProduct = async (req, res, next) =>{
        new SuccessResponse (
            {
                message:"Created Product Successfully!",
                metadata: await ProductFactory.createProduct(req.body.product_type, 
                    {...req.body, 
                        product_shop: req.user.userId
                    }
                )
            }
        ).send(res)
    }

    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"Retrieved Drafts Successfully!",
                metadata: await ProductFactory.findAllDraftForShop({product_shop: req.user.userId})
            }
        ).send(res)
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"Retrieved Published Successfully!",
                metadata: await ProductFactory.findAllPublishedForShop({product_shop: req.user.userId})
            }
        ).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"Published Product Successfully!",
                metadata: await ProductFactory.publishProductByShop({product_shop: req.user.userId, id: req.params.id})
            }
        ).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"UnPublished Product Successfully!",
                metadata: await ProductFactory.unpublishProductByShop({product_shop: req.user.userId, id: req.params.id})
            }
        ).send(res)
    }

    getProductByUser = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"Retrieved Products Successfully!",
                metadata: await ProductFactory.searchProductByUser({keySearch: req.params.keySearch})
            }
        ).send(res)
    }

    getAllProducts = async (req, res, next) => {
        new SuccessResponse (
            {
                message:"Retrieved Products Successfully!",
                metadata: await ProductFactory.findAllProducts({ sort: req.params.sort})
            }
        ).send(res)
    }
}

module.exports = new ProductController()