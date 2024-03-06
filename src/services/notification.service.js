"use strict"
const Notification = require("../models/notification.model")

class NotificationService {

    static pushNotification = async({type = 'SHOP-001', receivedId =  1, senderId = 1, options = {}}) => {
        let noti_content = '';
        if (type === 'SHOP-001') {
            noti_content = 'ShopName has added new product'
        }
        else if (type === 'PROMOTION-001') {
            noti_content = 'New promotion is available'
        }

        console.log("Notification Data::", {type, receivedId, senderId, noti_content, options}) 
        const newNoti = await Notification.create({
            noti_type: type,
            noti_senderId: senderId,
            noti_receiverId: receivedId,
            noti_content: noti_content,
            noti_options: options
        })
        return newNoti
    }

    static listNotiByUser = async({userId=1, type = "All", isRead = 0}) => {
        const match = {noti_receiverId: userId}
        if(type !== "All") match.noti_type = type
        return await Notification.findAll({
            where: match,
            attributes: ['noti_type', 'noti_senderId', 'noti_receiverId', 'noti_content', 'created_at'],
            order: [
                ['created_at', 'DESC']
            ]
        })


    }
}

module.exports = NotificationService