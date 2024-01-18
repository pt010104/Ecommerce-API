'use strict'
const bcrypt = require('bcrypt')
const User = require('../models/shop.module')

class AccesService
{
    static signUp = async (email,name,password) => {
        try {
            const {result} = User.findByEmail(email)
            if (result)
                return{ 
                    message: "Email aldready registerd"
                };
            else{
                const rounds = 10;
                password = bcrypt.hash(password,rounds)

                const user = await User.create(email,name,password)
            }
        }
        catch (err){

        }
    }
}

module.exports = AccesService