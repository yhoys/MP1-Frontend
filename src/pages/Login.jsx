import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!login.trim()) newErrors.login = "El usuario es requerido";
    else if (login.length < 3) newErrors.login = "Mínimo 3 caracteres";
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
    setIsLoading(true);
    setTimeout(() => {
      auth.login({ username: login });
      navigate("/home");
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (field, value) => {
    if (field === "login") setLogin(value);
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
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: { xs: "95%", sm: 420, md: 440 },
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#ffffff",
          borderRadius: "12px",
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

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Usuario"
            placeholder="Ingrese su usuario"
            autoFocus
            value={login}
            onChange={(e) =>
              handleInputChange("login", e.target.value.slice(0, 40))
            }
            error={!!errors.login}
            helperText={errors.login}
            inputProps={{ maxLength: 40 }}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) =>
              handleInputChange("password", e.target.value.slice(0, 200))
            }
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{ maxLength: 200 }}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              p: 1.2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Box>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Demo: usuario: admin | contraseña: admin123
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
