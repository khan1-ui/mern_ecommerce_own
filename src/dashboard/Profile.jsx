import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/users/profile", { name });
      alert("Profile updated successfully");
    } catch {
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <form onSubmit={submitHandler}>
        <label className="block mb-1 text-sm">Name</label>
        <input
          className="border p-2 w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-1 text-sm">Email</label>
        <input
          className="border p-2 w-full mb-3 bg-gray-100 dark:bg-gray-900"
          value={email}
          disabled
        />

        <button
          className="bg-black text-white px-4 py-2 border cursor-pointer"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
