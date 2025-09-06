import { createProduct } from "../controller/productController.js";
import { getProducts } from "../controller/productController.js";
import { deleteProduct } from "../controller/productController.js";
import { updateProduct } from "../controller/productController.js";
import express from "express";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);              
router.delete("/:productId", deleteProduct);
router.put("/:productId", updateProduct);
export default router;
