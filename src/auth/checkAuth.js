'use strict'

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",

}

const {findById} = require('../services/apiKey.service')

const apiKey = async (req,res,next) => {
    try {
        let key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.json({
                status: 403,
                message: "Forbiden Error"
            })
        
        }

        const objectKey = await findById(key)
        
        if(!objectKey) {
            console.log("Null objectKey")
            return res.json({
                status: 403,
                message: "Forbiden Error"
            })
        }
        req.objectKey = objectKey
        return next()

    }
    catch (error) {
        next(error)
    }
}

const permission = ( permissions ) => {
    return ( req, res, next ) => {
        if (!req.objectKey.permissions)
        {
            console.log("INvalid objectKey permission")

            return res.json({
                status: 403,
                message: "Forbiden Error"
            })
        }
        console.log(req.objectKey.permissions)
        return next()
    }
}


const asyncHandler = fn =>{
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler

}