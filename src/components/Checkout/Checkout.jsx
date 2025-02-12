import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
    const [shippingAddress, setShippingAddress] = useState({
        details: "",
        phone: "",
        city: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cartId, setCartId] = useState(null);
    
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch cart from the API
    useEffect(() => {
        const fetchCart = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setError("You must be logged in to fetch the cart.");
                return;
            }

            try {
                const response = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
                    headers: { token },
                });

                if (response.data.cartId) {
                    setCartId(response.data.cartId);
                } else {
                    setError("Your cart is empty.");
                }
            } catch (error) {
                setError("Failed to fetch cart. Please try again.");
                console.error("Cart fetch error:", error);
            }
        };

        fetchCart();
    }, []);

    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to checkout.");
            return;
        }

        if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
            toast.error("All fields are required.");
            return;
        }

        if (!cartId) {
            toast.error("Cart ID is missing. Please add items to your cart.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:5175`,
                {
                    shippingAddress: {
                        details: shippingAddress.details,
                        phone: shippingAddress.phone,
                        city: shippingAddress.city,
                    },
                },
                {
                    headers: { token },
                }
            );

            if (response.data.status === "success") {
                toast.success("Order placed successfully!");
                navigate("/payment"); // Navigate to the payment page on success
            } else {
                toast.error("Checkout failed. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please check your details and try again.");
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Checkout</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-1">Address Details</label>
                    <input
                        type="text"
                        name="details"
                        value={shippingAddress.details}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="Enter address details"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="Enter city"
                    />
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold flex justify-center items-center gap-2 hover:bg-green-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin" size={30} /> : "Place Order"}
                </button>
            </div>

            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
        </div>
    );
}
