"use strict"
const { BadRequestError } = require("../core/error.response")
const client = require('../configs/redis.config')
// const RedisService = require ("./redis.service")

class RedisPubSubService {
    constructor() {
        this.subscriber = client.duplicate()
        this.publisher = client.duplicate()

        this.subscriber.connect().catch(console.error);
        this.publisher.connect().catch(console.error);

        console.log("Successfully initialized Redis Pub/Sub Service");    
    }
    
    async publish(channel, message) {
        const messageString = JSON.stringify(message);
        
        try {
            const reply = await this.publisher.publish(channel, messageString);
            return reply; 
        } 
        catch (error) {
            console.error("Error publishing message to Redis:", error);
            throw error; // Or handle it as needed
        }
    }

    async subscribe(channel, callback) {

        await this.subscriber.subscribe(channel, (message) => {
            callback(channel, message);
        });
        
        this.subscriber.on("message", (receivedChannel, message) => {
        if (receivedChannel === channel)
            callback (channel, message)
        })
    }
}

module.exports = new RedisPubSubService ()