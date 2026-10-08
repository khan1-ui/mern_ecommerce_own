import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getImageUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_BASE_URL}${path}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
