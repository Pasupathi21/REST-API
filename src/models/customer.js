const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}));

module.exports = Customer;