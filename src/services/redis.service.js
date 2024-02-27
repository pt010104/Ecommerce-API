"use strict"
require ("dotenv").config()
const redis = require ("redis")
const {promisify} = require("util")
const { reservation } = require("../models/repositories/inventory.repo")
const InventoryService = require("./inventory.service")

class RedisService {
    connectRedis =  async() => {
        console.log("Try to connect Redis...")
        this.client = redis.createClient({
            url: process.env.REDIS_URL
        })
        this.client.on('error', (err) => console.log("Redis Client Error", err))
        await this.client.connect().then(() => {
            console.log("Connected to Redis");
        }).catch((err) => {
            console.error("Error connecting to Redis", err);
        });     
        
        this.setnxAsync = promisify(this.client.setNX).bind( this.client)
        this.pexpire = promisify(this.client.pExpire).bind( this.client)

    }
    acquireLock = async ({productId, cartId, quantity}) => {
        const key = "lock_v2024_"+productId
        const expireTime = 3000
        const retryTimes = 10

        for (let i =0; i<retryTimes; i++)
        {
            const result = await setnxAsync(key, expireTime)
            console.log("Result after Sexnx::", result)
            if (result == 1)
            {
                const isReservation = await reservation({productId, cartId, quantity})
                if (isReservation)
                { 
                    await pexpire(key, expireTime)
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
        const delAsyncKey = promisify(redisClient.del).bind(redisClient)
        return await delAsyncKey(keyLock)
    }
}
module.exports = new RedisService ()