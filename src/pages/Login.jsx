import React, { useState } from "react";
import { Paper, TextField, Button, Typography, Box } from "@mui/material";
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "linear-gradient(135deg, rgba(8,10,20,1) 0%, rgba(25,25,45,1) 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "92%", sm: 440 },
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.04)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography component="h1" variant="h5" mb={2} sx={{ color: "#fff" }}>
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
            inputProps={{ maxLength: 40 }}
            variant="filled"
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.8)" } }}
            InputProps={{
              sx: { backgroundColor: "rgba(255,255,255,0.03)", color: "#fff" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ maxLength: 200 }}
            variant="filled"
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.8)" } }}
            InputProps={{
              sx: { backgroundColor: "rgba(255,255,255,0.03)", color: "#fff" },
            }}
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
    </Box>
  );
}

export default Login;
