const schemaValidation = require('../Validation')
const debug = require('debug')(process.env.DEBUG)
const Customer = require('../models/customer');

class Customers {

    constructor(){
        //Empty
    }

    //GET method List the All data from DB
    async getAll(req, res){
        try{
            debug("Inside the getAll API");
            const customerRes = await Customer.find({
                status: {$eq: 'Active'}
            })
            const count = await Customer.count();
            res.send({count: count, data: customerRes});
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        } 
    }

    // GET method List the particualr single record
    async getById(req, res){
        try{
            //First check the data for given the id in DB
            const customerRes = await Customer.find({_id: req.params.id, status: 'Active'})

            if(customerRes && Object.keys(customerRes).length > 0){
                //Find the data from DB and send the data to client
                res.send(customerRes);
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

            const { error, value } = schemaValidation.customer.validate(data);
            if(error) return res.status(400).send(error.details[0].message);


            const customer =  new Customer(req.body);
            const customerRes = await customer.save();       
            res.send(customerRes);
        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    };

    //PUT method Update the existing data
    async update(req, res){
        try{
            debug(" Customer update >>>>>>>>>>>>>>", req)
            // Clean and structure the Data
            const data = JSON.parse(JSON.stringify(req.body));
            
            //validate the request
            const { error, value} = schemaValidation.customer.validate(data);
            if(error) return res.status(400).send(error.details[0].message); 

            //find the data
            const findData = await Customer.findById(req.params.id);

            if(findData && Object.keys(findData).length > 0){
               //Update the movie using mongoose findByIdAndUpdate method
                const customerRes = await Customer.findByIdAndUpdate(req.params.id, { $set: data }, {new: true})
                res.send(customerRes);                  
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
            const findData = await Customer.findById(req.params.id);

            // Check the data is exist or not
            if(findData && Object.keys(findData).length > 0){
                // If data exist then only update the status to Inactive
                const removedCustomer = await Customer.findByIdAndUpdate(req.params.id, 
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

module.exports.customer = new Customers();