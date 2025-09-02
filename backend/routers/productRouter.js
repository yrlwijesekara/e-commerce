import { createProduct } from "../controller/productController.js";
import express from "express";

const router = express.Router();

router.post("/", createProduct);

export default router;
