import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import { Container, Typography } from "@mui/material";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

// Componente Layout: Envuelve las páginas que llevan Menú
function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
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
                  <Typography variant="h4">Bienvenido al Sistema</Typography>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Layout>
                  <Typography variant="h4">Gestión de Usuarios</Typography>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <Layout>
                  <Typography variant="h4">Gestión de Roles</Typography>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/document-types"
            element={
              <PrivateRoute>
                <Layout>
                  <Typography variant="h4">Tipos de Documento</Typography>
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
