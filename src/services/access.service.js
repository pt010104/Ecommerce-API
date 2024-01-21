'use strict'
const bcrypt = require('bcrypt')
const Shop = require('../models/shop.model')
const crypto = require("node:crypto")
const keyTokenService = require("../services/keyToken.service")
const {createTokenPair} = require("../auth/authUtils")
const { BadRequestError, ConflictRequestError } = require('../core/error.response')

class AccesService
{
    static signUp = async (email,name,password) => {
        const result = await Shop.findByEmail(email)

        if (result)
        {
            throw new BadRequestError("Error: Shop already exists")
        }
        else{
            const rounds = 10;
            password = await bcrypt.hash(password,rounds)
            
            const newShop = await Shop.create(email,name,password)

            if(newShop){
                //create private key, public key
                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop.id,
                    publicKey,
                    privateKey,
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