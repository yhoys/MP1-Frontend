import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API = "http://localhost:3001";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    fetch(`${API}/roles`)
      .then((r) => r.json())
      .then((data) => setRoles(data || []))
      .catch(() => setRoles([]));
  }, []);

  const handleOpenModal = (rol = null) => {
    if (rol) {
      setEditingId(rol.id);
      setFormData({ nombre: rol.nombre, descripcion: rol.descripcion });
    } else {
      setEditingId(null);
      setFormData({ nombre: "", descripcion: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.nombre) {
      alert("El nombre del rol es requerido");
      return;
    }

    const payload = {
      ...formData,
      estado: true,
      createdAt: editingId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await fetch(`${API}/roles/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API}/roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setOpenModal(false);
      const res = await fetch(`${API}/roles`);
      const data = await res.json();
      setRoles(data || []);
    } catch (error) {
      alert("Error al guardar rol");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas marcar este rol como inactivo?")) {
      try {
        const rol = roles.find((r) => r.id === id);
        await fetch(`${API}/roles/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rol, estado: false }),
        });
        setRoles(roles.filter((r) => r.id !== id));
      } catch (error) {
        alert("Error al eliminar rol");
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Gestión de Roles
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Nuevo Rol
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell>
                  <strong>Descripción</strong>
                </TableCell>
                <TableCell>
                  <strong>Fecha Creación</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    No hay roles registrados
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((rol) => (
                  <TableRow key={rol.id} hover>
                    <TableCell>
                      <strong>{rol.nombre}</strong>
                    </TableCell>
                    <TableCell>{rol.descripcion}</TableCell>
                    <TableCell>
                      {new Date(rol.createdAt).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(rol)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(rol.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editingId ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}
          >
            <TextField
              label="Nombre del Rol"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Roles;
