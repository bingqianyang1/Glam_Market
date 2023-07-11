const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    //check password when updating, still encrypting password
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD).toString();
    }
    //then update the user
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        res.status(500).json(error);
    }
});

  
//Get user by id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //avoid showing the password of user
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        //if there is query, return lastest 5 users, else return all users
        const users = query ? await User.find().sort({ _id: -1 }).limit(5): await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            //condition: greater the last year
            {$match: {createdAt: {$gte: lastYear}}},
            //take out the month value
            {$project: {month: {$month: "$createdAt" }}},
            //calculate all registered users by its month
            {$group: {_id: "$month", total: {$sum: 1}}},
        ]);
        resizeBy.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;