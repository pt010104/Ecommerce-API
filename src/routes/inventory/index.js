'use strict'

const express = require ("express")
const InventoryController = require ("../../controllers/inventory.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")

//authetication
router.use(authentication)
//////////////////////////
router.post('/addStock', asyncHandler(InventoryController.addStockToInventory))

module.exports = router 

