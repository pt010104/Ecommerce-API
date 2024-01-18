'use strict'
const AccessService = require ("../services/access.service")

class AccessController
{
    signUp = async (req, res, next) =>{
        try {
            console.log(`[P]::signUp`,req.body)
            const {body} = req
            if (!body.email)
            {
                console.log ("Failed to load Json data")
                return res.status(400).json({
                    message: "Failed to Sign up",
                    code: "40001",
                    metadata: {userId: 1}
                })
            }
            else
            {
                console.log("Try to create")
                const newAccount = {
                    email: body.email,
                    name : body.name,
                    password: body.password
                }
                AccessService.signUp(body.email,body.name,body.password)
                return res.status(201).json({
                    code: "20001",
                    metadata: {userId: 1}
                })

            }
            
        } catch (err)
        {

        }
    }
}

module.exports = new AccessController()