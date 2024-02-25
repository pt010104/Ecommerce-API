    const redis = require ("redis")
    const {promisify} = require("util")
    const { reservation } = require("../models/repositories/inventory.repo")
    const InventoryService = require("./inventory.service")

    const redisClient = redis.createClient()
    const setnxAsync = promisify(redisClient.setNX).bind(redisClient)
    const pexpire = promisify(redisClient.pExpire).bind(redisClient)

const acquireLock = async ({productId, cartId, quantity}) => {
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

const releaseLock = async(keyLock) =>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}