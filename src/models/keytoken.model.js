const { DataTypes, Sequelize } = require('sequelize');
const db = require('../configs/db.config').db;
const Shop = require('./shop.model'); 

const KeyToken = db.define('keytoken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        unique: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Shop, 
            key: 'id', 
        },
    },
    publickey: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
    privatekey: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
    refreshtokenUsed: {
        type: DataTypes.ARRAY(DataTypes.TEXT), 
        defaultValue: []
    },
    refreshtoken: {
        type: DataTypes.TEXT, 
        allowNull: false
    }
},
{
    tableName: 'keytoken',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
});

module.exports = KeyToken;