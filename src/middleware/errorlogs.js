// Common error logger middleware
const debug = require('debug')(process.env.DEBUG);
const winston = require('winston');

// class ErrorLogs {

//      async logError(error, req, res, next){
//         try{
//             winston.error(error.message, error);
//             res.status(500). send(error.message);

//         }catch(err){
//             //Error in the Error Log class
//             res.status(500). send(err.message);
//         }
//     }
// }

// module.exports.logger = new ErrorLogs();

// const logger = winston.configure({
//     transports: [
//         new winston.transports.File({filename: 'logs/AppLog.log'})
//     ],
//     level: 'error'
// })

const logger = winston.add( winston.transports.File , {filename: 'logs/AppLog.log'}); 

module.exports = logger;
