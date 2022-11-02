console.log("<-------------------JUST PRACTICES --------------------->")

// Using bcrypt pack for hashing password
const bcrypt = require('bcrypt');

async function run(pwd){
    try{
        // Default salt value is 10
        // Return the promise
        const salt = await bcrypt.genSalt(10);
        console.log("Salt Result: ", salt);

        //using Hash method with salt , given password converted to the Hash password
        const hashed = await bcrypt.hash(pwd, salt);
        console.log("Hashed  Result: ", hashed);
    }catch(e){
        console.log("Error: ", e);
    }
}

async function authValidation(reqPass, encPass){
    // To decrypt the hashing password and compare the request password
    //Using "compare" method 
    const valid = await bcrypt.compare(reqPass, encPass)
    console.log("Validated Password Result: ", valid);
}
// run("Hello World");
authValidation('Hello World', "$2b$10$/KN2YI2iG61sRxEhKVW29urmUFuMnOClNA92b/1/jEbRp9HQpJ3ZG")


