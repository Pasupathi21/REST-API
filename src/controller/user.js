/*
1) Using lodash method for efficiently to handle the objects and arrays
2) Using Hash the password security purpose 
3) Implement the JSON WEB tokens 
*/

// Authentication and Authorization
//Model
const { User } = require('../models/user');
// Joi validation
const { user } = require('../Validation');
// Lodash
const _ = require('lodash');
//DEBUG module
const debug = require('debug')(process.env.DEBUG);
//Schema validation 
const schemaValidation = require('../Validation');
//bcrypt for password hashing
const bcrypt = require('bcrypt');

class Users {
    constructor(){
        //Empty
    }

    //GET method List the All data from DB
    async getAll(req, res){
        try{
            debug("Inside the getAll API");
            let userRes = await User.find({
                status: {$eq: 'Active'}
            })
            const count = await User.count();
            // userRes = _.pick(userRes, ['_id', 'name', 'email', 'password']);
            res.send({count: count, data: userRes});
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        } 
    }

    // GET method List the particualr single record
    async getById(req, res){
        try{
            debug("Inside the GETBYID >>>>>>>")
            //First check the data for given the id in DB
            const userRes = await User.find({_id: req.params.id, status: 'Active'})

            if(userRes && Object.keys(userRes).length > 0){
                //Find the data from DB and send the data to client
                res.send(userRes);
            }else{
                res.status(404).send(`No data found, Please check the ID: ${req.params.id}`);
            }
            
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        } 
    }

    // New Route for getting current user
    async getCurrentUser(req, res){
        try{
            debug("CURRENT USER: ", req.user);
            const currentUser = await User.findOne({_id: req.user.id, status: 'Active'}).select({
                name: 1,
                email: 1,
            })
            res.send(currentUser)
        }catch(e){
            res.status(400).send(e.message)
        }
    }

    //POST method for Create new data 
    async create(req, res){
        /*
        1) Validate the Request with Joi 
        2) Check the use is Exist or Not using "mongoose findOne" with "email"
        3) Response return only required key in the objects using lodash
        4) Hash the password using "bcrypt" 
        */
        try{
            const data = JSON.parse(JSON.stringify(req.body));
            const saltValue = 10;

            // First validate the Request objects
            const { error, value } = schemaValidation.user.validate(data);
            if(error) return res.status(400).send(error.details[0].message);

            //To Check the If user is already Exist or Not
            const findUser = await User.findOne(_.pick(req.body, ['email']));
            if(findUser) return res.status(400).send("User already exist");

            // Validate with the mongoose schema
            //If user not exist then create the user
            const userData = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

            // Hash the password before the "save" method
            // First "Salt" and "Hash" the password
            const salt = await bcrypt.genSalt(saltValue);
            //Extract password from the Request Data
            const hashed = await bcrypt.hash(userData.password, salt);
            //Reassign the hashed password to userData(res.body) 
            userData.password = hashed;

            const userRes = await userData.save();
            
            //Response send to the client only required keys in the objects to using lodash _.pick method
            res.send(_.pick(userRes, ['name', 'email', 'password']));
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    };

    //PUT method Update the existing data
    async update(req, res){
        try{
            // Clean and structure the Data
            const data = JSON.parse(JSON.stringify(req.body));
            
            //validate the request
            const { error, value} = schemaValidation.user.validate(data);
            if(error) return res.status(400).send(error.details[0].message); 

            //find the data
            const findData = await User.findById(req.params.id);

            if(findData && Object.keys(findData).length > 0){
               //Update the movie using mongoose findByIdAndUpdate method
                const userRes = await User.findByIdAndUpdate(req.params.id, { $set: data }, {new: true})
                res.send(userRes);                  
            }else{
                res.status(404).send(`No data found, Plase check the ID: ${req.params.id}`);
            }           

        }catch(error){
            debug("Faild", error);
            res.status(404).send(error.message);
        }
    }

    //DELETE method 
    async delete(req, res){
        try{
            /* In delete API we use soft delete it means only change the status ,
               Not completly delete the records
            */
            const findData = await User.findById(req.params.id);

            // Check the data is exist or not
            if(findData && Object.keys(findData).length > 0){
                // If data exist then only update the status to Inactive
                const userRemoved = await User.findByIdAndUpdate(req.params.id, 
                    { $set: { status: 'Inactive' }},
                    { new: true});           
                res.send(userRemoved);

            }else{
                res.status(404).send(`No Data found, Please check the ID: ${req.params.id}`);
            }

        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    }
}


module.exports.user = new Users()