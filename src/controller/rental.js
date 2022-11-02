const schemaValidation = require('../Validation')
const debug = require('debug')(process.env.DEBUG)
const Rental = require('../models/rental');
const Movie = require('../models/movie');
const Customer = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');

// Initialize the Fawn in mongo db for Transaction purpose
Fawn.init(`${process.env.DEV_DB_CONNECTION}${process.env.DEV_DB}`);

class Rentals {

    constructor(){
        //Empty
    }

    //GET method List the All data from DB
    async getAll(req, res){
        try{
            debug("Inside the getAll API");
            const rentalRes = await Rental.find({
                status: {$eq: 'Active'}
            })
            const count = await Rental.count({status: 'Active'});
            res.send({count: count, data: rentalRes});
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        } 
    }

    // GET method List the particualr single record
    async getById(req, res){
        try{
            //First check the data for given the id in DB
            const rentalRes = await Rental.find({_id: req.params.id, status: 'Active'})

            if(rentalRes && Object.keys(rentalRes).length > 0){
                //Find the data from DB and send the data to client
                res.send(rentalRes);
            }else{
                res.status(404).send(`No data found, Please check the ID: ${req.params.id}`);
            }
            
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        } 
    }

    //POST method for Create new data 
    async create(req, res){
        try{
            const data = JSON.parse(JSON.stringify(req.body));

            const { error, value } = schemaValidation.rental.validate(data);
            if(error) return res.status(400).send(error.details[0].message);

            //Find the Customer data is exist or Not
            const customerData = await Customer.findById(req.body.customerid).select('-status -__v')
            debug("findCustomer: ", customerData);
            if(!customerData) return res.status(400).send('Customer not found');

            //Find the Movie data is exist or Not
            const movieData = await Movie.findById(req.body.movieid).select({
                movie: 1,
                genres: 1,
                price: 1
            });
            debug("findMovie: ", movieData);
            if(!movieData) return res.status(400).send('Movie not found');

            // Form the Rental data using Customers and Movies data
            const rentalData = await new Rental({
                customer: customerData,
                movie: movieData
            })

            debug("Fawn: ", Fawn);
            // Save the Rental data and Update the Current Stock in the Movies collection
            /*

            1) Here we can use the Transaction, because two task here we done so 'Transaction' is 
               the better solution
            2) Use of Transaction Complete the all task or any issue occurs roll back the all registerd task 
               from database.
            3) Here we can  use the "Fawn" package this package make the transaction in mongoose. 
            4) We can use the chaining methods in Fawn.Task()
            5) Fawm Constructor directly access the Mongo collections 

            */

            //Define new Fawn constructor
            const rentalRes = await new Fawn.Task()
                .save('rentals', rentalData)
                .update('movies', {_id: movieData._id}, {
                    $inc:{ stock: -1 }
                })
                .run()
            debug("rentalRes: ", rentalRes)
            res.send(rentalData);
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    };

    //PUT method Update the existing data
    // async update(req, res){
    //     try{
    //         debug(" Customer update >>>>>>>>>>>>>>", req)
    //         // Clean and structure the Data
    //         const data = JSON.parse(JSON.stringify(req.body));
            
    //         //validate the request
    //         const { error, value} = schemaValidation.customer.validate(data);
    //         if(error) return res.status(400).send(error.details[0].message); 

    //         //find the data
    //         const findData = await Customer.findById(req.params.id);

    //         if(findData && Object.keys(findData).length > 0){
    //            //Update the movie using mongoose findByIdAndUpdate method
    //             const customerRes = await Customer.findByIdAndUpdate(req.params.id, { $set: data }, {new: true})
    //             res.send(customerRes);                  
    //         }else{
    //             res.status(404).send(`No data found, Plase check the ID: ${req.params.id}`);
    //         }           

    //     }catch(error){
    //         debug("Faild", error);
    //         res.status(404).send(error.message);
    //     }
    // }

    //DELETE method 
    async delete(req, res){
        try{
            /* In delete API we use soft delete it means only change the status ,
               Not completly delete the records
            */
            const findData = await Rental.findById(req.params.id);

            // Check the data is exist or not
            if(findData && Object.keys(findData).length > 0){
                // If data exist then only update the status to Inactive
                const removedCustomer = await Rental.findByIdAndUpdate(req.params.id, 
                    { $set: { status: 'Inactive' }},
                    { new: true});           
                res.send(removedCustomer);

            }else{
                res.status(404).send(`No Data found, Please check the ID: ${req.params.id}`);
            }

        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    }
}

exports.rental = new Rentals();