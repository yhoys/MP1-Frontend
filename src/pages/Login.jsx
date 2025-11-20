import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", login, "Password:", password);
    // set a demo auth token and redirect
    auth.login({ username: login });
    navigate("/home");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" mb={3}>
          Ingreso al Sistema
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Login (Usuario)"
            autoFocus
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            // VALIDACIÓN VISUAL: Máximo 40 caracteres
            inputProps={{ maxLength: 40 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // VALIDACIÓN: Máximo 200 caracteres (por requisito de cifrado backend)
            inputProps={{ maxLength: 200 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
