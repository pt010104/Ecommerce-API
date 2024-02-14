const {DataTypes, DATE} = require ("sequelize")
const db = require ("../configs/dbConfig").db
const Shop = require('./shop.model'); 
const slugify = require('slugify');

const products = db.define("products", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_thumb: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_slug: {
            type: DataTypes.STRING,
        },
        product_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        product_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_type : {
            type: DataTypes.ENUM('Electronic', 'Clothing', 'Furniture'),
            allowNull: false
        },
        product_shop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            }
        },
        product_attributes: {
            type: DataTypes.JSONB, 
            allowNull: false,
        },
        product_rating: {
            type: DataTypes.DECIMAL(2, 1),
            validate: {
                min: {
                    args: [1],
                    msg: "Rating must be between 1 and 5"
                },
                max: {
                    args: [5],
                    msg: "Rating must be between 1 and 5"
                }
            },
            defaultValue: 4.5
        },
        product_variations: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        isDraft: {
            type: DataTypes.BOOLEAN,
            index: true,
            defaultValue: true,
            select: false
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            index: true,
            defaultValue: false,
            select: false
        }
    },
    { 
        tableName: 'products',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        hooks: {
            beforeSave: function (products) {
                if (products.product_name) {
                    products.product_slug = slugify(products.product_name.toString(), { lower: true });
                }
                else throw new Error ("Product name is invalid")
            }
        
        }
    }
)
const clothes = db.define("clothes", 
    {   
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product_shop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            }
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.STRING,
        },
        material: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'clothes',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
)

const electronics = db.define("electronics", 
    {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product_shop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            }
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
        },  
        color: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'electronics',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
)
const furnitures = db.define("furnitures", 
    {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product_shop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            }
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.STRING,
        },
        material: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'furnitures',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
)

products.belongsTo(Shop, { as: 'shop', foreignKey: 'product_shop' });
module.exports = {products, clothes, electronics, furnitures}