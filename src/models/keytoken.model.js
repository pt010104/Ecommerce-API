const config = require("../configs/dbConfig")

class keyToken {

    async create ({userId,publicKey,privateKey}){
        const query = `
        INSERT INTO keytoken (user_id, publickey, privatekey)
        VALUES ($1, $2, $3)
        RETURNING *;
        `
        try {
            const {rows} = await config.db.query(query,[userId,publicKey, privateKey])
            return rows[0]
        } catch (error) {
            throw (error);
        }
    }

    async updateRefreshToken(id, newRefreshTokens) {
        const query = `
          UPDATE keytoken
          SET refreshToken = $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *;
        `;
    
        try {
          const res = await pool.query(query, [id, newRefreshTokens]);
          return res.rows[0];
        } catch (err) {
          throw new Error(`Error updating KeyToken: ${err.message}`);
        }
    }

    async getKeyTokenById (id){
        const query = `
        SELECT * FROM keytoken WHERE id = $1
        `
        try {
            const {rows} = config.db.query(query,[id])
            return rows[0]
        } catch (error) {
            throw (error);
        }
    }
}

module.exports = new keyToken()