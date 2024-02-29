"use strict"
const { Sequelize } = require("sequelize")
const {inventory} = require("../inventory.model")
const { BadRequestError } = require("../../core/error.response")

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
    
    const result =  await inventory.findOne(
        {
            where: {    
                inven_productId: productId,
                inven_stock: {
                    [Sequelize.Op.gte]: quantity
                }
            }
        }
    )
    if(!result)
        throw new BadRequestError(`Cant find the produt in Inventory:: ${productId}`)

    const newItem = JSON.stringify({ quantity, cartId, createOn: new Date() });
    result.inven_reservations.push(newItem)
    result.inven_stock -= quantity
    result.changed("inven_reservations", true)
    result.save()
    
    return result
} 

module.exports = {insertInventory, reservation}