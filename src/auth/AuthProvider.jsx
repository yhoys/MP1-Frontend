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
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) throw new Error("Error fetching usuarios");

      const usuarios = await response.json();

      const foundUser = usuarios.find(
        (u) => u.email === email && u.password === password && u.estado === true
      );

      if (!foundUser) {
        setError("Email o contrasena incorrectos");
        return false;
      }

      const rolId =
        typeof foundUser.rolId === "string"
          ? parseInt(foundUser.rolId, 10)
          : foundUser.rolId;

      if (!Number.isFinite(rolId)) {
        setError("Rol del usuario invalido");
        return false;
      }

      const roleResponse = await fetch(`${API_URL}/roles/${rolId}`);
      if (!roleResponse.ok) throw new Error("Error fetching role");

      const role = await roleResponse.json();

      const userObj = {
        id: foundUser.id,
        nombres: foundUser.nombres,
        apellidos: foundUser.apellidos,
        email: foundUser.email,
        rolId: rolId,
        rolNombre: role.nombre,
        permisos: role.permisos || [],
      };

      localStorage.setItem("mp1_token", `token_${foundUser.id}_${Date.now()}`);
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
