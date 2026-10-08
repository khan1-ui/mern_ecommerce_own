import { useEffect, useState } from "react";
import { Users as UsersIcon, Phone, Shield } from "lucide-react";
import api from "../services/api";
import Loader from "../components/Loader";
import { cardStyle } from "../styles";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/users");

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Users fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage registered users of your store.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <UsersIcon size={18} />
          <span>{users.length} users</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>{error}</p>

            <button
              onClick={fetchUsers}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={`${cardStyle} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Role
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.name || "Unnamed User"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Phone size={15} />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {user.email || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        <Shield size={13} />
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
