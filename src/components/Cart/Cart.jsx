import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to login if no token
        } else {
            fetchCart(token);
        }
    }, [navigate]);

    const fetchCart = async (token) => {
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
                headers: { token },
            });

            if (data?.data?.products && Array.isArray(data.data.products)) {
                setCartItems(data.data.products);
            } else {
                setCartItems([]);
                setError("Cart data format is invalid.");
            }
        } catch {
            setError("Failed to fetch cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const token = sessionStorage.getItem("token");
        try {
            await axios.put(
                `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
                { count: newQuantity },
                { headers: { token } }
            );

            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product._id === productId ? { ...item, count: newQuantity } : item
                )
            );
            toast.success("Quantity updated successfully!");
        } catch {
            toast.error("Failed to update quantity. Please try again.");
        }
    };

    const handleRemoveItem = async (productId) => {
        const token = sessionStorage.getItem("token");
        try {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
                headers: { token },
            });

            setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
            toast.success("Item removed from cart.");
        } catch {
            toast.error("Failed to remove item. Please try again.");
        }
    };

    const handleClearCart = async () => {
        const token = sessionStorage.getItem("token");
        try {
            await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
                headers: { token },
            });

            setCartItems([]); // Clear cart UI immediately
            toast.success("Cart cleared successfully!");
        } catch {
            toast.error("Failed to clear cart. Please try again.");
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const totalItems = cartItems.reduce((total, item) => total + item.count, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.count * item.price, 0);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse border p-4 rounded-lg shadow bg-gray-100 h-52"
                        ></div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center text-lg">{error}</p>}

            {/* Cart Items Table */}
            {!loading && cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">Quantity</th>
                                <th className="px-4 py-2 text-left">Total</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product._id} className="border-t">
                                    <td className="px-4 py-2">
                                        <img
                                            src={item.product.imageCover}
                                            alt={item.product.title}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <p className="text-sm">{item.product.title}</p>
                                    </td>
                                    <td className="px-4 py-2">{item.price} EGP</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.count - 1)}
                                                className="bg-gray-300 px-2 py-1 rounded"
                                            >
                                                -
                                            </button>
                                            <span>{item.count}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.count + 1)}
                                                className="bg-gray-300 px-2 py-1 rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">{item.count * item.price} EGP</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveItem(item.product._id)}
                                            className="text-red-500"
                                        >
                                            <i className="fas fa-trash-alt"></i> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Cart Total */}
            {cartItems.length > 0 && (
                <div className="mt-4">
                    <p className="text-lg font-semibold">Total Items: {totalItems}</p>
                    <p className="text-lg font-semibold">Total Price: {totalPrice} EGP</p>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleCheckout}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={handleClearCart}
                            className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
}
