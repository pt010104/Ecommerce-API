"use strict"
const { SuccessResponse } = require("../core/success.response")
const NotificationService = require("../services/notification.service")
class NotificationController {
    listNotiByUser = async (req, res, next) =>{
        new SuccessResponse (
            {
                message:"List Notification Successfully!",
                metadata: await NotificationService.listNotiByUser({userId: req.user.userId, type: req.query.type, isRead: req.query.isRead})
            }
        ).send(res)
    }
}

module.exports = new NotificationController()
