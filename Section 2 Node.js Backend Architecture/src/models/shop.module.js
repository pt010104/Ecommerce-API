const config = require("../configs/dbConfig")

class User {
    async findByEmail (email){
        try {
            const query = "SELECT * FROM shop WHERE email = $1"
            const {rows} = await config.db.query(query,[email])
            return rows[0]
        }
        catch(err)
        {
            throw(err)
        }
    }   
    async create(email,name,password)
    {
        try{
                const query = "INSERT INTO shop (email,name,password) VALUES ($1,$2,$3) RETURNING id"
                const {rows} = await config.db.query(query,[email,name,password]) //password hashed
                return rows[0]
            } 
        catch (err) 
        {
            throw(err)
        }
    }
}

module.exports = new User()