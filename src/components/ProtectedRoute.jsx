import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Navigate
        to={adminOnly ? "/admin/login" : "/login"}
        replace
      />
    );
  }

  // Admin route but logged-in user is not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User route but admin is trying to access it
  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;