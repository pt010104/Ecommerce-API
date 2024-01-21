'use strict'
const AccessService = require ("../services/access.service")

const {OK,CREATED} = require ("../core/success.response")

class AccessController
{
    signUp = async (req, res, next) =>{

            const {body} = req

            new CREATED(
                {
                    message:"Registered Successfully!",
                    metadata: await AccessService.signUp(body.email,body.name,body.password)

                }
            ).send(res)

    }
}

module.exports = new AccessController()