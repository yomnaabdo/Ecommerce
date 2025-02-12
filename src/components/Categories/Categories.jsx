import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.get(
                "https://ecommerce.routemisr.com/api/v1/categories"
            );
            setCategories(data.data);
        } catch {
            setError("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Shop by Category
            </h2>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="border border-gray-200 p-4 rounded-lg shadow-md bg-white transition-all duration-300
                                                hover:border-green-500 hover:shadow-lg hover:shadow-green-300 group cursor-pointer"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-40 object-cover rounded-md transition-transform duration-300
                                                    group-hover:scale-105"
                        />
                        <h3 className="text-lg font-semibold mt-3 text-center text-gray-800">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
