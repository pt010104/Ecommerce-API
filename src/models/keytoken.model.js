const { DataTypes, Sequelize } = require('sequelize');
const db = require('../configs/dbConfig').db;
const Shop = require('./shop.model'); 

const KeyToken = db.define('keytoken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
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
    indexes: [{
        unique: true,
        fields: ['user_id', 'publickey', 'privatekey']
    }]
});

module.exports = KeyToken;