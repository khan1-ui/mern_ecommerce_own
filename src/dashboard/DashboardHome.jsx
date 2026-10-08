import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cardStyle } from "../styles";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user?.name || "User"} 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Manage your orders and profile information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/dashboard/orders" className={cardStyle}>
          <h2 className="font-semibold text-lg">My Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            View order status and order history.
          </p>
        </Link>

        <Link to="/dashboard/profile" className={cardStyle}>
          <h2 className="font-semibold text-lg">My Profile</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Update your account information.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
