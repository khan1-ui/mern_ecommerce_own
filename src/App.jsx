import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

// User dashboard
import DashboardHome from "./dashboard/DashboardHome";
import Orders from "./dashboard/Orders";
import Profile from "./dashboard/Profile";

// Admin
import AdminHome from "./admin/AdminHome";
import AdminProducts from "./admin/Products";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import StoreImport from "./admin/StoreImport";
import StoreSettings from "./admin/StoreSettings";
import AdminOrders from "./admin/Orders";
import Users from "./admin/Users";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User account */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AddProduct />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            <Route path="/admin/import" element={<StoreImport />} />
            <Route path="/admin/store-settings" element={<StoreSettings />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
