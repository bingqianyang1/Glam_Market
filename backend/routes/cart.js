const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Create cart
router.post("/", verifyToken, async (request, response) => {
    const newCart = new Cart(request.body);
    try {
        const savedCart = await newCart.save();
        response.status(200).json(savedCart);
    } catch (error) {
        response.status(500).json(error);
    }
  });



//Update cart
router.put("/:id", verifyTokenAndAuthorization, async (request, response) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(request.params.id, {$set: request.body}, {new: true});
        response.status(200).json(updatedCart);
    } catch (error) {
        response.status(500).json(error);
    }
  });



//Delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (request, response) => {
    try {
        await Cart.findByIdAndDelete(request.params.id);
        response.status(200).json("Cart has been deleted");
    } catch (error) {
        response.status(500).json(error);
    }
});


  

//Get user cart by user id 
router.get("/find/:userId", verifyTokenAndAuthorization, async (request, response) => {
    try {
        //find by user id, not cart id, use condition here
        const cart = await Cart.findOne({userId: request.params.userId});
        response.status(200).json(cart);
    } catch (error) {
        response.status(500).json(error);
    }
});



//Get all carts of all users
router.get("/", verifyTokenAndAdmin, async (request, response) => {
    try {
        const carts = await Cart.find();
        response.status(200).json(carts);
    } catch (error) {
        response.status(500).json(error);
    }
});



module.exports = router;