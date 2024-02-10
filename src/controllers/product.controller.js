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
}

module.exports = new ProductController()