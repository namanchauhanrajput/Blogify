import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token;

  // Store token in localStorage
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

  // On first load, check token
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      setToken(existingToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user if token exists
  useEffect(() => {
    const getUser = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://bloging-platform.onrender.com/api/auth/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.userData);
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
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
