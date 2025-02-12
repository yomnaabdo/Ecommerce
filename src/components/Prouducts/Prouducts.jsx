import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]); // Track wishlist items

  useEffect(() => {
    fetchProducts();
    fetchWishlist(); // Fetch wishlist from API
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/products",
        {
          params: {
            limit: 1000,
            sort: "category",
            fields: "title,price,category,imageCover,ratingAverage",
          },
        }
      );
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers: { token } }
      );

      const wishlistIds = data.data.map((item) => item._id);
      setWishlist(wishlistIds);
      localStorage.setItem("wishlist", JSON.stringify(wishlistIds)); // Store in localStorage
    } catch  {
      toast.error("Failed to load wishlist");
    }
  };

  const toggleWishlist = async (productId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to modify your wishlist.");
      return;
    }

    let updatedWishlist;
    if (wishlist.includes(productId)) {
      // Remove from wishlist (API Call)
      try {
        await axios.delete(
          `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
          {
            headers: { token },
          }
        );

        updatedWishlist = wishlist.filter((id) => id !== productId);
        toast.info("Removed from wishlist");
      } catch  {
        toast.error("Failed to remove from wishlist");
        return;
      }
    } else {
      // Add to wishlist (API Call)
      try {
        await axios.post(
          "https://ecommerce.routemisr.com/api/v1/wishlist",
          { productId },
          { headers: { token } }
        );

        updatedWishlist = [...wishlist, productId];
        toast.success("Added to wishlist!");
      } catch  {
        toast.error("Failed to add to wishlist");
        return;
      }
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
  };

  const addToCart = async (productId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    try {
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId, quantity: 1 },
        { headers: { token } }
      );
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const filteredProducts = useMemo(() => {
    return search
      ? products.filter((product) =>
          product.title.toLowerCase().includes(search.toLowerCase())
        )
      : products;
  }, [search, products]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        className="border p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 outline-none mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse border p-4 rounded shadow bg-gray-100 h-72"
            ></div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 p-4 rounded-lg shadow-md bg-white transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-400 group relative"
          >
            <img
              src={product.imageCover}
              alt={product.title}
              className="w-full object-cover rounded h-60"
            />
            <h3 className="text-lg font-semibold mt-3 truncate">
              {product.title}
            </h3>
            <p className="text-gray-500">
              Category: {product.category?.name || "N/A"}
            </p>
            <p className="text-green-600 font-semibold text-lg">
              {product.price} EGP
            </p>
            <div className="flex items-center text-yellow-500 mt-2">
              {[...Array(5)].map((_, i) => {
                const randomRating = Math.floor(Math.random() * 5) + 1;
                return (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < randomRating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  ></i>
                );
              })}
            </div>

            {/* Wishlist Button */}
            <button
              className={`absolute top-4 right-4 transition ${
                wishlist.includes(product._id)
                  ? "text-red-500"
                  : "text-gray-500"
              } hover:text-red-700`}
              onClick={() => toggleWishlist(product._id)}
              aria-label="Add to Wishlist"
            >
              <i className={`fas fa-heart fa-xl`}></i>
            </button>

            {/* Add to Cart Button - Sliding Up Effect */}
            <div className="mt-4 flex justify-center">
              <button
                className="border border-green-500 text-green-500 px-4 py-2 rounded-lg bg-white shadow-md 
        opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                onClick={() => addToCart(product._id)}
              >
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
}
