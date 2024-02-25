"use strict"
const { Sequelize } = require("sequelize")
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
const reservation = async ({productId, cartId, quantity})=>{
    return await inventory.update(
        {
            inven_stock: Sequelize.literal (`inven_stock - ${quantity}`),
            inven_reservations: Sequelize.literal (`array_append(inven_reservations, ${JSON.stringify({quantity, cartId, createOn: new Date() })})`) 
        },
        {
            where: {
                inven_productId: productId,
                inven_stock: {
                    [Sequelize.Op.gte]: quantity
                }
            }
        },
    )
} 

module.exports = {insertInventory, reservation}