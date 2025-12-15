import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5
        }
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
