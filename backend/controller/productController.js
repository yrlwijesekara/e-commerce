import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {
   if(!isAdmin(req)){
    return res.status(403).json({
        message: "Access denied",
        error: "User is not an admin"
    });
   }

    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(
            {
                message: "Product created successfully",
                product: savedProduct
            });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            message: "Error creating product",
            error: "Internal Server Error"
        });
    }
}

export async function getProducts(req, res) {

    try {
        if(isAdmin(req)){
            const products = await Product.find();
            res.status(200).json({
                message: "Products retrieved successfully",
                products: products
            });
        }else{
            const products = await Product.find({ isAvailable: true });
            res.status(200).json({
                message: "Products retrieved successfully",
                products: products
            });
        }
    } catch (error) {
        console.error("Error retrieving products:", error);
        return res.status(500).json({
            message: "Error retrieving products",
            error: "Internal Server Error"
        });
    }
}
