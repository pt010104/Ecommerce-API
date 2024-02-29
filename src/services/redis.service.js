"use strict"
const {promisify} = require("util")
const { reservation } = require("../models/repositories/inventory.repo")
const InventoryService = require("./inventory.service")
const client = require('../configs/redis.config')
const { cart } = require("../models/cart.model")

class RedisService {

    constructor() {
        this.setAsync = promisify(client.set).bind(client)
        this.pexpire = promisify(client.pExpire).bind(client)
    }

    acquireLock = async ({productId, cartId, quantity}) => {
        const key = "lock_v2024_"+productId
        const expireTime = 3000
        const retryTimes = 10
        const lockValue = '1'; 
        for (let i =0; i<retryTimes; i++)
        {
            const result = await client.set(key, lockValue, {
                EX: 3,
                NX: true
            })
            console.log("Result after Setnx::", result)
            if (result)
            {
                const isReservation = await reservation({productId, cartId, quantity})
                if (isReservation)
                { 
                    return key
                }
                //Handle inventory
                return null
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 50))
            }

        }
    }

    releaseLock = async(keyLock) =>{
        return await client.del(keyLock)
    }

}
module.exports = new RedisService ()