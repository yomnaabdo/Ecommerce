import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchWishlist(token);
    }
  }, [navigate]);

  const fetchWishlist = async (token) => {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        {
          headers: { token },
        }
      );
      setWishlist(data.data);
    } catch  {
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          headers: { token },
        }
      );
      setWishlist((prevWishlist) =>
        prevWishlist.filter((product) => product._id !== productId)
      );
      toast.success("Item removed from wishlist.");
    } catch  {
      toast.error("Failed to remove item.");
    }
  };

  const addToCart = async (productId) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId, count: 1 },
        { headers: { token } }
      );
      toast.success("Item added to cart!");
    } catch  {
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">💖 My Wishlist</h2>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-64 rounded-lg shadow"
            ></div>
          ))}
        </div>
      )}

      {/* No Wishlist Items */}
      {!loading && wishlist.length === 0 && (
        <p className="text-gray-500 text-lg text-center mt-10">
          Your wishlist is empty.
        </p>
      )}

      {/* Wishlist Items */}
      {!loading && wishlist.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 bg-white"
            >
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3">
                {product.title.split(" ").slice(0, 3).join(" ")}
              </h3>
              <p className="text-gray-500 text-sm">
                Category: {product.category?.name || "N/A"}
              </p>
              <p className="text-gray-700 text-lg font-semibold">
                💰 {product.price} EGP
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
                  onClick={() => addToCart(product._id)}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition w-full"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
