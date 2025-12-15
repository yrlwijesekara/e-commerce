import Review from "../models/review.js";

// Create a new review
export async function createReview(req, res) {
    const { name, email, message, rating } = req.body;

    try {
        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Name, email, and message are required"
            });
        }

        const review = new Review({
            email,
            name,
            message,
            rating: rating || 5
        });

        await review.save();

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({
            message: "Error submitting review",
            error: error.message
        });
    }
}

// Get all reviews
export async function getAllReviews(req, res) {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Reviews retrieved successfully",
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            message: "Error fetching reviews",
            error: error.message
        });
    }
}

// Delete a review (admin only)
export async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        
        const review = await Review.findByIdAndDelete(id);
        
        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.status(200).json({
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            message: "Error deleting review",
            error: error.message
        });
    }
}
