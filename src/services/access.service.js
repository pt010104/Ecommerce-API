'use strict'
const bcrypt = require('bcrypt')
const Shop = require('../models/shop.model')
const crypto = require("node:crypto")
const keyTokenService = require("../services/keyToken.service")
const {createTokenPair, verifyJWT} = require("../auth/authUtils")
const { BadRequestError, ForbiddenError ,AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

class AccesService
{
    static handllerRefreshToken = async (refreshToken) => {
        const foundToken = await keyTokenService.findByRefreshTokenUsed (refreshToken)
        if (foundToken){
            console.log("found Token::",foundToken)
            //decode to check who is the owner of the token
            const {userId,email} = await verifyJWT(refreshToken, foundToken.privatekey)
            console.log(userId,email)

            await keyTokenService.removeKeyByUserId(userId)
            throw new ForbiddenError ("Something is wrong happend")
        }
        console.log("Not found Token::")
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken)
        {
            throw new AuthFailureError ("Shop is not registered")
        }

        const {userId,email} = await verifyJWT(refreshToken, holderToken.privatekey)
        console.log(userId,email)

        const tokens = await createTokenPair({userId: holderToken.user_id, email}, holderToken.publickey , holderToken.privatekey)

        holderToken.refreshtokenUsed.push(holderToken.refreshtoken)
        console.log("RF USED::",  holderToken.refreshtokenUsed)
        await keyTokenService.createKeyToken({
            userId: userId,
            publicKey: holderToken.publickey,
            privateKey: holderToken.privatekey,
            refreshToken: tokens.refreshToken,
            refreshTokenUsed:  holderToken.refreshtokenUsed
        })
        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async (keyStore) => {
        console.log("KeyStore Id::",keyStore.id)

        const delKey = await keyTokenService.removeKeyById(keyStore.id)
        console.log(delKey)
        return delKey
    }

    static login = async (email, password, refreshToken = null) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) {
            throw new BadRequestError("Error: Shop not found")
        }
        else{
            const match = bcrypt.compareSync(password, foundShop.password)
            
            if(!match)
            {
                throw new AuthFailureError("Error: Authentication failed")
            }

            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            const tokens = await createTokenPair({userId: foundShop.id, email}, publicKey , privateKey)

            await keyTokenService.createKeyToken({
                userId: foundShop.id,
                privateKey, publicKey,
                refreshToken: tokens.refreshToken,
                refreshTokenUsed: []
            })

            return {
                code: 201,
                metadata: {
                    shop: foundShop,
                    tokens
                }
            }

        }
    }

    static signUp = async (email,name,password) => {
        const result = await Shop.findOne({where:{ email: email}})
        if (result)
        {
            throw new BadRequestError("Error: Shop already exists")
        }
        else{
            const rounds = 10;
            password = await bcrypt.hash(password,rounds)
            
            const newShop = await Shop.create({email,name,password})
            if(newShop){
                //create private key, public key
                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')
                const refreshToken = crypto.randomBytes(64).toString('hex')

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop.id,
                    publicKey,
                    privateKey,
                    refreshToken,
                    refreshTokenUsed: []
                })

                if(!keyStore){
                    return {
                        message: "keyStore errored"
                    }
                }
                else 
                {
                    //create token pair
                    const tokens = await createTokenPair({userId: newShop.id, email}, publicKey , privateKey)
                    console.log("Created tokens successfully",tokens)

                    return {
                        code: 201,
                        metada: {
                            shop: newShop,
                            tokens
                        }
                    }

                }
            }
            else{
                    return {
                        code: 2000,
                        message: "Shop creation failed"
                    }
            }
        }

    }
}

module.exports = AccesService