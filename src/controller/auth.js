/*
1) Implement the encrypt the password using "bcrypt"
2) Implement the JWT token in the Using "jsonwebtoken"
*/
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const Joi = require('Joi');
const _ = require('lodash');
const debug = require('debug')(process.env.DEBUG);

class AuthUser {

    async authenticateUser(req, res){
        // 1) Validate the client request with Joi
        const { error } = new AuthUser().validateWithJoi(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        // 2) Find the Data from User Collection based on the email(unique) 
        const findUser = await User.findOne({email: req.body.email})
        if(!findUser) return res.status(400).send('Inavlid email or password');

        // 3) If user is Exist then "Encrypt" the password
        // 4) Compare the Encrypted password with client request password using "bcrypt" package
        const isValid = await bcrypt.compare(req.body.password, findUser.password);  

        if(isValid){
            //Return the Json web token to Inject the required keys in the token
            // Token generate and get by the user schema
            // "generateAuthToken" --> Called to use the Instance (findUser is Instance)

            const token = findUser.generateAuthToken()

            // In this case we pass the token to "RESPONSE HEADER"
            // Add "Header" section in the response
            //header('x-nameof the token', token value)
            res.header('x-access-token', token).send(_.pick(findUser, ['_id', 'name']))

        }else{
            res.status(400).send('Invalid Password');
        }    
    }

    validateWithJoi(data){

        //Only the email and Pass object validation required
        const userSchema = Joi.object({
            email: Joi.string().email().required().label("Email"),
            password: Joi.string().min(6).max(255).required().label("Password")
        })

        return userSchema.validate(data)
    }

}

module.exports.auth = new AuthUser()