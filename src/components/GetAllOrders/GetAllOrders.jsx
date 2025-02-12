import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GetAllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = sessionStorage.getItem("userId"); // Get userId from sessionStorage
      if (!userId) {
        setError("You must be logged in to view your orders.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        );
        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          setError("No orders found.");
        }
      } catch (error) {
        setError("Failed to fetch orders. Please try again.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Fetch orders on component mount
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          All Orders
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          <div>
            {orders.length > 0 ? (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order._id} className="border-b border-gray-300 pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order._id}
                    </h3>
                    <p className="text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Total: ${order.total}</p>
                    <div className="mt-2">
                      <h4 className="font-semibold text-gray-700">Items:</h4>
                      <ul className="list-disc pl-6">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-gray-600">
                            {item.name} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-700">No orders found.</p>
            )}
          </div>
        )}
      </div>

      {/* Toast Container for React Toastify */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
}

