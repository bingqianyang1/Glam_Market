const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            //encrypt the password using CryptoJS (AES)
            password: CryptoJS.AES.encrypt(req.body.password, process.env.Crypto_PASSWORD).toString()

        }
    );
    //save the new user to databas
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(error) {
        res.status(500).json(error);
    }
});




//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        //If username does not exist
        !user && response.status(401).json("Wrong username!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.Crypto_PASSWORD).toString(CryptoJS.enc.Utf8);
        //If input password is wrong
        hashedPassword !== req.body.password && res.status(401).json("Wrong password!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY,
        {expiresIn:"5d"}
        );

        //no password output
        const {password, ...others} = user._doc;


        res.status(201).json({...others, accessToken});
    }
    catch (error) {
        res.status(500).json(error);
    }
});






module.exports = router;