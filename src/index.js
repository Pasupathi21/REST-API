//Dot-env file import
require('dotenv').config()

// Import express
const express = require('express');
// Express  object
const app = express();

//import custom middleware
const middleware = require('./custom-middleware');

//Debug package import
const debug = require('debug')(process.env.DEBUG);

//Import all Routes
const routes = require('./routes/routes');

//DB connection
const {connection} = require('./db/db');

//Import error log index file
// const { logger } = require('./middleware/errorlogs')

// Import the winston package
const winston = require('winston');

const port = process.env.PORT || 5000;

// To configure Application json 
//Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Winston logger configurations
// Simple log configuration
winston.add( winston.transports.File, {filename:'AppLogs.log'});


// Middle processed sequentially 
// app.use(middleware.delayMiddleware);

//DB connection msg
connection.then(() => { debug('Database successfully connected...')})
.catch(error => debug('Connection failed', error));

//Over All routes
app.use('/api', routes.route);

// Define error middleware 
//Error middleware shuold be define the last
// app.use(logger.logError);

// Port configure
app.listen(port, () => {
    debug(`Port Listen on http://localhost:${port}`)
})
