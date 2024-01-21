const app = require("./src/app")
const PORT = 5050

const config = require("./src/configs/dbConfig")

config.db.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
        process.exit(1); 
    } else {
        console.log('Connected to database');
    }
})

const server = app.listen (PORT, () =>{
    console.log(`Start with ${PORT}`)
})

process.on('SIGINT', ()=>{
    server.close( () => console.log("Exist server express") )
})
