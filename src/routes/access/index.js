'use strict'

const express = require ("express")
const AccessController = require ("../../controllers/access.controller")
const router = express.Router()
const {asyncHanler} = require("../../auth/checkAuth")



//register
router.post ("/shop/signup", asyncHanler(AccessController.signUp))

module.exports = router

