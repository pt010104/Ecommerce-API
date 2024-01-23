'use strict'

const shopModel = require("../models/shop.model")

const findByEmail = async ({email}) => {
    return await shopModel.findOne(
        { 
            where: 
            {
                email: email
            },
            attributes: ['id','email','password','name','status','roles']
        }
    )
}

module.exports = {findByEmail}