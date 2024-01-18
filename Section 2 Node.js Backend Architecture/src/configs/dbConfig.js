require ("dotenv").config
const pg = require ("pg")

const dev = {
    app: {
        port: process.env.DEV_PORT
    },
    db :  new pg.Client({
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        host: process.env.DEV_DB_HOST,
        database: process.env.DEV_DB_NAME,
        port: process.env.DEV_DB_PORT
    })
}

const pro = { //product
    app: {

    },
    db: {

    }
}

const config = {dev,pro}
const envMode =  process.env.MODE_ENV || "dev"

module.exports = config[envMode] 