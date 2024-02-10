'use strict'

const JWT = require('jsonwebtoken')
const {asyncHandler} = require('../helpers/asyncHandler')
const { findByUserId } = require('../services/keyToken.service')
const {NotFoundError,AuthFailureError } = require('../core/error.response')

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id",
    REFRESHTOKEN: "refresh-token"
    
}

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
                console.log("Decode verified", decoded)
            }
        })

        return {
            accessToken,
            refreshToken
        }
        
    } catch (error) {
        
    }

}

const authentication = asyncHandler(async (req,res,next) => {

    const userId = req.headers[HEADER.CLIENT_ID] 
    if(!userId) {
        throw new AuthFailureError("Invalid User Id Header")
    }

    const keyStore = await findByUserId (userId)
    if(!keyStore) {
        throw new NotFoundError("Not found KeyStore")
    }

    //check if use refresh token
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if (refreshToken) {
        const decodeUser = JWT.verify(accessToken, keyStore.publickey)
        if (userId != decodeUser.userId) {
            throw new AuthFailureError("Authentication Failed")  
        }
        else 
        {
            req.keyStore = keyStore
            return next()

        }
    
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) {
        throw new AuthFailureError("Null AccessToken Header")
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publickey)

        console.log (decodeUser)

        if (userId != decodeUser.userId) {
            throw new AuthFailureError("Authentication Failed")  
        }
        req.user = decodeUser
        req.keyStore = keyStore

        console.log(keyStore)

        return next()
    }
    catch (error) {
        throw error
    }

})

const verifyJWT = async (token, keySecret) => { 
    return JWT.verify (token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}