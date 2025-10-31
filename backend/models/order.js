import e from "express";
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
    {
       orderID : { type: String, required: true, unique: true },
       email : { type: String, required: true },
       name : { type: String, required: true },
       address : { type: String, required: true },
       phone : { type: String, required: true },
       status : { type: String, required: true, default: "Pending" },
       date : { type: Date, required: true, default: Date.now },
       items : [
        {
            productId : { type: String, required: true },
            quantity : { type: Number, required: true },
            price : { type: Number, required: true },
            name : { type: String, required: true },
            image : { type: String, required: true },
        }
       ],
       notes : { type: String, default: "No additional notes" },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
