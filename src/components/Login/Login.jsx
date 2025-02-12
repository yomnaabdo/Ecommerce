import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        { email, password }
      );

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        toast.success("Login successful! 🎉");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        throw new Error("Invalid login response.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🔐 Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-2 border rounded mt-1 ${
                email && !validateEmail(email)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {email && !validateEmail(email) && (
              <p className="text-red-500 text-xs mt-1">Invalid email format.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className={`w-full p-2 border rounded mt-1 ${
                password && !validatePassword(password)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && !validatePassword(password) && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed flex justify-center"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/forgetpassword")}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
