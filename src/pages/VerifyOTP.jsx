import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Start countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // If user opens OTP page directly
  useEffect(() => {
    if (!phone) {
      showToast("Phone number is missing", "error");
      navigate("/register", { replace: true });
    }
  }, [phone, navigate, showToast]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showToast("Please enter the 6-digit OTP", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      showToast(
        response?.data?.message || "Account verified successfully",
        "success"
      );

      // Registration complete → Home Page
      navigate("/", { replace: true });
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);

      await api.post("/auth/resend-otp", {
        phone,
      });

      showToast("A new OTP has been sent", "success");
      setOtp("");
      setCountdown(60);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    } finally {
      setResending(false);
    }
  };

  if (!phone) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white text-xl font-bold"
              style={{
                backgroundColor: "var(--store-color)",
              }}
            >
              ✓
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verify Your Phone
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We sent a 6-digit OTP to
            </p>

            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200">
              {phone}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">

            {/* OTP */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                disabled={loading}
                className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] font-semibold outline-none focus:ring-2 focus:ring-[var(--store-color)]"
              />
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 rounded-xl text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--store-color)",
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resend OTP in{" "}
                <span className="font-semibold">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-semibold hover:underline disabled:opacity-50"
                style={{
                  color: "var(--store-color)",
                }}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Back */}
          <div className="text-center mt-5">
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              ← Change phone number
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}