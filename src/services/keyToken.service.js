'use strict'

const keytokenModel = require("../models/keytoken.model")

class keyTokenService{

    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {

            const tokens = await keytokenModel.create({
                userId: userId,
                publicKey: publicKeyString,
                privateKey: privateKey
            })
            console.log("Tokens.publickey::",tokens.publickey)
            return tokens ? tokens.publickey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = keyTokenService