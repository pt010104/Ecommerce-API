'use strict'

const express = require ("express")
const AccessController = require ("../../controllers/access.controller")
const router = express.Router()

//register
router.post ("/shop/signup", AccessController.signUp)

module.exports = router

