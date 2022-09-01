const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Update user
router.put("/:id", verifyTokenAndAuthorization, async (request, response) => {
    //check password when updating, still encrypting password
    if (request.body.password) {
        request.body.password = CryptoJS.AES.encrypt(request.body.password, process.env.PASSWORD).toString();
    }
    //then update the user
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, {$set: request.body}, {new: true});
        response.status(200).json(updatedUser);
    } catch (error) {
        response.status(500).json(error);
    }
});


//Delete user
router.delete("/:id", verifyTokenAndAuthorization, async (request, response) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        response.status(200).json("User has been deleted");
    } catch (error) {
        response.status(500).json(error);
    }
});

  
//Get user by id
router.get("/find/:id", verifyTokenAndAdmin, async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        //avoid showing the password of user
        const {password, ...others} = user._doc;
        response.status(200).json(others);
    } catch (error) {
        response.status(500).json(error);
    }
});


//Get all users
router.get("/", verifyTokenAndAdmin, async (request, response) => {
    const query = request.query.new;
    try {
        //if there is query, return lastest 5 users, else return all users
        const users = query ? await User.find().sort({ _id: -1 }).limit(5): await User.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json(error);
    }
});


//Get user stats
router.get("/stats", verifyTokenAndAdmin, async (request, response) => {
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
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json(error);
    }
});



module.exports = router;