// Import Joi Class
const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().min(5).required(),
    age: Joi.number().required()
})

const genres = Joi.object({
    movie: Joi.string().required().label('Movie Name'),
    // genres: Joi.string().required().label('Movie Genres Type'),
    genres: Joi.array().items(Joi.string().required().label(" Movie Genres Type")),
    rating: Joi.number().required().label('Movie Rating'),
    runningtime: Joi.number().label('Running Time'),
    stock: Joi.number().min(0).required().label("Stock Quantity"),
    price: Joi.number().min(0).required().label("Price Amont"),
    director:Joi.string(),
    releasedate:Joi.string()
})

const customer = Joi.object({
    name: Joi.string().required().label("Customer Name"),
    isGold: Joi.boolean().required().label('Gold Customer'),
    phone: Joi.number().required().label("Phone Number")
})

const rental = Joi.object({
    customerid: Joi.string().required().label("Customer"),
    movieid: Joi.string().required().label("Movie")
})

const user = Joi.object({
    name: Joi.string().min(1).max(50).required().label('User Name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(6).max(255).required().label('Password'),
    isAdmin: Joi.boolean()
})

exports.schema = schema;
exports.genres = genres;
exports.customer = customer;
exports.rental = rental;
exports.user = user;
