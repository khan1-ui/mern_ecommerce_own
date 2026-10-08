import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showToast("Please enter email and password", "error");
      return;
    }

    try {
      setLoading(true);

      await loginAdmin(
        form.email.trim(),
        form.password
      );

      showToast(
        "Admin login successful",
        "success"
      );

      navigate("/admin", { replace: true });
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Admin login failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-8">

            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white font-bold text-xl"
              style={{
                backgroundColor: "var(--store-color)",
              }}
            >
              A
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to your admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--store-color)]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--store-color)]"
                required
              />
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--store-color)",
              }}
            >
              {loading
                ? "Signing in..."
                : "Admin Login"}
            </button>

          </form>

          {/* Back to Store */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              ← Back to Store
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
