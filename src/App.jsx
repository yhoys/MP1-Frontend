import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import DocumentTypes from "./pages/DocumentTypes";
import Navigation from "./components/Navigation";
import { Box } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

// Layout para páginas con menú
function Layout({ children }) {
  return (
    <Box>
      <Navigation />
      {children}
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas: Login (sin menú) */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas (con menú y protección) */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute requiredPermission="ver_usuarios">
                <Layout>
                  <Usuarios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute requiredPermission="ver_roles">
                <Layout>
                  <Roles />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/document-types"
            element={
              <PrivateRoute requiredPermission="ver_tipos_documento">
                <Layout>
                  <DocumentTypes />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Catch-all: redirige al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
