'use strict'

const express = require ("express")
const NotificationController = require ("../../controllers/notification.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")
//authetication
router.use(authentication)
//////////////////////////
router.get ('', asyncHandler(NotificationController.listNotiByUser))
//QUERY 


module.exports = router 

