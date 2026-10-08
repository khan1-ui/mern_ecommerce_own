import { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export default function StoreImport() {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importCount, setImportCount] = useState(null);

  const handleImport = async () => {
    if (!file) {
      showToast("Select a JSON file first", "error");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      showToast("Please select a valid JSON file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setImportCount(null);

      const { data } = await api.post("/admin/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const count = data?.count ?? data?.imported ?? 0;
      setImportCount(count);
      showToast(`Imported ${count} products successfully ✅`, "success");
      setFile(null);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Import failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Import Products
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Import physical products using a JSON file.
          </p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Product JSON File
          </label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setImportCount(null);
            }}
            disabled={loading}
            className="block w-full text-sm text-gray-700 dark:text-gray-300"
          />

          {file && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleImport}
          disabled={loading || !file}
          className="w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--store-color)" }}
        >
          {loading ? "Importing..." : "Import JSON"}
        </button>

        {importCount !== null && (
          <div className="mt-5 text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            Successfully imported <strong>{importCount}</strong> products 🎉
          </div>
        )}
      </div>
    </div>
  );
}
