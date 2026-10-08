import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (
      !form.name ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);

      /*
       * OTP registration flow
       *
       * Server-side OTP API আমরা পরের ধাপে তৈরি করব।
       * এখন Client থেকে শুধু phone registration request যাবে।
       */
      await api.post("/auth/register", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "user",
      });

      showToast(
        "Registration successful. Please verify your phone.",
        "success"
      );

      /*
       * পরের ধাপে এখানে OTP verification page-এ পাঠাব।
       */
      navigate("/verify-otp", {
        state: {
          phone: form.phone.trim(),
        },
      });
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Registration failed",
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Register with your phone number
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--store-color)]"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                disabled={loading}
                autoComplete="tel"
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
                placeholder="Minimum 6 characters"
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--store-color)]"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--store-color)]"
                required
              />
            </div>

            {/* Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--store-color)",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{
                color: "var(--store-color)",
              }}
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}