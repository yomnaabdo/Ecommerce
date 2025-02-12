import { useState, useEffect } from "react";
import axios from "axios";
import Products from "../Prouducts/Prouducts";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";

export default function Home() {
    const [search] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const images = [img1, img2];
    const [currentImage, setCurrentImage] = useState(0);
    const [currentCategory, setCurrentCategory] = useState(0);
    const categoriesPerPage = 5;

    useEffect(() => {
        fetchProducts();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
            setCategories(data.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const totalCategorySlides = Math.ceil(categories.length / categoriesPerPage);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Image Slider */}
            <div className="relative mb-6 flex">
                <div className="w-1/2 relative">
                    <img
                        src={images[currentImage]}
                        alt={`Slide ${currentImage + 1}`}
                        className="w-96 object-cover rounded-md"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
                                    currentImage === index ? "bg-black scale-125" : "bg-gray-400"
                                }`}
                            ></span>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 flex flex-col gap-4">
                    <img
                        src={img3}
                        alt="Side Image 1"
                        className="w-full h-64 object-cover rounded-md"
                    />
                    <img
                        src={img4}
                        alt="Side Image 2"
                        className="w-full h-64 object-cover rounded-md"
                    />
                </div>
            </div>

            {/* Category Slider */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <div className="relative flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg overflow-hidden">
                    {categories.slice(currentCategory * categoriesPerPage, (currentCategory + 1) * categoriesPerPage).map((category, index) => (
                        <div key={index} className="flex flex-col items-center min-w-[180px]">
                            <div className="w-40 h-40 rounded-md shadow-lg bg-white flex items-center justify-center overflow-hidden">
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="mt-3 text-center font-medium text-gray-700 text-lg">{category.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalCategorySlides }).map((_, index) => (
                        <span
                            key={index}
                            onClick={() => setCurrentCategory(index)}
                            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
                                currentCategory === index ? "bg-black scale-125" : "bg-gray-400"
                            }`}
                        ></span>
                    ))}
                </div>
            </div>

            {/* View All Products */}
            <Products
                search={search}
                products={products}
                loading={loading}
                error={error}
            />
        </div>
    );
}

