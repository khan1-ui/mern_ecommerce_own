import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryString = searchParams.toString();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products${queryString ? `?${queryString}` : ""}`);
        setProducts(Array.isArray(data) ? data : data?.products || []);
      } catch (error) {
        console.error("Products load failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [queryString]);

  if (loading) return <Loader />;

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const offer = searchParams.get("offer") === "true";
  const bestSeller = searchParams.get("sort") === "popular" || searchParams.get("bestSeller") === "true";
  const sort = searchParams.get("sort") || "default";

  return (
    <main className="products-page store-container">
      <div className="breadcrumb">
        Home <span>›</span> Products
        {category && <><span>›</span> {category}</>}
        {offer && <><span>›</span> Offers</>}
        {bestSeller && <><span>›</span> Best Sellers</>}
      </div>

      <div className="products-toolbar">
        <div>
          <span className="eyebrow">SHOP</span>
          <h1>
            {search
              ? `“${search}” এর ফলাফল`
              : offer
                ? "অফার"
                : bestSeller
                  ? "বেস্ট সেলার"
                  : category || "সব পণ্য"}
          </h1>
          <p>{products.length}টি পণ্য পাওয়া গেছে</p>
        </div>

        <select
          value={sort}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams);
            if (event.target.value === "default") next.delete("sort");
            else next.set("sort", event.target.value);
            navigate(`/products${next.toString() ? `?${next.toString()}` : ""}`);
          }}
          aria-label="Sort products"
        >
          <option value="default">Default Sorting</option>
          <option value="newest">Newest</option>
          <option value="popular">Best Sellers</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {products.length ? (
        <div className="product-grid products-grid-page">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state large">
          কোনো পণ্য পাওয়া যায়নি। অন্য কিছু খুঁজে দেখুন।
        </div>
      )}
    </main>
  );
};

export default Products;
