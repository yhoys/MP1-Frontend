import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules = [
    {
      title: "Gestión de Usuarios",
      description: "Crear, editar, ver y eliminar usuarios del sistema",
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      path: "/users",
      color: "#667eea",
    },
    {
      title: "Gestión de Roles",
      description: "Administrar roles y permisos de la aplicación",
      icon: <GroupIcon sx={{ fontSize: 48 }} />,
      path: "/roles",
      color: "#764ba2",
    },
    {
      title: "Tipos de Documento",
      description: "Gestionar tipos de documento de identidad",
      icon: <DocumentScannerIcon sx={{ fontSize: 48 }} />,
      path: "/document-types",
      color: "#f093fb",
    },
  ];

  const welcomeName =
    user?.nombres && user?.apellidos
      ? `${user.nombres} ${user.apellidos}`
      : user?.nombres || "Usuario";

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 6,
        px: { xs: 2, sm: 3, md: 4 },
        width: "100%",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2, color: "#2c3e50" }}
          >
            ¡Bienvenido, {welcomeName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#555" }}>
            Sistema de Gestión de Usuarios - Administración
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(module.path)}
                  sx={{ flexGrow: 1 }}
                >
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${module.color}20 0%, ${module.color}10 100%)`,
                      py: 4,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: module.color,
                        color: "#fff",
                      }}
                    >
                      {module.icon}
                    </Avatar>
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ fontWeight: "bold" }}
                    >
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {module.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
