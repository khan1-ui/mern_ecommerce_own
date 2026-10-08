import { Link } from "react-router-dom";

const Footer = () => <footer className="store-footer">
  <div className="store-container footer-grid">
    <div><div className="brand footer-brand"><span className="brand-mark">N</span><strong>{import.meta.env.VITE_STORE_NAME || "Nexora Store"}</strong></div><p>ভালো পণ্য, সহজ অর্ডার এবং নির্ভরযোগ্য ডেলিভারি—সব এক জায়গায়।</p></div>
    <div><h4>Shop</h4><Link to="/products">সব পণ্য</Link><Link to="/products?sort=popular">Best Sellers</Link><Link to="/products?offer=true">Offers</Link></div>
    <div><h4>Customer Care</h4><Link to="/dashboard/orders">My Orders</Link><Link to="/">Delivery Info</Link><Link to="/">Return Policy</Link></div>
    <div><h4>Contact</h4><p>{import.meta.env.VITE_SUPPORT_PHONE || "01XXXXXXXXX"}</p><p>{import.meta.env.VITE_SUPPORT_EMAIL || "support@example.com"}</p><p>সকাল ৯টা — রাত ১০টা</p></div>
  </div>
  <div className="footer-bottom"><div className="store-container">© {new Date().getFullYear()} {import.meta.env.VITE_STORE_NAME || "Nexora Store"}. All rights reserved. Developed By Sazin</div></div>
</footer>;

export default Footer;
