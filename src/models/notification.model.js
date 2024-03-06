const { DataTypes, Sequelize } = require('sequelize');
const db = require('../configs/db.config').db;

// ORDER-001: order successfully,
// ORDER-002: order failed,
// PROMOTION-001: new promotion,
// SHOP-001: new product

const Notification = db.define('notifications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    noti_type: {
        type:DataTypes.ENUM('ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'),
        allowNull: false,
    },
    noti_senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    noti_receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    noti_content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    noti_options: {
        type: DataTypes.JSONB,
        defaultValue: {},
    }
},
{
    tableName: 'notifications',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
});

module.exports = Notification;