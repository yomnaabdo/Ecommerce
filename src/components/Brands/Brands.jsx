import { useState, useEffect } from "react";
import axios from "axios";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const { data } = await axios.get(
                "https://ecommerce.routemisr.com/api/v1/brands"
            );
            setBrands(data.data);
        } catch {
            setErrorMessage("Failed to fetch brands");
        } finally {
            setLoading(false);
        }
    };

    const fetchBrandDetails = async (brandId) => {
        setModalLoading(true);
        try {
            const { data } = await axios.get(
                `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`
            );
            setSelectedBrand(data.data);
        } catch {
            setSelectedBrand(null);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Top Brands</h2>

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
            {errorMessage && (
                <p className="text-red-500 text-center text-lg">{errorMessage}</p>
            )}

            {/* Brands Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <div
                        key={brand._id}
                        onClick={() => fetchBrandDetails(brand._id)}
                        className="border border-gray-200 p-4 rounded-lg shadow-md bg-white transition-all duration-300 
                                            hover:border-green-500 hover:shadow-lg hover:shadow-green-300 group cursor-pointer"
                    >
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className="w-full h-40 object-cover rounded-md transition-transform duration-300 
                                                group-hover:scale-105"
                        />
                        <h3 className="text-lg font-semibold mt-3 text-center text-gray-800">
                            {brand.name}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedBrand && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
                            onClick={() => setSelectedBrand(null)}
                        >
                            &times;
                        </button>
                        {modalLoading ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <img
                                    src={selectedBrand.image}
                                    alt={selectedBrand.name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                                <h3 className="text-xl font-semibold text-center">
                                    {selectedBrand.name}
                                </h3>
                                <p className="text-center text-gray-500 mt-2">
                                    {selectedBrand.description || "No description available"}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
