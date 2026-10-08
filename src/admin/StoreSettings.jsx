import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const DEFAULT_FORM = {
  name: "",
  description: "",
  logo: "",
  banner: "",
  themeColor: "#000000",
};

export default function StoreSettings() {
  const { showToast } = useToast();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/admin/store-settings");
        const settings = data?.settings || data?.store || data || {};

        setForm({
          name: settings.name || "",
          description: settings.description || "",
          logo: settings.logo || "",
          banner: settings.banner || "",
          themeColor: settings.themeColor || "#000000",
        });
      } catch (error) {
        showToast(
          error?.response?.data?.message || "Failed to load store settings",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [showToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await api.put("/admin/store-settings", form);
      showToast("Store settings updated successfully ✅", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading store settings...</div>;
  }

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-lg mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-bold">Store Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the branding and basic information of your store.
        </p>
      </div>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-3 w-full rounded"
        placeholder="Store Name"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="border p-3 w-full rounded"
        placeholder="Store Description"
        rows="4"
      />

      <input
        type="text"
        name="logo"
        value={form.logo}
        onChange={handleChange}
        className="border p-3 w-full rounded"
        placeholder="Logo URL"
      />

      <input
        type="text"
        name="banner"
        value={form.banner}
        onChange={handleChange}
        className="border p-3 w-full rounded"
        placeholder="Banner URL"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Theme Color</label>
        <input
          type="color"
          name="themeColor"
          value={form.themeColor}
          onChange={handleChange}
          className="w-full h-10"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-4 py-3 rounded w-full disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
