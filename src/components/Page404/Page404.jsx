import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-7xl font-bold text-green-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Oops! The page you’re looking for doesn’t exist.</p>
      <button
        onClick={() => navigate("/home")}
        className="mt-6 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
      >
        <Home size={20} /> Go Home
      </button>
    </div>
  );
}
