    'use strict'

    const JWT = require('jsonwebtoken')

    const createTokenPair = async (payLoad, publicKey, privateKey) => {
        try {

            //access Token
            const accessToken = JWT.sign(payLoad, publicKey, {
                expiresIn: '2 days'
            })

            const refreshToken = JWT.sign(payLoad, privateKey, {
                expiresIn: '7 days'
            })

            JWT.verify(accessToken, publicKey, (err, decoded) => {
                if(err){
                    console.error(err)
                }
                else{
                    console.log("Decode virified", decoded)
                }
            })

            return {
                accessToken,
                refreshToken
            }
            
        } catch (error) {
            
        }

    }

    module.exports = {
        createTokenPair
    }