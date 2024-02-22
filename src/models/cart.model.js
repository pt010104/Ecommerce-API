"use strict"
const db = require ("../configs/dbConfig").db
const {DataTypes} = require ("sequelize")

const cart = db.define("carts", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    cart_state: {
        type: DataTypes.ENUM('active', 'completed', 'failed', 'pending'),
        defaultValue: 'active'
    },
    cart_products: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
        allowNull: false
    },
    /*
    [
        {
            product_id, 
            shopId,
            quantity,
            name,
            price,
        }
    ]
    */ 
   cart_count_products: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cart_userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}) 

module.exports = {cart}