const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (request, response) => {
    const newUser = new User(
        {
            username: request.body.username,
            email: request.body.email,
            //encrypt the password using CryptoJS (AES)
            password: CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD).toString()

        }
    );
    //save the new user to databas
    try {
        const savedUser = await newUser.save();
        response.status(201).json(savedUser);
    }
    catch(error) {
        response.status(500).json(error);
    }
});




//login
router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({username: request.body.username});
        //If username does not exist
        !user && response.status(401).json("Wrong username!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD).toString(CryptoJS.enc.Utf8);
        //If input password is wrong
        hashedPassword !== request.body.password && response.status(401).json("Wrong password!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY,
        {expiresIn:"30d"}
        );

        //no password output
        const {password, ...others} = user._doc;


        response.status(201).json({...others, accessToken});
    }
    catch (error) {
        response.status(500).json(error);
    }
});






module.exports = router;