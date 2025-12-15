import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar, FaTrash } from "react-icons/fa";
import { HiMail, HiUser } from "react-icons/hi";

export default function Reviewmanagement() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + '/api/reviews'
            );
            setReviews(response.data.reviews);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to load reviews");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        setDeleting(id);
        try {
            await axios.delete(
                import.meta.env.VITE_BACKEND_URL + `/api/reviews/${id}`
            );
            toast.success("Review deleted successfully");
            setReviews(reviews.filter(review => review._id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Failed to delete review");
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Review Management
                    </h1>
                    <p className="text-gray-600">
                        Total Reviews: <span className="font-semibold text-blue-600">{reviews.length}</span>
                    </p>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-xl text-gray-500">No reviews yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    {/* User Info & Rating */}
                                    <div className="flex-1">
                                        {/* User Details */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <HiUser className="text-gray-600 text-lg" />
                                                <span className="font-semibold text-gray-800 text-lg">
                                                    {review.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HiMail className="text-gray-600 text-lg" />
                                                <span className="text-gray-600">
                                                    {review.email}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar
                                                        key={index}
                                                        className={
                                                            index < review.rating
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                        size={20}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold text-gray-700">
                                                {review.rating}/5
                                            </span>
                                        </div>

                                        {/* Review Message */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {review.message}
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <p className="text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="flex lg:flex-col items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            disabled={deleting === review._id}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaTrash />
                                            {deleting === review._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}