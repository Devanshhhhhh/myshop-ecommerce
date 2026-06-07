import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import ProductPage from "./pages/ProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";

// 👇 Separate component to use useLocation
function Layout() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const location = useLocation();

  // ❌ Hide navbar on login & register
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#111",
      color: "#fff",
      borderRadius: "10px"
    }
  }}
  />

  return (
    <>
      {/* ✅ Navbar shown everywhere except login/register */}
      {!hideNavbar && (
        <Navbar
          search={search}
          setSearch={setSearch}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          category={category}
          setCategory={setCategory}
        />
      )}

      <Routes>
        <Route path="/" element={<Home search={search} maxPrice={maxPrice} category={category}/>} />

        <Route
          path="/home"
          element={
              <Home search={search} maxPrice={maxPrice} />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/product/:id" element={<ProductPage />} />

        <Route path="/wishlist" element={<ProtectedRoute> <Wishlist /> </ProtectedRoute>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}