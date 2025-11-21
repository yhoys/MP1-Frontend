import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navigation() {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Title Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{ mr: 4, cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/home")}
        >
          MICROPROYECTO
        </Typography>

        {/* Navigation Buttons */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {/* Show Usuarios if has permission */}
          {hasPermission("ver_usuarios") && (
            <Button
              color="inherit"
              onClick={() => navigate("/users")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                },
              }}
            >
              Usuarios
            </Button>
          )}

          {/* Show Roles if has permission */}
          {hasPermission("ver_roles") && (
            <Button
              color="inherit"
              onClick={() => navigate("/roles")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                },
              }}
            >
              Roles
            </Button>
          )}

          {/* Show Tipo Documento if has permission */}
          {hasPermission("ver_tipos_documento") && (
            <Button
              color="inherit"
              onClick={() => navigate("/document-types")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                },
              }}
            >
              Tipos Documento
            </Button>
          )}
        </Box>

        {/* Profile/User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {user?.nombres} {user?.apellidos}
          </Typography>

          <Button
            color="inherit"
            onClick={handleProfileClick}
            startIcon={<AccountCircleIcon />}
            aria-controls={profileOpen ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={profileOpen ? "true" : undefined}
          >
            {user?.rolNombre}
          </Button>

          <Menu
            id="profile-menu"
            anchorEl={profileAnchorEl}
            open={profileOpen}
            onClose={handleProfileClose}
          >
            <MenuItem disabled>
              <Typography variant="caption">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Salir
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
