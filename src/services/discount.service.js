"use strict"
const {discount} = require("../models/discount.model")
const {BadRequestError} = require("../core/error.response")
const { findAllProducts } = require("../models/repositories/products.repo")

class DiscountService {

    static createDiscount = async(payload) => {
        const { discount_name, discount_description, discount_type, discount_value, discount_code, discount_start_date, 
            discount_end_date, discount_max_uses, discount_uses_count, discount_users_used, discount_max_uses_per_user, 
            discount_min_order_value, discount_shopId, discount_max_value, discount_is_active, discount_applies_to, discount_product_ids } = payload;


        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError("The code has expired")
        }
        if (new Date(discount_start_date) >= new Date(discount_end_date)) {
            throw new BadRequestError("The start date must be before the end date")
        }
        
        const foundDiscount = await discount.findOne({
            where: {
                discount_code: discount_code,   
                discount_shopId: discount_shopId,
                discount_is_active: true
            }
        })
        if(foundDiscount) {
            throw new BadRequestError("The code has been used")
        }
        const newDiscount = await discount.create({
            discount_name: discount_name,
            discount_description: discount_description,
            discount_type: discount_type,
            discount_value: discount_value,
            discount_code: discount_code,
            discount_start_date: discount_start_date,
            discount_end_date: discount_end_date,
            discount_max_uses: discount_max_uses,
            discount_uses_count: discount_uses_count,
            discount_users_used: discount_users_used,
            discount_max_uses_per_user: discount_max_uses_per_user,
            discount_min_order_value: discount_min_order_value,
            discount_shopId: discount_shopId,
            discount_max_value: discount_max_value,
            discount_is_active: discount_is_active,
            discount_applies_to: discount_applies_to,
            discount_product_ids: discount_product_ids
        })

        if (discount_applies_to === "specific" && discount_product_ids.length === 0){
            throw new BadRequestError("Please specify the products the discount applies to")
        }

        if(discount_applies_to === "specific") {
            discount.discount_product_ids = discount_product_ids
        }
        return newDiscount
    }

    static updateDiscount = async(id, payload) => {

    }

    static getAllProductsOfDiscount = async(payload) => {

        const {code, shopId} = payload
        const foundDiscount = await discount.findOne({
            where: {
                discount_code: code,
                discount_shopId: shopId,
                discount_is_active: true
            }
        })
        if(!foundDiscount) {
            throw new BadRequestError("The code is invalid")
        }
        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products

        if(discount_applies_to === "all") {
            products = await findAllProducts({
                limit: 50,
                page: 1,
                sort: "ctime",
                filter: {
                    isPublished: true,
                    product_shop: shopId
                },
                select: ["product_name", "product_thumb", "product_price"]
            })
        }
        if(discount_applies_to === "specific") {
            products = await findAllProducts({
                limit: 50,
                page: 1,
                sort: "ctime",
                filter: {
                    isPublished: true,
                    product_shop: shopId,
                    id: discount_product_ids
                },
                select: ["id", "product_name", "product_thumb", "product_price"]
            })
        }

        return products

    }

    static getALlDiscountOfShop = async({limit = 50, page = 1, shopId }) => {
        const skip = (page - 1) * limit
        const discounts = await discount.findAll({
            where: {
                discount_shopId: shopId
            },
            attributes:
            {
                exclude: ["discount_shopId"]
            },
            limit: limit,
            skip: skip,
            order: [
                ["discount_end_date", "DESC"]
            ]
        })

        return discounts
    }

    static getDiscountAmount = async ({code, shopId, userId, products = []}) => {
        const foundDiscount = await discount.findOne({
            where: {
                discount_code: code,
                discount_is_active: true,
                discount_shopId: shopId
            }
        })
        console.log("Found Discount::", foundDiscount)
        if(!foundDiscount) {
            throw new BadRequestError("The code is invalid")
        }

        if(!foundDiscount.discount_is_active)
            throw new BadRequestError("The code is expired")
        if (foundDiscount.max_uses <= foundDiscount.discount_uses_count)
            throw new BadRequestError("The code is out of uses")
        if (new Date() <= new Date(foundDiscount.discount_start_date) || new Date() >= new Date(foundDiscount.end_date))
            throw new BadRequestError("The code is expired")

        let totalOrder = 0
        let amount = 0 //total Discount
        if (foundDiscount.discount_min_order_value > 0)
        {       
            products.forEach(product => {
                if (foundDiscount.discount_applies_to === "specific" && foundDiscount.discount_product_ids.includes(product.productId))
                    amount += foundDiscount.discount_type === "fixed_amount" ? foundDiscount.discount_value : (product.price * product.quantity) * foundDiscount.discount_value / 100
                totalOrder += product.price * product.quantity  
            })
            console.log ("totalOrder::", totalOrder)
            if(totalOrder < foundDiscount.discount_min_order_value)  
                throw new BadRequestError("Discount requires a minimum order value of " + foundDiscount.discount_min_order_value)

            foundDiscount.discount_users_used.push(userId)
            foundDiscount.discount_uses_count += 1
            foundDiscount.save({
                fields: ["discount_users_used", "discount_uses_count"]
            })
        }

        
        amount = parseFloat(amount)
        return {
            totalOrder,
            amount: amount, //discount amount
            totalPrice: totalOrder - amount
        }

    }

    static deleteDiscount = async({code, shopId}) => {
        console.log("Code::", code)
        const result = await discount.destroy({
            where: {
                discount_code: code,
                discount_shopId: shopId
            }
        })
        return result
    }

    static cancelDiscount = async ({code, shopId, userId}) => {
        const foundDiscount = await discount.findOne({
            where: {
                discount_code: code,
                discount_shopId: shopId,
                discount_is_active: true
            }
        })  
        if (!foundDiscount){
            throw new BadRequestError("The code is invalid")
        }

        if (!foundDiscount.discount_users_used.includes(userId)){
            throw new BadRequestError("This user has not used the code yet")
        }
        
        const result = await foundDiscount.update({
            discount_users_used: discount_users_used.filter(id => id !== userId),
            discount_uses_count: discount_uses_count - 1
        })

        return result


    }

}


module.exports = DiscountService