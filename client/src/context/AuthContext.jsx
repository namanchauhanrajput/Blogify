// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token;

  // Store token in localStorage and state
  const storeTokenInLS = (serverToken) => {
    if (serverToken) {
      localStorage.setItem("token", serverToken);
      setToken(serverToken);
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Fetch user from backend
  const fetchUser = async (currentToken) => {
    if (!currentToken) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(res.data.userData);
    } catch (err) {
      console.error("Fetch user failed:", err.response?.data || err.message);
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  // On first load, fetch user if token exists
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        logoutUser,
        token,
        user,
        isLoading,
        authorizationToken: token ? `Bearer ${token}` : "",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
