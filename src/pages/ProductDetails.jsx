import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../store/cart";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data?.product || data);
      } catch (error) {
        console.error("Product load failed:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const images = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const base = apiUrl.replace(/\/api\/?$/, "");

    if (!product?.images?.length) {
      return ["https://placehold.co/900x900/f7f7f7/888?text=Product"];
    }

    return product.images.map((image) =>
      image.startsWith("http") ? image : `${base}${image}`
    );
  }, [product]);

  if (loading) return <div className="page-loading">Loading product...</div>;

  if (!product) {
    return <div className="empty-state large">Product not found.</div>;
  }

  const stock = Number(product.stock ?? 0);
  const outOfStock = stock <= 0;
  const maxQuantity = Math.max(1, stock);

  const phone = import.meta.env.VITE_SUPPORT_PHONE || "01XXXXXXXXX";
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || phone.replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `আমি ${product.title} অর্ডার করতে চাই। Quantity: ${quantity}`
  );

  const addProductToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
  };

  const buyNow = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <main className="product-details-page store-container">
      <div className="breadcrumb">
        Home <span>›</span> Products <span>›</span> {product.title}
      </div>

      <div className="product-details-layout">
        <section className="gallery-panel">
          <div className="thumbnail-list">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={activeImage === index ? "active" : ""}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>

          <div className="main-product-image">
            <img src={images[activeImage]} alt={product.title} />
          </div>
        </section>

        <section className="details-panel">
          <span className="eyebrow">
            {outOfStock ? "OUT OF STOCK" : "IN STOCK"}
          </span>

          <h1>{product.title}</h1>

          <div className="detail-rating">★ 4.8 <span>•</span> 24 Reviews</div>

          <div className="detail-price">
            ৳{Number(product.price || 0).toLocaleString("en-BD")}
          </div>

          <p className="detail-description">
            {product.description || "মানসম্মত পণ্য, আপনার জন্য বেছে নেওয়া হয়েছে।"}
          </p>

          <div className="stock-line">
            ● {outOfStock ? "Out of stock" : `${stock}টি available`}
          </div>

          <div className="quantity-row">
            <strong>Quantity</strong>
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={outOfStock}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
                disabled={outOfStock || quantity >= maxQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-button large-button"
              onClick={addProductToCart}
              disabled={outOfStock}
            >
              🛒 Add to Cart
            </button>

            <button
              type="button"
              className="buy-button"
              onClick={buyNow}
              disabled={outOfStock}
            >
              Buy Now
            </button>
          </div>

          <div className="contact-actions">
            <a
              href={`https://wa.me/${whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
            >
              🟢 Order on WhatsApp
            </a>
            <a href={`tel:${phone}`}>📞 Call for Order</a>
          </div>

          <div className="detail-trust">
            <span>💵 Cash on Delivery</span>
            <span>🚚 Fast delivery</span>
            <span>↩ Easy return</span>
          </div>
        </section>
      </div>

      <div className="description-box">
        <h2>Product details</h2>
        <p>
          {product.description || "এই পণ্য সম্পর্কে বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে।"}
        </p>
      </div>

      <Link to="/products" className="back-link">
        ← Continue shopping
      </Link>
    </main>
  );
};

export default ProductDetails;
