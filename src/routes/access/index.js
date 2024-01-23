'use strict'

const express = require ("express")
const AccessController = require ("../../controllers/access.controller")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")



//register
router.post ("/shop/signup", asyncHandler(AccessController.signUp))
router.post ("/shop/login", asyncHandler(AccessController.login))
//authetication
router.use(authentication)
//////////////////////////
router.post ("/shop/logout", asyncHandler(AccessController.logout))
router.post ("/shop/handlerRefreshToken", asyncHandler(AccessController.handlerRefreshToken))

module.exports = router

