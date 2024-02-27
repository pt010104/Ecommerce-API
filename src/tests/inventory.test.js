const redisPubSubService = require("../services/redisPubSub.service");


class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe("purchase_events", (receivedChannel, message) => {

            console.log("Received message::", message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(message) {
        const {productId, quantity} = message
        console.log(`Updated inventory ${message} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()