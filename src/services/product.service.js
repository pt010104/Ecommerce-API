'use strict'

const {products, clothes, electronics} = require("../models/products.model")
const {BadRequestError} = require("../core/error.response")
const {findAllDProductForShop,publishProductByShop,unpublishProductByShop,searchProductByUser} = require("../models/repositories/products.repo")

//define Factory
class ProductFactory {
    static createProduct = async(type,payload) => {

        switch(type) {
            case "Electronic":
                return new Electronic(payload).createProduct()
            case "Clothing":
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError("Invalid product type")
        }
    }

    static findAllDraftForShop = async({product_shop, limit = 50, skip = 0}) => {
        const query = {product_shop, isDraft: true}
        return findAllDProductForShop({query, limit, skip})
    }

    static findAllPublishedForShop = async({product_shop, limit = 50, skip = 0}) => {
        const query = {product_shop, isPublished: true}
        return findAllDProductForShop({query, limit, skip})
    }

    static publishProductByShop = async({product_shop, id}) => {
        return publishProductByShop({product_shop, id})
    }

    static unpublishProductByShop = async({product_shop, id}) => {
        return unpublishProductByShop({product_shop, id})
    }

    static searchProductByUser = async({keySearch}) => {
        return searchProductByUser({keySearch})
    }
}

class Product {

    constructor({product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes}) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    async createProduct(idProduct) {
        return await products.create({...this, product_id: idProduct})
    }
    
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }) 
        if (!newClothing) throw new BadRequestError(("Clothing cannot created"))

        const newProduct = await super.createProduct(newClothing.id)
        if (!newProduct) throw new BadRequestError(("Product cannot created"))

        return newProduct
    }

}


class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }) 
        if (!newElectronic) throw new BadRequestError(("Electronic cannot created"))

        const newProduct = await super.createProduct(newElectronic.id)
        if (!newProduct) throw new BadRequestError(("Product cannot created"))

        return newProduct
    }

}

module.exports = ProductFactory
