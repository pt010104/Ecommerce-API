const {DataTypes} = require ("sequelize")
const db = require ("../configs/dbConfig").db
const Shop = require('./shop.model'); 

const discount = db.define("discounts", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },    
        discount_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_type: {
            type: DataTypes.STRING,
            defaultValue: 'fixed_amount'
        },
        discount_value: {
            type: DataTypes.DECIMAL(10,1),
            allowNull: false
        },
        discount_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount_start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        discount_end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        discount_max_uses: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_uses_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_users_used: {
            type: DataTypes.ARRAY(DataTypes.INTEGER), 
            defaultValue: []
        },
        discount_max_uses_per_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_min_order_value: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_min_order_value: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_shopId: {
            type: DataTypes.INTEGER, 
            references: {
                model: Shop, 
                key: 'id'
            }
        },
        discount_is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        discount_applies_to: {
            type: DataTypes.ENUM('all', 'specific'),
            allowNull: false
        },
        discount_product_ids: {
            type: DataTypes.ARRAY(DataTypes.INTEGER), 
            defaultValue: []
        }
    },
    { 
        tableName: 'discounts',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
)

discount.belongsTo(Shop, { as: 'shop', foreignKey: 'discount_shopId' });
module.exports = {discount}