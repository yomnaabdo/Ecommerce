import { useState } from "react";
import { toast } from "react-toastify"; // Import Toastify components
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

export default function Payment() {
    const [paymentData, setPaymentData] = useState({
        cardNumber: "4111111111111111", // Test card number (Visa)
        expiryDate: "12/25", // Test expiry date
        cvv: "123", // Test CVV
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handlePaymentSubmit = async () => {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
            toast.error("All fields are required."); // Use toast for error
            return;
        }

        setLoading(true);
        setError("");

        // Simulate a payment request (replace this with your actual payment logic)
        setTimeout(() => {
          const isPaymentSuccessful = true; // Always simulate success

          if (isPaymentSuccessful) {
            toast.success("Payment successful!");
            // Navigate to the AllOrders component (orders page) after successful payment
            navigate("/getallorders"); // Change to your orders route
          } else {
            toast.error("Payment failed. Please try again.");
          }

          setLoading(false);
        }, 2000); // Simulate a network request delay
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Payment</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-1">Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="Enter card number"
                    />
                </div>

                <div className="mb-4 flex gap-4">
                    <div className="w-1/2">
                        <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                            placeholder="MM/YY"
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block font-semibold text-gray-700 mb-1">CVV</label>
                        <input
                            type="text"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                            placeholder="CVV"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePaymentSubmit}
                    className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold flex justify-center items-center gap-2 hover:bg-green-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}
