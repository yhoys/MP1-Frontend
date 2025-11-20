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

// Componente Layout: Envuelve las páginas que llevan Menú
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
          {/* Ruta Pública: Login (Sin menú) */}
          <Route path="/" element={<Login />} />

          {/* Rutas Privadas (Con menú) */}
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
              <PrivateRoute>
                <Layout>
                  <Usuarios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <Layout>
                  <Roles />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/document-types"
            element={
              <PrivateRoute>
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
