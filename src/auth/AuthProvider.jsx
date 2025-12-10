import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_URL = "http://localhost:3001";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem("mp1_token");
    const userData = localStorage.getItem("mp1_user");
    return token && userData ? JSON.parse(userData) : null;
  } catch (err) {
    console.warn("Error leyendo usuario almacenado, limpiando cache", err);
    localStorage.removeItem("mp1_token");
    localStorage.removeItem("mp1_user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onStorage = () => {
      setUser(getStoredUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async ({ email, password } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email o contraseña incorrectos");
        return false;
      }

      const { token, usuario } = data;

      const userObj = {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rolId: usuario.rol.id,
        rolNombre: usuario.rol.nombre,
        permisos: usuario.rol.permisos || [],
      };

      localStorage.setItem("mp1_token", token);
      localStorage.setItem("mp1_user", JSON.stringify(userObj));
      setUser(userObj);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Error durante el login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("mp1_token");
    localStorage.removeItem("mp1_user");
    setUser(null);
    setError(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permisos?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
