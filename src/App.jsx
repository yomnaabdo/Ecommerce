import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login"; // Ensure Login is correctly imported
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Prouducts from "./components/Prouducts/Prouducts";
import Cart from "./components/Cart/Cart";
import Brands from "./components/Brands/Brands";
import WishList from "./components/WishList/WishList";
import Page404 from "./components/Page404/Page404";
import Categories from "./components/Categories/Categories";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Checkout from "./components/Checkout/Checkout";
import Payment from "./components/Payment/Payment.jsx";
import GetAllOrders from "./components/GetAllOrders/GetAllOrders";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgetpassword", element: <ForgetPassword /> },
      { path: "/home", element: <Home /> },
      { path: "/products", element: <Prouducts /> },
      { path: "/cart", element: <Cart /> },
      { path: "/brands", element: <Brands /> },
      { path: "/wishlist", element: <WishList /> },
      { path: "/categories", element: <Categories /> },
      { path: "/payment", element: <Payment /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/getallorders", element: <GetAllOrders /> },
      { path: "*", element: <Page404 /> },
    ],
  },
]);

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
