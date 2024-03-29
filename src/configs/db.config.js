require ("dotenv").config()
const {Sequelize} = require("sequelize")

const dev = {
    app: {
        port: process.env.DEV_PORT
    },
    db : new Sequelize(process.env.DEV_DB_NAME, process.env.DEV_DB_USER,process.env.DEV_DB_PASSWORD, {
        host: 'db',
        dialect: 'postgres',
    })

}

const pro = { //product
    app: {

    },
    db: {

    }
}

const config = {dev,pro}
const envMode =  process.env.NODE_ENV || "dev"

module.exports = config[envMode] 