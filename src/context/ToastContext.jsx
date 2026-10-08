/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "", // success | error | info
    visible: false,
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({
      message,
      type,
      visible: true,
    });

    // auto hide after 3s
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 🔔 Toast UI */}
      {toast.visible && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
