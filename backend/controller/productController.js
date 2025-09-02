import Product from "../models/product.js";


export async function createProduct(req, res) {
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