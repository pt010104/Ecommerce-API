"use strict"
const { Sequelize } = require("sequelize")
const { BadRequestError } = require("../core/error.response")
const {inventory} = require("../models/inventory.model")
const { products } = require("../models/products.model")
const { findProduct } = require("../models/repositories/products.repo")

class InventoryService {
    static createInventory = async({stock, productId, shopId, location = "UnKnown"}) => {
        const product = await findProduct({id: productId})
        if (!product)
            throw new BadRequestError("Product does not exists!")

        console.log("product::", product)
        return await inventory.create(
          {
            inven_productId: productId,
            inven_stock: stock,
            inven_shopId: shopId,
            inven_location: location
          }
        )
    }

    static addStockToInventory = async({stock, productId, shopId, location = "UnKnown"}) => {
        const product = await findProduct({id: productId})
        if (!product)
            throw new BadRequestError("Product does not exists!")

        console.log("product::", product)
        inventory.update(
            {
                inven_location: location,
                inven_stock: Sequelize.literal(`inven_stock + ${stock}`)
            },
            {
                where: {
                    inven_productId: productId,
                    inven_shopId:  shopId
                }
            }
        )
    }
}

module.exports = InventoryService