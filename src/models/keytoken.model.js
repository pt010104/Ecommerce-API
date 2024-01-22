const { DataTypes, Sequelize } = require('sequelize');
const db = require('../configs/dbConfig').db;
const Shop = require('./shop.model'); // Assuming you have a Shop model defined

const KeyToken = db.define('KeyToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Shop, // This is a reference to another model
        key: 'id', // This is the column name of the referenced model
        },
    },
    publickey: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
    refreshtoken: {
        type: DataTypes.ARRAY(DataTypes.TEXT), 
        unique: true

    },
    privatekey: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
}, 
{
    tableName: 'keytoken',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
});

module.exports = KeyToken;