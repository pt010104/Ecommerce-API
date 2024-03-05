'use strict'

const KeyToken = require("../models/keytoken.model")
const {Sequelize} = require('sequelize')

class keyTokenService{

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken, refreshTokenUsed}) => {
        try {

            const tokenData = {
                user_id: userId,
                publickey: publicKey,
                privatekey: privateKey,
                refreshtoken: refreshToken,
                refreshtokenUsed: refreshTokenUsed
            };
    
            console.log("Token Data::",tokenData)

            const tokens = await KeyToken.upsert(
                tokenData,
                {
                    returning: true
                }
            )
            return tokens ? tokens.publicKey : null;
            
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static findByUserId = async (UserId) => {
        return await KeyToken.findOne({
            where: {
                user_id: UserId
            }
        })
    }

    static removeKeyById = async (id) => {
        return await KeyToken.destroy({
            where: {
                id: id
            }
        })
    }

    static removeKeyByUserId = async (UserId) => {
        return await KeyToken.destroy({
            where: {
                user_id : UserId 
            }
        })
    }


    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyToken.findOne({
            where: {
                refreshtokenUsed: { [Sequelize.Op.contains] : [refreshToken]}
            }
        })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await KeyToken.findOne({
            where: {
                refreshtoken: refreshToken
            }
        })
    }
    

}

module.exports = keyTokenService