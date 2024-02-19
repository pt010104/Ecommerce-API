"use strict"
const {inventory} = require("../inventory.model")

const insertInventory  = async ({id, stock, shopId, location = "UnKnown"}) => {
    const result = await inventory.create({
        id: id,
        inven_stock: stock,
        inven_shopId: shopId,
        inven_location: location
    })
    return result
}

module.exports = {insertInventory}