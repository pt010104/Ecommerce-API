const { DataTypes, Sequelize } = require('sequelize');
const db = require('../configs/db.config').db;

const apikey = db.define('apikey', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: DataTypes.TEXT,   
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        enum: ['0000', '1111', '2222'],
    },
}, 
{
    tableName: 'apikey',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
});

module.exports = apikey;