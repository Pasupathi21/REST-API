const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Extra schema added for RBAC (Roll Based Access Control)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }

});

// Create the JSON web token in Commonly for Register and Login time
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email,
        isAdmin: this.isAdmin ? this.isAdmin : false,
    }, process.env.SECRET_KEY);
}

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;