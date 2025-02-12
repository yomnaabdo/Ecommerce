import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [rePassword, setRePassword] = useState(""); // For confirming the new password
    const [step, setStep] = useState(1); // 1: Forgot Password, 2: Verify Reset Code, 3: Reset Password
    const [loading, setLoading] = useState(false);

    // Handle forgot password (Step 1)
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
                { email }
            );

            if (response.status === 200) {
                toast.success("Password reset link sent to your email!");
                setStep(2); // Move to reset code verification step
            }
        } catch {
            toast.error("Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle verify reset code (Step 2)
    const handleVerifyResetCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
                { resetCode }
            );

            if (response.status === 200) {
                toast.success("Reset code verified! You can now reset your password.");
                setStep(3); // Move to the reset password step
                // Proceed to reset password
            }
        } catch {
            toast.error("Invalid reset code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle reset password (Step 3)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate the new password and confirmation
        if (newPassword !== rePassword) {
            toast.error("New passwords do not match. Please try again.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
                {
                    email: email, // User email
                    newPassword: newPassword,
                }
            );

            if (response.status === 200) {
                toast.success("Your password has been successfully reset!");
                setStep(1); // Reset to step 1 after successful password update
                navigate("/"); // Navigate to the login page after resetting the password
            }
        } catch {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    {step === 1
                        ? "Forgot Password"
                        : step === 2
                        ? "Verify Reset Code"
                        : "Reset Password"}
                </h2>

                {/* Step 1: Forgot Password */}
                {step === 1 && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 bg-green-600 text-white rounded-lg font-semibold ${
                                loading ? "opacity-50" : ""
                            }`}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                {/* Step 2: Verify Reset Code */}
                {step === 2 && (
                    <form onSubmit={handleVerifyResetCode}>
                        <div className="mb-4">
                            <label htmlFor="resetCode" className="block text-gray-600">
                                Enter Reset Code
                            </label>
                            <input
                                type="text"
                                id="resetCode"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 bg-green-600 text-white rounded-lg font-semibold ${
                                loading ? "opacity-50" : ""
                            }`}
                        >
                            {loading ? "Verifying..." : "Verify Reset Code"}
                        </button>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-600">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="rePassword" className="block text-gray-600">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="rePassword"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 bg-green-600 text-white rounded-lg font-semibold ${
                                loading ? "opacity-50" : ""
                            }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgetPassword;
