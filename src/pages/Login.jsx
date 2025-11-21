import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { isValidEmail } from "../utils/validators";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "El email es requerido";
    else if (!isValidEmail(email)) newErrors.email = "Email no válido";
    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await login({ email, password });
    if (success) {
      navigate("/home");
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          color: "white",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            mb: 3,
            bgcolor: "rgba(255, 255, 255, 0.2)",
            width: 80,
            height: 80,
            backdropFilter: "blur(10px)",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 48 }} />
        </Avatar>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          MICROPROYECTO
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Gestión de Usuarios y Administración
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 300, opacity: 0.8 }}>
          Sistema integral para administrar usuarios, roles y tipos de
          documento de manera eficiente y segura.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: { xs: 1, md: 1 },
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: { xs: "100%", sm: "90%", md: 420 },
            p: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#ffffff",
            borderRadius: "16px",
            boxSizing: "border-box",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#667eea",
              width: 56,
              height: 56,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Ingreso al Sistema
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Gestión de Usuarios - Administración
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Ingrese su email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                p: 1.2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Ingresando...
                </Box>
              ) : (
                "Ingresar"
              )}
            </Button>
          </Box>

          <Alert severity="info" sx={{ width: "100%", mt: 2 }}>
            <Typography variant="caption">
              <strong>Demo:</strong> Email: carlos.garcia@example.com |
              Contraseña: admin123
            </Typography>
          </Alert>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
