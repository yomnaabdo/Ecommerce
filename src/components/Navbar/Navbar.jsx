import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/images.png";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(!!token);

        if (token) {
            axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
                headers: { token },
            })
            .then(response => {
                setCartCount(response.data.numOfCartItems || 0);
            })
            .catch(error => {
                console.error("Error fetching cart items:", error);
            });
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="h-10" />
                    <span className="text-xl font-bold">Fresh Cart</span>
                </div>

                <div className="hidden md:flex space-x-6">
                    {isLoggedIn && (
                        <>
                            <NavLink to="/home" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Home</NavLink>
                            <NavLink to="/cart" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Cart</NavLink>
                            <NavLink to="/wishlist" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Wishlist</NavLink>
                            <NavLink to="/products" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Products</NavLink>
                            <NavLink to="/categories" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Categories</NavLink>
                            <NavLink to="/brands" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Brands</NavLink>
                        </>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                        <NavLink to="/cart" className="relative cursor-pointer">
            <i className="fas fa-shopping-cart fa-xl h-6 w-6"></i>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2">
                    {cartCount}
                </span>
            )}
        </NavLink>
                            <button onClick={handleLogout} className="text-green-700">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" className={({ isActive }) => isActive ? "text-green-600" : "text-green-500"}>Login</NavLink>
                            <NavLink to="/register" className={({ isActive }) => isActive ? "text-green-600" : "text-green-500"}>Register</NavLink>
                        </>
                    )}
                </div>

                <button className="md:hidden p-2 rounded-lg focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <i className="fas fa-times h-6 w-6"></i> : <i className="fas fa-bars h-6 w-6"></i>}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
                    {isLoggedIn ? (
                        <>
                            <NavLink to="/home" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Home</NavLink>
                            <NavLink to="/cart" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Cart</NavLink>
                            <NavLink to="/wishlist" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Wishlist</NavLink>
                            <NavLink to="/products" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Products</NavLink>
                            <NavLink to="/categories" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Categories</NavLink>
                            <NavLink to="/brands" className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-600"}>Brands</NavLink>
                            <NavLink to="/cart" className="relative cursor-pointer">
            <i className="fas fa-shopping-cart fa-xl h-6 w-6"></i>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2">
                    {cartCount}
                </span>
            )}
        </NavLink>
                            <button onClick={handleLogout} className="text-green-700">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" className={({ isActive }) => isActive ? "text-green-600" : "text-green-500"}>Login</NavLink>
                            <NavLink to="/register" className={({ isActive }) => isActive ? "text-green-600" : "text-green-500"}>Register</NavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
