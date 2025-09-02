import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    altname: {
        type: [String],
        default: []
    },
    labelledprice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        default: ["/default-image.jpg"]
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        default: "cosmetics"
    }
});
const Product = mongoose.model("Product", productSchema);
export default Product;