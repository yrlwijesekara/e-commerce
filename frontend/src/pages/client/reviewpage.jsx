import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

export default function ReviewPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch user details
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                const userData = response.data.user;
                setUser(userData);
                // Pre-fill form with user data
                if (userData) {
                    const fullName = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
                    setName(fullName);
                    setEmail(userData.email);
                }
                setLoadingUser(false);
            })
            .catch(error => {
                console.error("Error fetching user:", error);
                setLoadingUser(false);
                if (error.response?.status === 401) {
                    toast.error("Please login to submit a review");
                    navigate('/login');
                }
            });
        } else {
            setLoadingUser(false);
            toast.error("Please login to submit a review");
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill all fields");
            return;
        }

        setSubmitting(true);

        try {
            const reviewData = {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                rating
            };
            
            console.log("Submitting review:", reviewData);
            
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + '/api/reviews',
                reviewData
            );

            console.log("Review response:", response.data);
            toast.success("Review submitted successfully!");
            setMessage("");
            setRating(5);
        } catch (error) {
            console.error("Error submitting review:", error);
            console.error("Error response:", error.response?.data);
            const errorMessage = error.response?.data?.message || "Failed to submit review. Please try again.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[color-mix(in_srgb,var(--color-secondary)_30%,white)] py-10 px-4 flex justify-center items-center">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">
                    Share Your Experience
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    We'd love to hear your feedback!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter your name"
                            disabled={submitting}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-gray-50"
                            placeholder="Enter your email"
                            disabled={submitting}
                            readOnly
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rating
                        </label>
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => setRating(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                        className="transition-transform hover:scale-110"
                                        disabled={submitting}
                                    >
                                        <FaStar
                                            size={32}
                                            className={
                                                ratingValue <= (hover || rating)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    </button>
                                );
                            })}
                            <span className="ml-2 text-lg font-semibold text-gray-700">
                                {rating} / 5
                            </span>
                        </div>
                    </div>

                    {/* Message Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Tell us about your experience..."
                            disabled={submitting}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}