'use strict'
const AccessService = require ("../services/access.service")

const {OK,CREATED,SuccessResponse} = require ("../core/success.response")

class AccessController
{

    handlerRefreshToken = async (req, res, next) =>{
        new SuccessResponse (
            {
                message:"Refresh Token Successfully!",
                metadata: await AccessService.handllerRefreshToken(req.body.refreshToken)
            }
        ).send(res)
    }

    logout = async (req, res, next) =>{
        new SuccessResponse (
            {
                message:"Logout Successfully!",
                metadata: await AccessService.logout(req.keyStore)
            }
        ).send(res)
    }
    login = async (req, res, next) =>{
        const {body} = req
        new OK (
            {
                message:"Login Successfully!",
                metadata: await AccessService.login(body.email,body.password)
            }
        ).send(res)
    }
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