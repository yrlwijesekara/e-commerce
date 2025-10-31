import Order from '../models/order.js';

export async function createOrder(req, res) {
    const newOrder = new Order(req.body);
    if (!req.user) {
        return res.status(401).json({
            message: "Please log in to place an order",
            error: "User not authenticated"
        });
    }
    const latestOrderID = await Order.findOne().sort({ createdAt: -1 }).limit(1);
    let nextOrderNumber = 1;
    
    if (latestOrderID && latestOrderID.orderID) {
        // Extract the numeric part from the orderID (remove "c" prefix)
        const currentNumber = parseInt(latestOrderID.orderID.replace(/\D/g, ''));
        nextOrderNumber = currentNumber + 1;
    }
    
    // Set the new orderID with "c" prefix and padded zeros
    newOrder.orderID = "c" + nextOrderNumber.toString().padStart(6, '0');
    
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            message: "Error creating order",
            error: "Internal Server Error"
        });
    }
}