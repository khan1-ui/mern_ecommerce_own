import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "Lifestyle",
    isBestSeller: false,
    isOffer: false,
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setPreviewImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      showToast("Price and stock cannot be negative.", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", Number(form.price));
      formData.append("compareAtPrice", form.compareAtPrice === "" ? "" : Number(form.compareAtPrice));
      formData.append("category", form.category);
      formData.append("isBestSeller", String(form.isBestSeller));
      formData.append("isOffer", String(form.isOffer));
      formData.append("stock", Number(form.stock));

      images.forEach((image) => formData.append("images", image));

      await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Product added successfully", "success");
      navigate("/admin/products");
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Product add failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="Product Title"
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          className="border p-2 w-full rounded"
          placeholder="Price"
          required
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          className="border p-2 w-full rounded"
          placeholder="Compare-at Price (optional)"
          value={form.compareAtPrice}
          onChange={(event) => setForm({ ...form, compareAtPrice: event.target.value })}
        />

        <select
          className="border p-2 w-full rounded"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          <option value="Fashion">পোশাক</option>
          <option value="Beauty">বিউটি</option>
          <option value="Home">হোম & কিচেন</option>
          <option value="Food">ফুড & গ্রোসারি</option>
          <option value="Electronics">ইলেকট্রনিক্স</option>
          <option value="Lifestyle">লাইফস্টাইল</option>
        </select>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isBestSeller} onChange={(event) => setForm({ ...form, isBestSeller: event.target.checked })} />
            Best Seller
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isOffer} onChange={(event) => setForm({ ...form, isOffer: event.target.checked })} />
            Offer
          </label>
        </div>

        <input
          type="number"
          min="0"
          step="1"
          className="border p-2 w-full rounded"
          placeholder="Stock Quantity"
          required
          value={form.stock}
          onChange={(event) => setForm({ ...form, stock: event.target.value })}
        />

        <div>
          <label className="text-sm font-medium">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="block mt-1"
            onChange={handleImages}
            disabled={loading}
          />
        </div>

        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {previewImages.map((image, index) => (
              <div key={image} className="relative border rounded overflow-hidden">
                <img src={image} alt="Preview" className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
