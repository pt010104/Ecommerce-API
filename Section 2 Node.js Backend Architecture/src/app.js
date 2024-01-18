const express = require ("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const compression = require ("compression")
const bodyParser = require ("body-parser")
const app = express()
const router = require ("./routes/index")


//init middleware
app.use(express.json())
app.use(morgan("Combined"))
app.use(helmet())
app.use(compression())
//init db

//init routes
app.use(router)
//handling error

module.exports = app