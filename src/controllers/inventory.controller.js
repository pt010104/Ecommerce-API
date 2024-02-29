"use strict"
const { SuccessResponse } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")

class InventoryController {

  createInventory = async (req, res, next) =>{
    new SuccessResponse (
      {
            message:"Created Inventory Successfully!",
            metadata: await InventoryService.createInventory({...req.body, shopId: req.user.userId})
      }
    ).send(res)
}
    addStockToInventory = async (req, res, next) =>{
        new SuccessResponse (
          {
                message:"Added Stock to Inventory Successfully!",
                metadata: await InventoryService.addStockToInventory({...req.body, shopId: req.user.userId})
          }
        ).send(res)
    }
}

module.exports = new InventoryController()
