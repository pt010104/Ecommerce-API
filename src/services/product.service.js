'use strict'

const {products, clothes, electronics, furnitures} = require("../models/products.model")
const {BadRequestError} = require("../core/error.response")
const {findAllDProductForShop,publishProductByShop,unpublishProductByShop,searchProductByUser,findAllProducts, findProduct, updateProduct} = require("../models/repositories/products.repo")
const {removeUndefined, updateNestedObjectParser} = require("../utils/index")
const {insertInventory} = require("../models/repositories/inventory.repo")
const NotificationService = require("./notification.service")

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

    static updateProduct = async(type, id, payload) => {
        switch(type) {
            case "products":
                return new Product(payload).updateProduct(id)
            case "Electronic":
                return new Electronic(payload).updateProduct(id)
            case "Clothing":
                return new Clothing(payload).updateProduct(id)
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

    static findAllProducts = async({limit = 100, sort, page = 1, filter, select}) => {
        return findAllProducts({limit, sort, page, 
            select: ["product_name", "product_thumb", "product_price"],
            filter: {isPublished: true}
        })
    }

    static findProduct = async({id,unselect}) => {
        return findProduct ({id, 
            unselect: ["product_variations", "isDraft", "isPublished"]
        })
    }

    static checkProductByServer = async(itemProducts) => {
        return await Promise.all(itemProducts.map(async (item) => {
            const foundProduct = await findProduct({id: item.productId})
            if(!foundProduct) throw new BadRequestError("Product not found")
            return {
                quantity: foundProduct.product_quantity,
                price: foundProduct.product_price,
                productId: foundProduct.id,
                name: foundProduct.product_name

            }
        }))

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
        const product = await products.create({...this, product_id: idProduct})
        
        if (product){
            await insertInventory({
                productId: idProduct,
                stock: this.product_quantity,
                shopId: this.product_shop
            })

            await pushNotification({
                type: 'SHOP-001',
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            })
            console.log("Insert Inventory Success") 
        }
        return product 
    }
    async updateProduct(id, payload){
        return await updateProduct({id, payload, model: products})
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

    async updateProduct(id){
        const payload = removeUndefined(this)
        if(payload.product_attributes)
        {
            const product = await products.findOne({ where: {id: id }, attributes: ["product_id"] });
            const product_id = product ? product.product_id : null;
            console.log("payload::",payload)
            updateProduct({id: product_id, payload: payload.product_attributes, model: clothes})
        }
        super.updateProduct (id, payload)
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
