
const schemaValidation = require('../Validation')
const debug = require('debug')(process.env.DEBUG)
//Import the Movie model
const Movie = require('../models/movie');
const logger  = require('../middleware/errorlogs');

class VidlyMovies {
    
    constructor(){
        //Empty
    }

    //GET method List the All data from DB
    async getAll(req, res, next){
        try{
            debug("Decoded token user data: ", req.user);
            throw new Error('Just Checking purpose...');
            const movieResponse = await Movie.find()
            const count = await Movie.count();
            res.send({count: count, data: movieResponse});
        }catch(error){
            // debug("Faild: ", error);
            // Pass the error to error middleware
            logger.log(error)
            res.status(404).send(error.message);
        } 
    }

    // GET method List the particualr single record
    async getById(req, res){
        try{
            //First check the data for given the id in DB
            const movieReponse = await Movie.find({_id: req.params.id, status: 'Active'})
            .select({
                movie: 1,
                rating: 1,
                director: 1,
                genres: 1,
                runningtime: 1
            });
            if(movieReponse && Object.keys(movieReponse).length > 0){
                //Find the data from DB and send the data to client
                res.send(movieReponse);
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
            // Clean and structure the Data
            const data = JSON.parse(JSON.stringify(req.body));

            //Validate the request 
            // Using destructure for get error validation
            const { error, value } = schemaValidation.genres.validate(data);
            if(error) return res.status(400).send(error.details[0].message);
            
            //Create the data in the Mongo Database
            //First create the Instance for Movie model then pass into the request body
            //Using await method, because the Movie objects return the Promise
            const movie =  new Movie(req.body);
            //Save the document in the mongodb collection
            const movieResponse = await movie.save();
            //Return the response to the client        
            res.send(movieResponse);
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
            const { error, value} = schemaValidation.genres.validate(data);
            if(error) return res.status(400).send(error.details[0].message); 

            //find the data
            const findData = await Movie.findById(req.params.id);

            if(findData && Object.keys(findData).length > 0){
                // If data exist then only update the data 
                 /*Three agrs 
                    1) Id of the documents 
                    2) Updated data 
                    3) Retrun the updated data as Response
                */
               //Update the movie using mongoose findByIdAndUpdate method
                const movieResponse = await Movie.findByIdAndUpdate(req.params.id, { $set: data }, {new: true})
                res.send(movieResponse);                  
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

            // Clean and structure the Data
            const data = JSON.parse(JSON.stringify(req.body));
            const findData = await Movie.findById(req.params.id);

            // Check the data is exist or not
            if(findData && Object.keys(findData).length > 0){

                // If data exist then only update the status to Inactive
                const removeMovie = await Movie.findByIdAndUpdate(req.params.id, 
                    { $set: { status: 'Inactive' }},
                    { new: true});           
                res.send(removeMovie);

            }else{
                res.status(404).send(`No Data found, Please check the ID: ${req.params.id}`);
            }

        }catch(error){
            debug("Faild: ", error);
            res.status(404).send(error.message);
        }
    }
}

module.exports.vidlymovies = new VidlyMovies();