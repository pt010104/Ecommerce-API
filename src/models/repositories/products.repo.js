'use strict'

const { where } = require("sequelize");
const {products, electronics, clothes} = require ("../products.model")
const Shop = require('../shop.model'); 

const findAllDProductForShop = async ({query, limit, skip}) => {

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

}

const publishProductByShop = async ({product_shop, id}) => {

    const foundShop = await products.findOne({
        where: {product_shop: product_shop, id: id}
    })
    if(!foundShop) throw new BadRequestError("Shop not found")

    foundShop.isDraft = false
    foundShop.isPublished = true

    await foundShop.save();
    return foundShop
}

const unpublishProductByShop = async ({product_shop, id}) => {

    const foundShop = await products.findOne({
        where: {product_shop: product_shop, id: id}
    })
    if(!foundShop) throw new BadRequestError("Shop not found")

    foundShop.isDraft = true
    foundShop.isPublished = false

    await foundShop.save();
    return foundShop
}

module.exports = {
    findAllDProductForShop,
    publishProductByShop,
    unpublishProductByShop
}