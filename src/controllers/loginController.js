const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

const LoginController = {
    
    loginHandler : async (req, res, next) => {
        console.log("<--- Login Handler --->");
        console.log(req.body);

        const email = req.body.email;
        const password = req.body.password;

        try
        {
            const user = await UserModel.findOne({'email': email});

            // Compare a password with its hash
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    const userId = user._id;
                    const jwtToken = jwt.sign({ userId }, JWT_SECRET_KEY);

                    // Send the token back to the client
                    res.json({ jwtToken });
                } else {
                    console.log("Login Failed!");
                    return res.status(400).send("Wrong Credentials!");
                }
            });
        }
        catch(err)
        {
            console.error("Error fetching User!", err);
            return res.status(500).send("Something went wrong!");
        }

    },

    signUpHandler : async (req, res, next) => {
        console.log("<--- SignUp Handler --->");

        const body = req.body;
        const email = req.email;
        const password = req.password;

        const saltRounds = 10;

        // Hash a password
        bcrypt.hash('myPassword', saltRounds, (err, hash) => {
        if (err) throw err;
        // Store the hash in your database
        console.log(hash);
        });

        
    }

}
module.exports = {
    LoginController
}