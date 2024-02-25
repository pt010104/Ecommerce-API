"use strict"
const { Sequelize } = require("sequelize")
const { BadRequestError } = require("../core/error.response")
const {inventory} = require("../models/inventory.model")
const { products } = require("../models/products.model")
const { findProduct } = require("../models/repositories/products.repo")

class InventoryService {
    static addStockToInventory = async(stock, productId, shopId, location = "UnKnown") => {

        const product = await findProduct(productId)
        if (!product)
            throw new BadRequestError("Product does not exists!")
        inventory.upsert(
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