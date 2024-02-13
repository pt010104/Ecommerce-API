'use strict'

const {products, electronics, clothes} = require ("../products.model")
const Shop = require('../shop.model'); 

const findAllDraftForShop = (async ({query, limit, skip}) => {

        const result = await products.findAll ({
            where: query,
            include: [{
                model: Shop ,
                as: 'shop',
                attributes: ['name', 'email', 'id']
            }],
            order: [['updated_at',"DESC"]],
            offset: skip,
            limit: limit,
            raw: true
        })
    return result

})

module.exports = {
    findAllDraftForShop
}