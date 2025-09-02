import { createProduct } from "../controller/productController.js";
import { getProducts } from "../controller/productController.js";
import express from "express";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);

export default router;
