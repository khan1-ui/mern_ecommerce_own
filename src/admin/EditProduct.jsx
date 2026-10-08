import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const SortableImage = ({ image, isMain, onRemove, getImageUrl }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative select-none">
      <div {...attributes} {...listeners} className="cursor-grab">
        <img
          src={getImageUrl(image.url)}
          alt=""
          className={`w-full h-24 object-cover rounded ${isMain ? "ring-2 ring-black" : ""}`}
        />
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(image);
        }}
        className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded hover:bg-red-600"
      >
        ✕
      </button>

      {isMain && (
        <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1 rounded">
          MAIN
        </span>
      )}
    </div>
  );
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNewImages, setPreviewNewImages] = useState([]);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const imageBase = apiBase.replace(/\/api\/?$/, "");
  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${imageBase}${url || ""}`);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/admin/products/${id}`);
        const product = data?.product || data;

        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          compareAtPrice: product.compareAtPrice ?? "",
          category: product.category || "Lifestyle",
          isBestSeller: Boolean(product.isBestSeller),
          isOffer: Boolean(product.isOffer),
          stock: product.stock ?? "",
        });

        setExistingImages(
          (product.images || []).map((url, index) => ({
            id: `existing-${index}-${url}`,
            url,
          }))
        );
      } catch (error) {
        showToast(
          error?.response?.data?.message || "Failed to load product",
          "error"
        );
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, showToast]);

  const removeExistingImage = (image) => {
    setRemovedImages((prev) => [...prev, image.url]);
    setExistingImages((prev) => prev.filter((item) => item.id !== image.id));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setExistingImages((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return oldIndex === -1 || newIndex === -1 ? items : arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleNewImages = (event) => {
    const files = Array.from(event.target.files || []);
    setNewImages(files);
    setPreviewNewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      showToast("Price and stock cannot be negative.", "error");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", Number(form.price));
      formData.append("compareAtPrice", form.compareAtPrice === "" ? "" : Number(form.compareAtPrice));
      formData.append("category", form.category);
      formData.append("isBestSeller", String(form.isBestSeller));
      formData.append("isOffer", String(form.isOffer));
      formData.append("stock", Number(form.stock));
      formData.append("removedImages", JSON.stringify(removedImages));
      formData.append("orderedImages", JSON.stringify(existingImages.map((image) => image.url)));

      newImages.forEach((image) => formData.append("images", image));

      await api.put(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Product updated successfully", "success");
      navigate("/admin/products");
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Product update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">Edit Product</h2>

      <input
        className="border p-2 w-full rounded"
        placeholder="Title"
        required
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
      />

      <textarea
        className="border p-2 w-full rounded"
        rows="3"
        placeholder="Description"
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
        placeholder="Stock"
        required
        value={form.stock}
        onChange={(event) => setForm({ ...form, stock: event.target.value })}
      />

      {existingImages.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">
            Existing Images
            <span className="text-xs text-gray-500 ml-1">
              (drag to reorder — first is main)
            </span>
          </p>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={existingImages.map((image) => image.id)}>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((image, index) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    isMain={index === 0}
                    onRemove={removeExistingImage}
                    getImageUrl={getImageUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Add New Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImages}
          disabled={saving}
          className="block mt-1"
        />
      </div>

      {previewNewImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previewNewImages.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt="New preview"
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white w-full py-2 rounded disabled:opacity-50"
      >
        {saving ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
};

export default EditProduct;
