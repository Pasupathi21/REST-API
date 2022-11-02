function delayMiddleware(req, res, next){
    setTimeout(()=>{
        console.log("Completed")
        next();
    }, 1000)
    console.log("Processing...")
}

module.exports.delayMiddleware = delayMiddleware;