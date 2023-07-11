const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


//Create order
router.post("/", verifyToken, async (request, response) => {
    const newOrder = new Order(request.body);
    try {
        const savedOrder = await newOrder.save();
        response.status(200).json(savedOrder);
    } catch (error) {
        response.status(500).json(error);
    }
  });



//Update order
router.put("/:id", verifyTokenAndAdmin, async (request, response) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(request.params.id, {$set: request.body}, {new: true});
        response.status(200).json(updatedOrder);
    } catch (error) {
        response.status(500).json(error);
    }
  });



//Delete order
router.delete("/:id", verifyTokenAndAdmin, async (request, response) => {
    try {
        await Order.findByIdAndDelete(request.params.id);
        response.status(200).json("Order has been deleted");
    } catch (error) {
        response.status(500).json(error);
    }
});



//Get user orders by user id 
router.get("/find/:userId", verifyTokenAndAuthorization, async (request, response) => {
    try {
        //find by user id, not cart id, use condition here
        const orders = await Order.find({userId: request.params.userId});
        response.status(200).json(orders);
    } catch (error) {
        response.status(500).json(error);
    }
});



//Get all orders of all users
router.get("/", verifyTokenAndAdmin, async (request, response) => {
    try {
        const allOrders = await Order.find();
        response.status(200).json(allOrders);
    } catch (error) {
        response.status(500).json(error);
    }
});

//Get order stats (monthly income)
router.get("/income", verifyTokenAndAdmin, async (request, response) => {
    const productId = request.query.pid;
    const date = new Date();
    //compare the previous 2 month
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
        const income = await Order.aggregate([
            //conditions: greater then previous month
            {$match: {createdAt: {$gte: previousMonth}, ...(productId && {
                products: { $elemMatch: { productId } },
              })
            }},
            //take out the month value and the sales value
            {$project: {month: {$month: "$createdAt"}, sales: "$amount"}},
            //calculate the total sale each month
            {$group: {_id: "$month", total: {$sum: "$sales"}}}]);
        response.status(200).json(income);
    } catch (error) {
        response.status(500).json(error);
    }
});


module.exports = router;