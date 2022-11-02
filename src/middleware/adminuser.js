// Admon user middleware 
// Check the user is Admin or Not 
// This is Role based access control
const debug = require('debug')(process.env.DEBUG);

function isAdminOrNot(req, res, next){
    if(req.user.isAdmin){
        debug("REQUEST USER: ", req.user);
        next();
    }else{
        //403 is Forbident - This user can not use this route or service
        res.status(403).send("Access denied")
    }
}

module.exports.isAdmin = isAdminOrNot