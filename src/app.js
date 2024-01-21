const express = require ("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
const compression = require ("compression")
const bodyParser = require ("body-parser")
const app = express()
const router = require ("./routes/index")


//init middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("Combined"))
app.use(helmet())
app.use(compression())
//init db

//init routes
app.use(router)

//handling error
app.use((req,res,next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app