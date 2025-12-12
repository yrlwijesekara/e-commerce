import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiMail, HiArrowLeft, HiKey, HiLockClosed } from "react-icons/hi";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: otp & password, 3: success

    async function handleSendOTP() {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/send-reset-password-otp",
                { email }
            );
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error);
            if (error.response?.status === 404) {
                toast.error("No account found with this email address");
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword() {
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }
        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password",
                { email, otp, newPassword }
            );
            toast.success("Password reset successful!");
            setStep(3);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error);
            if (error.response?.status === 404) {
                toast.error("OTP not found or expired");
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || "Invalid OTP");
            } else {
                toast.error("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md">
                {/* Back to Login Link */}
                <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <HiArrowLeft className="text-xl" />
                    <span className="text-sm sm:text-base">Back to Login</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                        {step === 1 ? <HiMail className="text-3xl text-white" /> : 
                         step === 2 ? <HiKey className="text-3xl text-white" /> :
                         <HiLockClosed className="text-3xl text-white" />}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        {step === 1 ? "Forgot Password?" : 
                         step === 2 ? "Verify OTP" : 
                         "Password Reset!"}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        {step === 1 ? "No worries! Enter your email and we'll send you an OTP." :
                         step === 2 ? "Enter the OTP sent to your email and create a new password." :
                         "Your password has been reset successfully!"}
                    </p>
                </div>

                {step === 1 ? (
                    // Step 1: Email Input
                    <div className="space-y-6">
                        <div className="relative">
                            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{" "}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : step === 2 ? (
                    // Step 2: OTP & Password Reset
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <p className="text-blue-800 text-xs sm:text-sm">
                                OTP sent to <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="relative">
                            <HiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base tracking-widest text-center font-semibold"
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Didn't receive the OTP?
                            </p>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setOtp("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                ) : (
                    // Step 3: Success State
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <p className="text-green-800 text-sm sm:text-base">
                                Your password has been reset successfully!
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}