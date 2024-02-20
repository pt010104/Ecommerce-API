'use strict'

const {Sequelize } = require("sequelize");
const {products, electronics, clothes} = require ("../products.model")
const Shop = require('../shop.model'); 
const {BadRequestError} = require("../../core/error.response")

const findAllDProductForShop = async ({query, limit, skip}) => {

    const result = await products.findAll ({
        where: query,
        include: [{
            model: Shop,
            as: 'shop',
            attributes: ['name', 'email', 'id']
        }],
        order: [['updated_at',"DESC"]],
        offset: skip,
        limit: limit,
    })
    return result

}

const searchProductByUser = async ({keySearch}) => {
    const result = await products.findAll ({
        where: {
            [Sequelize.Op.and]: [
                Sequelize.literal(`to_tsvector(product_name || ' ' || product_description) @@ plainto_tsquery('english', '${keySearch}')`),
                {isPublished: true}
            ]
        },
        attributes: {
            include: [
                [Sequelize.literal(`ts_rank_cd(to_tsvector(product_name || ' ' || product_description), plainto_tsquery('english', '${keySearch}'))`), 'textScore']
            ]
        },
        order: Sequelize.literal(`"textScore" DESC`),

    })

    if(result.length == 0) throw new BadRequestError("Product not found");
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

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === "ctime"? ['id', "DESC"]: ["id", "ASC"]
    console.log(limit)
    const result = await products.findAll({
        where: filter,
        attributes: select,
        offset: skip,
        limit: limit,
        order:[['id',"DESC"]],
    })
    return result
}

const findProduct = async ({id,unselect}) => {
    console.log(id)
    const result = await products.findOne({
        where: {id: id},
        attributes: {
            exclude: unselect || []
        }
    })  
    return result
}

const updateProduct = async ({id, payload, model, isReturn = true}) => {
    console.log("id, payload, model, isReturn", id, payload, model, isReturn)
    const product = await model.findByPk(id);

    product.product_attributes = {
        ...product.product_attributes,
        ...payload.product_attributes   
    }

    const rows = await product.save({ returning: isReturn });
    return rows;
}

module.exports = {
    findAllDProductForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProduct
}