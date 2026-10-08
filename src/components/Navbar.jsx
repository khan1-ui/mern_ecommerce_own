import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../store/cart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  const submitSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    navigate(
      value
        ? `/products?search=${encodeURIComponent(value)}`
        : "/products"
    );
  };

  const logoutHandler = () => {
    logout();
    navigate("/");
  };

  const accountPath = user
    ? isAdmin
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="store-header">

        {/* Top Strip */}
        <div className="top-strip">
          <div className="store-container top-strip-inner">
            <span>দেশজুড়ে দ্রুত ডেলিভারি</span>
            <span>•</span>
            <span>Cash on Delivery available</span>

            <span className="top-strip-spacer" />

            <span>
              সহায়তা:{" "}
              {import.meta.env.VITE_SUPPORT_PHONE ||
                "01XXXXXXXXX"}
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="main-header">
          <div className="store-container main-header-inner">

            {/* Mobile Menu */}
            <button
              className="icon-button mobile-only"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Brand */}
            <Link
              to="/"
              className="brand"
              aria-label="Home"
            >
              <span className="brand-mark">N</span>

              <span>
                <strong>
                  {import.meta.env.VITE_STORE_NAME ||
                    "Nexora Store"}
                </strong>

                <small>
                  Smart shopping, simple living
                </small>
              </span>
            </Link>

            {/* Search */}
            <form
              className="header-search desktop-search"
              onSubmit={submitSearch}
            >
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="আপনি কী খুঁজছেন?"
                aria-label="Search products"
              />

              <button type="submit">
                Search
              </button>
            </form>

            {/* Header Actions */}
            <div className="header-actions">

              <Link
                to="/products"
                className="header-action desktop-action"
              >
                <span>▦</span>
                <small>Categories</small>
              </Link>

              <Link
                to={accountPath}
                className="header-action desktop-action"
              >
                <span>♙</span>

                <small>
                  {user
                    ? isAdmin
                      ? "Admin"
                      : "Account"
                    : "Sign in"}
                </small>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="cart-button"
                aria-label="Cart"
              >
                <span>🛒</span>
                <b>{cartCount}</b>
              </Link>

            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mobile-search-wrap">
          <form
            className="header-search"
            onSubmit={submitSearch}
          >
            <span>⌕</span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="পণ্য খুঁজুন..."
            />

            <button type="submit">
              খুঁজুন
            </button>
          </form>
        </div>

        {/* Category Navigation */}
        <nav className="category-nav">
          <div className="store-container category-nav-inner">

            <Link onClick={() => setOpen(false)} to="/products">
              সব পণ্য
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?category=Fashion">
              পোশাক
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?category=Beauty">
              বিউটি
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?category=Home">
              হোম & কিচেন
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?category=Food">
              ফুড & গ্রোসারি
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?category=Electronics">
              ইলেকট্রনিক্স
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?sort=popular">
              বেস্ট সেলার
            </Link>

            <Link onClick={() => setOpen(false)} to="/products?offer=true">
              অফার
            </Link>

          </div>
        </nav>
      </header>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <div
        className={`drawer-backdrop ${
          open ? "show" : ""
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`mobile-drawer ${
          open ? "open" : ""
        }`}
      >

        {/* Drawer Header */}
        <div className="drawer-head">

          <div className="brand compact">
            <span className="brand-mark">
              N
            </span>

            <strong>
              {import.meta.env.VITE_STORE_NAME ||
                "Nexora Store"}
            </strong>
          </div>

          <button
            className="icon-button"
            onClick={() => setOpen(false)}
          >
            ×
          </button>

        </div>

        {/* Account */}
        <div className="drawer-account">

          <div className="account-avatar">
            ♙
          </div>

          <div>

            <strong>
              {user
                ? `Hello, ${user.name || "User"}`
                : "Hello there!"}
            </strong>

            <span>
              {user
                ? isAdmin
                  ? "Manage your store"
                  : "View your account"
                : "Sign in to manage orders"}
            </span>

          </div>

        </div>

        {/* =================================================
            ADMIN QUICK ACCESS
        ================================================= */}

        {isAdmin && (
          <div className="drawer-section">

            <p>Admin</p>

            <Link onClick={() => setOpen(false)} to="/admin">
              🛠️ Admin Dashboard
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/admin/products">
              📦 Products
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/admin/orders">
              🧾 Orders
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/admin/users">
              👥 Customers
              <span>›</span>
            </Link>

          </div>
        )}

        {/* =================================================
            SHOP CATEGORIES
        ================================================= */}

        <div className="drawer-section">

          <p>Shop by category</p>

          {[
            ["সব পণ্য", "/products"],
            ["পোশাক", "/products?category=Fashion"],
            ["বিউটি", "/products?category=Beauty"],
            ["হোম & কিচেন", "/products?category=Home"],
            ["ফুড & গ্রোসারি", "/products?category=Food"],
            [
              "ইলেকট্রনিক্স",
              "/products?category=Electronics",
            ],
            ["অফার", "/products?offer=true"],
          ].map(([label, href]) => (
            <Link onClick={() => setOpen(false)} key={href} to={href}>
              {label}
              <span>›</span>
            </Link>
          ))}

        </div>

        {/* =================================================
            USER QUICK LINKS
        ================================================= */}

        {!isAdmin && (
          <div className="drawer-section">

            <p>Quick links</p>

            <Link onClick={() => setOpen(false)} to="/cart">
              🛒 Cart
              <span>{cartCount}</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/dashboard/orders">
              📦 My Orders
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/dashboard/profile">
              ♡ Wishlist
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/">
              ❔ Help & Support
              <span>›</span>
            </Link>

          </div>
        )}

        {/* Login */}
        {!user && (
          <div className="drawer-section">

            <Link onClick={() => setOpen(false)} to="/login">
              🔐 Login
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/register">
              👤 Create Account
              <span>›</span>
            </Link>

            <Link onClick={() => setOpen(false)} to="/admin/login">
              🛠️ Admin Login
              <span>›</span>
            </Link>

          </div>
        )}

        {/* Logout */}
        {user && (
          <button
            className="drawer-logout"
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}

      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav className="mobile-bottom-nav">

        <Link onClick={() => setOpen(false)} to="/">
          <span>⌂</span>
          <small>Home</small>
        </Link>

        <Link onClick={() => setOpen(false)} to="/products">
          <span>▦</span>
          <small>Categories</small>
        </Link>

        <Link
          to="/cart"
          className="bottom-cart"
        >
          <span>
            🛒
            <b>{cartCount}</b>
          </span>

          <small>Cart</small>
        </Link>

        <Link onClick={() => setOpen(false)} to="/products">
          <span>⌕</span>
          <small>Search</small>
        </Link>

        <Link onClick={() => setOpen(false)} to={accountPath}>
          <span>♙</span>

          <small>
            {user
              ? isAdmin
                ? "Admin"
                : "Account"
              : "Login"}
          </small>
        </Link>

      </nav>
    </>
  );
};

export default Navbar;
