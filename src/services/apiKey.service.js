'use strict';

const apiKeyModel = require('../models/apikey.model');
const crypto = require("node:crypto");

const findById = async (key) => {

    const objKey = await apiKeyModel.findOne({
        where: {
            key: key, 
            status: true 
        }
    })
    return objKey;
}

module.exports = {
    findById
}