'use strict';

const apiKeyModel = require('../models/apikey.model');
const crypto = require("node:crypto");

const findById = async (key) => {

    apiKeyModel.create({
        key: crypto.randomBytes(16).toString("hex"),
        permissions: ["0000", "0001", "0002", "0003"],
        status: true
    })

    const objKey = await apiKeyModel.findOne({
        where: {
            key: key, 
            status: true 
        }
    })
    return objKey;
}

const findAll = async() => {
    return await apiKeyModel.findAll()
}

module.exports = {
    findById,
    findAll
}