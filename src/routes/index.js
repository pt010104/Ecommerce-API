'use strict'

const express = require ("express")
const {apiKey, permission} = require("../auth/checkAuth")
const router = express.Router()
const cartService = require("../services/cart.service")
//check apiKey
router.use(apiKey)

//check permissions
router.use(permission("0000"))

router.use("/v1/api/product", require ("./product"))
router.use("/v1/api/access", require ("./access"))
router.use("/v1/api/discount", require ("./discount"))

//handling error 

module.exports = router

