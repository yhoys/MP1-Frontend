import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Box, CircularProgress } from "@mui/material";

export default function PrivateRoute({ children, requiredPermission }) {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific permission is required, check it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
