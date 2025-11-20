import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Navigation() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          {/* Title Section */}
          <Typography
            variant="h6"
            component="div"
            sx={{ mr: 4, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            MICROPROYECTO FRONTEND
          </Typography>

          {/* Buttons Section */}
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {/* 1. Menú Desplegable "Sistema" */}
            <Button
              color="inherit"
              onClick={handleClick}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              Sistema ▼
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Opción 1</MenuItem>
              <MenuItem onClick={handleClose}>Opción 2</MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  auth.logout();
                  navigate("/");
                }}
              >
                Salir
              </MenuItem>
            </Menu>

            {/* 2. Enlaces Directos */}
            <Button color="inherit" onClick={() => navigate("/document-types")}>
              Tipo Documento
            </Button>
            <Button color="inherit" onClick={() => navigate("/roles")}>
              Roles
            </Button>
            <Button color="inherit" onClick={() => navigate("/users")}>
              Usuarios
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation;
