// Mongo db connection 
require('dotenv').config()
const mongoose = require('mongoose');

const connection = mongoose.connect(`${process.env.DEV_DB_CONNECTION}${process.env.DEV_DB}`);

module.exports.connection = connection;
