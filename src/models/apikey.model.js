const config = require("../configs/dbConfig")

class apiKey {
    
        async findOne ({key, status}) {
            console.log({key, status})
            const query = "SELECT * FROM apikeys WHERE key = $1 AND status = $2 LIMIT 1"
            try{
                const {rows} = await config.db.query(query, [key, status])
                return rows[0]
            }
            catch (error) {
                throw (error);
            }
        }

    
}

module.exports = new apiKey();