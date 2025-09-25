import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token;

  //  Store token in localStorage & state
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

  //useEffect me fetchUser define karenge (warning gone)
  useEffect(() => {
    const fetchUser = async (currentToken) => {
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await axios.get("https://bloging-platform.onrender.com/api/auth/user", {
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

    if (token) fetchUser(token);
    else setIsLoading(false);
  }, [token]); //dependency me sirf token hai, warning gone

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
