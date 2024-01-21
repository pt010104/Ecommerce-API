'use strict'
const AccessService = require ("../services/access.service")

class AccessController
{
    signUp = async (req, res, next) =>{

            const {body} = req
            const result = await AccessService.signUp(body.email,body.name,body.password)
            return res.status(201).json({
                result
            })
    }
}

module.exports = new AccessController()