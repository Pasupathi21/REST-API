const mongoose = require('mongoose');

/*
1) Rental Schema relationship between the Movie and Customer
2) First implemet the rental schema 
3) Include the Movie and Customer Schemas
    - Required fields only include the Rental Schema 
*/

//Required Movie Schemas
const movieSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
        min: 0    
    }
});

//Required Movie Schemas
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        trim: true
    },
    isGold:{
        type: Boolean,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        validate: {
            validator: function(value){
                return /\d{10}/.test(value)
            },
            message: "Please enter valid phone number"
        }
    }
})

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true,
    },
    rentaldate:{
        type: Date,
        dafault: Date.now
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}))

module.exports = Rental;