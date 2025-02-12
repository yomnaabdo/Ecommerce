import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🔹 Handle Input Change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Form Validation
    const validateForm = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format.";
        if (form.password.length < 6) return "Password must be at least 6 characters.";
        if (form.password !== form.rePassword) return "Passwords do not match.";
        if (!/^\d{10,15}$/.test(form.phone)) return "Invalid phone number.";
        return null;
    };

    // 🔹 Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const error = validateForm();

        if (error) {
            toast.error(error);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/auth/signup",
                form
            );

            console.log("Registration successful:", data);
            toast.success("Registration successful! 🎉");

            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">📝 Register</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-green-300"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-green-300"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-green-300"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="rePassword"
                            value={form.rePassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-green-300"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring focus:ring-green-300"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2">
                        <button
                            type="submit"
                            className={`w-full py-2 rounded text-white transition ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
}
