const {DataTypes} = require('sequelize');
const db = require("../configs/dbConfig").db;
const products = require('./products.model');

const Shop = db.define('shop', 
{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, 
        },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'inactive',
    },
    verify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
    }
},
{
    tableName: 'shop',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
}
)
module.exports = Shop