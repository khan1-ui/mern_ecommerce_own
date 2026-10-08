import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Products = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/products");
      setProducts(Array.isArray(data) ? data : data?.products || []);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to load products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      showToast("Product deleted successfully", "success");
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, import or remove physical products.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Add Product
          </Link>

          <Link
            to="/admin/import"
            className="px-4 py-2 text-white rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: "var(--store-color)" }}
          >
            Import JSON
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <p className="text-gray-500">No products found.</p>
          <Link
            to="/admin/products/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "var(--store-color)" }}
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <p className="font-semibold text-lg">{product.title}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>৳ {Number(product.price || 0).toLocaleString()}</span>
                  <span>Stock: {Number(product.stock || 0)}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      Number(product.stock || 0) > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => deleteHandler(product._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
