import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("mp1_token");
    return token ? { name: "user" } : null;
  });

  useEffect(() => {
    // keep user in sync with storage (simple)
    const onStorage = () => {
      const token = localStorage.getItem("mp1_token");
      setUser(token ? { name: "user" } : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = ({ username } = {}) => {
    // in real app call backend
    localStorage.setItem("mp1_token", "demo-token");
    setUser({ name: username || "user" });
  };

  const logout = () => {
    localStorage.removeItem("mp1_token");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
