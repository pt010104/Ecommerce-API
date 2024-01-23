'use strict'

const KeyToken = require("../models/keytoken.model")

class keyTokenService{

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {

            const tokenData = {
                user_id: userId,
                publickey: publicKey,
                privatekey: privateKey,
                refreshtoken: refreshToken,
                refreshtokenUsed: [] 
            };
    
            console.log("Token Data::",tokenData)

            const tokens = await KeyToken.upsert(
                tokenData,
                {
                    returning: true
                }
            )
            console.log("Tokens::",tokens)

            return tokens ? tokens.publicKey : null;
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = keyTokenService