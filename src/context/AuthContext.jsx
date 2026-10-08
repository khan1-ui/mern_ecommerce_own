/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * ============================================================
   * SAVE AUTH DATA
   * ============================================================
   */

  const saveAuthData = (data) => {
    const { token, user } = data || {};

    if (!token || !user) {
      throw new Error("Invalid authentication response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Remove old authentication data
    localStorage.removeItem("userInfo");

    setUser(user);

    return user;
  };

  /*
   * ============================================================
   * USER LOGIN
   * Phone + Password
   * ============================================================
   */

  const loginUser = async (phone, password) => {
    const { data } = await api.post("/auth/login", {
      phone,
      password,
    });

    return saveAuthData(data);
  };

  /*
   * ============================================================
   * ADMIN LOGIN
   * Email + Password
   * ============================================================
   */

  const loginAdmin = async (email, password) => {
    const { data } = await api.post("/auth/admin-login", {
      email,
      password,
    });

    /*
     * Extra client-side protection.
     *
     * Even if someone somehow receives a token from
     * the admin endpoint, make sure the returned account
     * actually has the admin role.
     */
    if (data?.user?.role !== "admin") {
      throw new Error("Admin access denied");
    }

    return saveAuthData(data);
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");

    setUser(null);
  };

  /*
   * ============================================================
   * LOAD AUTHENTICATED USER
   * ============================================================
   *
   * When the browser refreshes, restore the user from the
   * stored token by asking the server for the current user.
   */

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        /*
         * Depending on the backend response structure,
         * support either:
         *
         * { user: {...} }
         *
         * or
         *
         * {...user}
         */

        const authenticatedUser = data?.user || data;

        if (!authenticatedUser) {
          throw new Error("Invalid user response");
        }

        localStorage.setItem(
          "user",
          JSON.stringify(authenticatedUser)
        );

        setUser(authenticatedUser);
      } catch {
        /*
         * Token is invalid / expired.
         * Clear authentication completely.
         */
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /*
   * ============================================================
   * CONTEXT VALUE
   * ============================================================
   */

  const value = {
    user,
    loading,

    // Authentication
    loginUser,
    loginAdmin,

    // Logout
    logout,

    // Useful helpers
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/*
 * ==============================================================
 * useAuth Hook
 * ==============================================================
 */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};
