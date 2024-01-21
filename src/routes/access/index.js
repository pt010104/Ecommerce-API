'use strict'

const express = require ("express")
const AccessController = require ("../../controllers/access.controller")
const router = express.Router()
const {asyncHandler} = require("../../auth/checkAuth")



//register
router.post ("/shop/signup", asyncHandler(AccessController.signUp))

module.exports = router

