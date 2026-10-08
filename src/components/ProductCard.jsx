import { Link } from "react-router-dom";
import { useCart } from "../store/cart";

const ProductCard = ({ product, badge }) => {
  const { addToCart } = useCart();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const assetBase = apiUrl.replace(/\/api\/?$/, "");

  const imageUrl = product.images?.length
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `${assetBase}${product.images[0]}`
    : "https://placehold.co/600x600/f7f7f7/888?text=Product";

  const oldPrice = product.compareAtPrice || product.oldPrice;
  const discount =
    oldPrice && Number(oldPrice) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(oldPrice)) * 100)
      : null;

  const stock = Number(product.stock ?? 0);
  const outOfStock = stock <= 0;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {badge && <span className="product-badge">{badge}</span>}
        {discount && <span className="discount-badge">-{discount}%</span>}
        <button type="button" className="wishlist-button" aria-label="Add to wishlist">
          ♡
        </button>

        <Link to={`/product/${product.slug}`} className="product-image-link">
          <img
            src={imageUrl}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-card-body">
        <Link to={`/product/${product.slug}`} className="product-title">
          {product.title}
        </Link>

        <div className="product-rating">
          <span>★</span> {product.rating || "4.8"} <em>({product.reviewCount || 0})</em>
        </div>

        <div className="product-price-row">
          <strong>৳{Number(product.price || 0).toLocaleString("en-BD")}</strong>
          {oldPrice && <del>৳{Number(oldPrice).toLocaleString("en-BD")}</del>}
        </div>

        <button
          type="button"
          className="add-cart-button"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
        >
          <span>🛒</span> {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
