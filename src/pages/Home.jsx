import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const categories = [
  { name: "পোশাক", key: "Fashion", icon: "👕", tone: "peach" },
  { name: "ফুড & গ্রোসারি", key: "Food", icon: "🍯", tone: "cream" },
  { name: "হোম & কিচেন", key: "Home", icon: "🏠", tone: "blue" },
  { name: "বিউটি", key: "Beauty", icon: "💄", tone: "pink" },
  { name: "ইলেকট্রনিক্স", key: "Electronics", icon: "🎧", tone: "green" },
  { name: "লাইফস্টাইল", key: "Lifestyle", icon: "🎁", tone: "lavender" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (error) {
        console.error("Products load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const bestSelling = useMemo(
    () => products.filter((product) => product.isBestSeller).slice(0, 8),
    [products]
  );

  const newArrivals = useMemo(() => {
    const arrivals = products.filter((product) => !product.isBestSeller).slice(0, 8);
    return arrivals.length ? arrivals : products.slice(0, 8);
  }, [products]);

  if (loading) return <Loader />;

  return (
    <div className="storefront">
      <section className="hero-section store-container">
        <div className="hero-copy">
          <span className="eyebrow">নতুন কালেকশন • নতুন অফার</span>
          <h1>
            প্রতিদিনের পছন্দ,<br /><span>এখন আরও সহজে।</span>
          </h1>
          <p>
            ফ্যাশন থেকে লাইফস্টাইল—বিশ্বস্ত পণ্য, সহজ অর্ডার এবং আপনার দরজায় ডেলিভারি।
          </p>
          <div className="hero-actions">
            <Link to="/products" className="primary-button">এখনই শপ করুন <span>→</span></Link>
            <Link to="/products?offer=true" className="secondary-button">অফার দেখুন</Link>
          </div>
          <div className="trust-points">
            <span>✓ Cash on Delivery</span>
            <span>✓ সহজ রিটার্ন</span>
            <span>✓ দ্রুত ডেলিভারি</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-circle" />
          <div className="hero-card hero-card-main">
            <div className="hero-product-placeholder">🛍️</div>
            <div><small>Today's pick</small><strong>আপনার পছন্দের পণ্য</strong></div>
          </div>
          <div className="hero-float hero-float-one">🔥 Best Seller</div>
          <div className="hero-float hero-float-two">🚚 Fast Delivery</div>
        </div>
      </section>

      <section className="store-container section-block">
        <div className="section-heading centered">
          <div><span>Explore</span><h2>জনপ্রিয় ক্যাটাগরি</h2></div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.key}
              to={`/products?category=${category.key}`}
              className={`category-card ${category.tone}`}
            >
              <div className="category-icon">{category.icon}</div>
              <strong>{category.name}</strong>
              <span>দেখুন →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="offer-banner store-container">
        <div>
          <span>LIMITED TIME OFFER</span>
          <h2>আজকের পছন্দে বিশেষ ছাড়</h2>
          <p>নির্বাচিত পণ্যে আকর্ষণীয় অফার।</p>
        </div>
        <Link to="/products?offer=true" className="white-button">সব অফার দেখুন →</Link>
      </section>

      <ProductSection
        title="বেস্ট সেলার"
        subtitle="যেগুলো আমাদের ক্রেতারা সবচেয়ে বেশি পছন্দ করছেন"
        products={bestSelling}
        badge="🔥 Best Seller"
      />

      <ProductSection
        title="নতুন এসেছে"
        subtitle="আপনার জন্য নতুন কিছু পণ্য"
        products={newArrivals}
        badge="New Arrival"
      />

      <section className="service-strip store-container">
        <Service icon="🚚" title="দ্রুত ডেলিভারি" text="দেশজুড়ে নির্ভরযোগ্য ডেলিভারি" />
        <Service icon="🔒" title="নিরাপদ অর্ডার" text="আপনার তথ্য সুরক্ষিত রাখা হয়" />
        <Service icon="↩" title="সহজ রিটার্ন" text="সমস্যা হলে সহজ সমাধান" />
        <Service icon="💬" title="কাস্টমার সাপোর্ট" text="প্রয়োজনে আমরা পাশে আছি" />
      </section>
    </div>
  );
};

const ProductSection = ({ title, subtitle, products, badge }) => (
  <section className="store-container section-block">
    <div className="section-heading">
      <div><span>Shop now</span><h2>{title}</h2><p>{subtitle}</p></div>
      <Link to="/products">সব দেখুন →</Link>
    </div>
    {products.length ? (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} badge={badge} />
        ))}
      </div>
    ) : (
      <div className="empty-state">এখনও কোনো পণ্য যোগ করা হয়নি।</div>
    )}
  </section>
);

const Service = ({ icon, title, text }) => (
  <div className="service-item">
    <span>{icon}</span>
    <div><strong>{title}</strong><small>{text}</small></div>
  </div>
);

export default Home;
