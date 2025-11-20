import React, { useState, useEffect } from "react";
import {
  Box,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API = "http://localhost:3001";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    genero: "",
    email: "",
    telefono: "",
    rol: "",
    fechaNacimiento: "",
    foto: "",
    direccion: "",
  });

  useEffect(() => {
    fetch(`${API}/usuarios`)
      .then((r) => r.json())
      .then((data) =>
        setUsuarios((data || []).filter((u) => u.estado !== false))
      )
      .catch(() => setUsuarios([]));

    fetch(`${API}/documentTypes`)
      .then((r) => r.json())
      .then((data) =>
        setDocumentTypes((data || []).filter((d) => d.estado !== false))
      )
      .catch(() => setDocumentTypes([]));
  }, []);

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.id);
      setFormData(usuario);
    } else {
      setEditingId(null);
      setFormData({
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        genero: "",
        email: "",
        telefono: "",
        rol: "",
        fechaNacimiento: "",
        foto: "",
        direccion: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.email ||
      !formData.tipoDocumento ||
      !formData.numeroDocumento
    ) {
      alert("Por favor completa todos los campos requeridos");
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
        await fetch(`${API}/usuarios/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setOpenModal(false);
      // Refresh list - solo mostrar registros activos
      const res = await fetch(`${API}/usuarios`);
      const data = await res.json();
      setUsuarios((data || []).filter((u) => u.estado !== false));
    } catch (err) {
      alert("Error al guardar usuario");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas marcar este usuario como inactivo?")) {
      try {
        const usuario = usuarios.find((u) => u.id === id);
        await fetch(`${API}/usuarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...usuario,
            estado: false,
            updatedAt: new Date().toISOString(),
          }),
        });
        // Actualizar lista - remover registro inactivo
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (err) {
        alert("Error al eliminar usuario");
        console.error(err);
      }
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#2c3e50" }}
          >
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell>
                  <strong>Nombres</strong>
                </TableCell>
                <TableCell>
                  <strong>Apellidos</strong>
                </TableCell>
                <TableCell>
                  <strong>Documento</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Teléfono</strong>
                </TableCell>
                <TableCell>
                  <strong>Rol</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id} hover>
                    <TableCell>{usuario.nombres}</TableCell>
                    <TableCell>{usuario.apellidos}</TableCell>
                    <TableCell>
                      {usuario.tipoDocumento} - {usuario.numeroDocumento}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.telefono}</TableCell>
                    <TableCell>
                      <Chip label={usuario.rol || "Sin rol"} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(usuario)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(usuario.id)}
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
          <DialogTitle>
            {editingId ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              py: 2,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <TextField
              label="Nombres"
              value={formData.nombres}
              onChange={(e) =>
                setFormData({ ...formData, nombres: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Apellidos"
              value={formData.apellidos}
              onChange={(e) =>
                setFormData({ ...formData, apellidos: e.target.value })
              }
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                label="Tipo de Documento"
                value={formData.tipoDocumento}
                onChange={(e) =>
                  setFormData({ ...formData, tipoDocumento: e.target.value })
                }
              >
                <MenuItem value="">Seleccionar tipo...</MenuItem>
                {documentTypes.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.nombre}>
                    {tipo.nombre} ({tipo.codigo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Número de Documento"
              value={formData.numeroDocumento}
              onChange={(e) =>
                setFormData({ ...formData, numeroDocumento: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Género"
              placeholder="Ej: Masculino, Femenino, Otro"
              value={formData.genero}
              onChange={(e) =>
                setFormData({ ...formData, genero: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Rol"
              value={formData.rol}
              onChange={(e) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fechaNacimiento: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Dirección"
              placeholder="Dirección del usuario"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="URL Foto"
              placeholder="https://ejemplo.com/foto.jpg"
              value={formData.foto}
              onChange={(e) =>
                setFormData({ ...formData, foto: e.target.value })
              }
              fullWidth
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
      </Box>
    </Box>
  );
}

export default Usuarios;
