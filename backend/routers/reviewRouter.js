import express from 'express';
import { createReview, getAllReviews, deleteReview } from '../controller/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post("/", createReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
