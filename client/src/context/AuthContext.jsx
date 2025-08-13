import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(""); // Default empty
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
    setToken("");
    setUser(null);
  };

  // On first load, only set token if it is valid
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
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.userData);
        } else {
          console.error("User fetch failed");
          logoutUser(); // Token remove if invalid
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getUser();
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
        authorizationToken: `Bearer ${token}`,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
