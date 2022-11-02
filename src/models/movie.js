//----------------------- Model ----------------
// Import mongoose
const mongoose = require('mongoose');

// Create schema for Movie collection documents (Shape of our documents)
//Create the model for save the document in our collections and with using of querying documents
// Schema and Model combine into the single constant

const Movie = mongoose.model('Movie', new mongoose.Schema({
    movie:{
         type: String,
         required: true,
         minlength: 1,
         validate:{
            validator: function(value){
                console.log(" value: ", value);
                return !(value.startsWith(' ') || value.endsWith(' '));
            },
            message: "White space not allowed"
         }
         },
    genres: {
         type: Array,
         validate: {
            validator: function(value){
                return value && value.length > 0
            },
            message: "Genres is required"
         }
        },
    rating:{
        type: Number,
        required:true
    },
    runningtime:{
        type: Number
    },
    director:{
        type: String,
        default: null
    },
    releasedate:{
        type: Date,
        default: Date.now
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0    
    },    
    status:{
        type: String,
        enum:['Active', 'Inactive'],
        default: 'Active'
    }
}));

//Export the model
module.exports = Movie;
