import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to place an order",
      error: "User not authenticated",
    });
  }

  try {
    // Fetch full user data from database to get phone and address
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "Invalid user",
      });
    }

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
      email: user.email,
      name: user.firstname + " " + user.lastname,
      address: user.address || "No address provided",
      phone: user.phone || "No phone provided",
      items: items,
      totalAmount: totalAmount,
    });

    console.log("Creating order with user details:", {
      email: user.email,
      name: user.firstname + " " + user.lastname,
      address: user.address,
      phone: user.phone
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder);
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      message: "Error creating order",
      error: error.message || "Internal Server Error",
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

export async function updateOrderStatus(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to update order",
      error: "User not authenticated",
    });
  }

  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "You don't have permission to update orders",
      error: "Forbidden",
    });
  }

  try {
    const { status, notes } = req.body;
    const orderId = req.params.id;

    // Build update object dynamically
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    console.log("Order updated:", updatedOrder);
    res.status(200).json({
      message: status !== undefined ? "Order status updated successfully" : "Order notes updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      message: "Error updating order",
      error: error.message || "Internal Server Error",
    });
  }
}
