"use strict"
const db = require ("../configs/db.config").db
const {DataTypes} = require ("sequelize")

const order = db.define("orders", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_userId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order_checkout: {
            type: DataTypes.JSONB,
            defaulValue: {}
            /*
                (checkout_order in checkout.service)

                order_checkout = {
                    totalPrice,
                    totalDiscount,
                    feeShip
                }
            */
        },
        order_shipping: {
            type: DataTypes.JSONB,
            defaulValue: {}
            /*
                street,
                city,
                state,
                country
             */
        },
        order_payment: {
            type: DataTypes.JSONB,
            defaulValue: {}
        },
        order_products: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false
        },
        order_trackingNumber: {
            type: DataTypes.TEXT,
            defaulValue: "00000000" 
        },
        order_status: {
            type:DataTypes.ENUM("pending", "confirmed", "shipping", "delivered", "cancelled"),
            defaultValue: "pending"
        }

    },
    {
        tableName: "orders",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: 'updated_at',
    }
)

module.exports = order