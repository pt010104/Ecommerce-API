const {DataTypes} = require ("sequelize")
const db = require ("../configs/db.config").db
const Shop = require('./shop.model'); 
const slugify = require('slugify');

const inventory = db.define("inventories", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        inven_productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
       inven_location: {
            type: DataTypes.STRING,
            defaultValue: "UnKnown"
       },
       inven_reservations: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            defaultValue: []
       },
       inven_stock: {
            type: DataTypes.INTEGER,
            allowNull: false
       },
       inven_shopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            }
       }
    },
    { 
        tableName: 'inventories',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
)

inventory.belongsTo(Shop, { as: 'shop', foreignKey: 'inven_shopId' });
module.exports = {inventory}