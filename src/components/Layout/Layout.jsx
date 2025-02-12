import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Home from "../Home/Home";
import Brands from "../Brands/Brands";
import WishList from "../WishList/WishList";
import Categories from "../Categories/Categories";
import Prouducts from "../Prouducts/Prouducts";
import Page404 from "../Page404/Page404";
import ForgetPassword from "../ForgetPassword/ForgetPassword";

export default function Layout() {
    const [showArrow, setShowArrow] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowArrow(true);
        } else {
            setShowArrow(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="py-6 container">
                <Outlet>
                    <Login />
                    <Register />
                    <ForgetPassword />
                    <Home />
                    <Brands />
                    <WishList />
                    <Categories />
                    <Prouducts />
                    <Page404 />
                </Outlet>
            </div>

            {/* Scroll to Top Button */}
            {showArrow && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition"
                    aria-label="Scroll to top"
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            )}
        </>
    );
}
