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

export async function deleteProduct(req, res) {
    if(!isAdmin(req)){
        return res.status(403).json({
            message: "Access denied",
            error: "User is not an admin"
        });
    }

    
    try {
        const productId = req.params.productId;
        const result = await Product.deleteOne({ productId: productId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Product not found",
                error: "No product found with this productId"
            });
        }
        
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Error deleting product",
            error: "Internal Server Error"
        });
    }
}

export async function updateProduct(req, res) {
    if(!isAdmin(req)){
        return res.status(403).json({
            message: "Access denied",
            error: "User is not an admin"
        });
    }
    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;

    try {
        await Product.updateOne({ productId: productId }, data);
        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: "Error updating product",
            error: "Internal Server Error"
        });
    }
}

export async function getProductInfo(req, res) {
  try {
    if (isAdmin(req)) {
      const productId = req.params.productId;
      const product = await Product.findOne({ productId: productId });
      if (product == null) {
        return res.status(404).json({
          message: "Product not found",
          error: "No product found with this productId"
        });
      }
      res.status(200).json({
        message: "Product info retrieved successfully",
        product: product
      });
    } else {
      const productId = req.params.productId;
      const product = await Product.findOne({ productId: productId, isAvailable: true });
      if (product == null) {
        return res.status(404).json({
          message: "Product not found",
          error: "No product found with this productId"
        });
      }
      res.status(200).json({
        message: "Product info retrieved successfully",
        product: product
      });
    }
  } catch (error) {
    console.error("Error retrieving product info:", error);
    return res.status(500).json({
      message: "Error retrieving product info",
      error: "Internal Server Error"
    });
  }
}

export async function searchProducts(req, res) {
  const query = req.params.query;
  try {
      const products = await Product.find({
          $or: [
              { name: { $regex: query, $options: 'i' } },
              { altname: { $regex: query, $options: 'i' } },
          ]
      });
      res.status(200).json({
          message: "Search completed successfully",
          products: products
      });
  } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({
          message: "Error searching products",
          error: "Internal Server Error"
      });
  }
}
