import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to place an order",
      error: "User not authenticated",
    });
  }

  try {
    // Generate orderID
    const latestOrderID = await Order.findOne()
      .sort({ createdAt: -1 })
      .limit(1);
    let nextOrderNumber = 1;

    if (latestOrderID && latestOrderID.orderID) {
      const currentNumber = parseInt(latestOrderID.orderID.replace(/\D/g, ""));
      nextOrderNumber = currentNumber + 1;
    }

    const orderID = "c" + nextOrderNumber.toString().padStart(6, "0");

    // Validate items format
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({
        message: "Invalid items format",
        error:
          "Items must be an array of objects with productId and quantity properties",
      });
    }

    // Fetch product details and create items array
    const items = [];
    let totalAmount = 0;
    for (const item of req.body.items) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
          error: "Invalid product ID",
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      items.push({
        productId: product.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.image[0] || "default-image.jpg",
        category: product.category,
      });
    }

    // Create order
    const newOrder = new Order({
      orderID: orderID,
      email: req.user.email,
      name: req.user.firstname + " " + req.user.lastname,
      address: req.user.address || "No address provided",
      phone: req.user.phone || "No phone provided",
      items: items,
      totalAmount: totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Error creating order",
      error: "Internal Server Error",
    });
  }
}

export async function getOrders(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to view orders",
      error: "User not authenticated",
    });
  }
  
  try {
    if (isAdmin(req)) {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json({
        message: "Orders retrieved successfully",
        orders: orders,
      });
    } else {
      const orders = await Order.find({ email: req.user.email });
      res.status(200).json({
        message: "Orders retrieved successfully",
        orders: orders,
      });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Error retrieving orders",
      error: "Internal Server Error",
    });
  }
}
