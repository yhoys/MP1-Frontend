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
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../auth/AuthProvider";

const API = "http://localhost:3001";

function DocumentTypes() {
  const { user } = useAuth();
  const [tipos, setTipos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
  });

  useEffect(() => {
    fetch(`${API}/documentTypes`)
      .then((r) => r.json())
      .then((data) => setTipos((data || []).filter((t) => t.estado !== false)))
      .catch(() => setTipos([]));
  }, []);

  const handleOpenModal = (tipo = null) => {
    if (tipo) {
      setEditingId(tipo.id);
      setFormData({ codigo: tipo.codigo, nombre: tipo.nombre });
    } else {
      setEditingId(null);
      setFormData({ codigo: "", nombre: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.codigo || !formData.nombre) {
      alert("El código y nombre del tipo de documento son requeridos");
      return;
    }

    const now = new Date().toISOString();
    const action = editingId ? "Modificado" : "Creado";
    const auditEntry = {
      tipo: "DocumentType",
      accion: action,
      usuario: user?.name || "Sistema",
      fechaHora: now,
      descripcion: `${action}: ${formData.nombre} (${formData.codigo})`,
    };

    const payload = {
      ...formData,
      estado: true,
      createdAt: editingId ? undefined : now,
      updatedAt: now,
      ultimoUsuario: user?.name || "Sistema",
      ultimaAccion: now,
    };

    try {
      if (editingId) {
        await fetch(`${API}/documentTypes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API}/documentTypes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // Log auditoria
      await fetch(`${API}/auditLogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditEntry),
      }).catch(() => {}); // Si falla, continúa sin error

      setOpenModal(false);
      const res = await fetch(`${API}/documentTypes`);
      const data = await res.json();
      setTipos((data || []).filter((t) => t.estado !== false));
    } catch (error) {
      alert("Error al guardar tipo de documento");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Deseas marcar este tipo de documento como inactivo?")
    ) {
      try {
        const tipo = tipos.find((t) => t.id === id);
        const now = new Date().toISOString();

        const auditEntry = {
          tipo: "DocumentType",
          accion: "Eliminado",
          usuario: user?.name || "Sistema",
          fechaHora: now,
          descripcion: `Eliminado: ${tipo.nombre} (${tipo.codigo})`,
        };

        await fetch(`${API}/documentTypes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...tipo,
            estado: false,
            ultimoUsuario: user?.name || "Sistema",
            ultimaAccion: now,
          }),
        });

        // Log auditoria
        await fetch(`${API}/auditLogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(auditEntry),
        }).catch(() => {});

        setTipos(tipos.filter((t) => t.id !== id));
      } catch (error) {
        alert("Error al eliminar tipo de documento");
        console.error(error);
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
            Gestión de Tipos de Documento
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Nuevo Tipo
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f7fa" }}>
              <TableRow>
                <TableCell>
                  <strong>Código</strong>
                </TableCell>
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell>
                  <strong>Última Actualización</strong>
                </TableCell>
                <TableCell>
                  <strong>Usuario</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tipos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No hay tipos de documento registrados
                  </TableCell>
                </TableRow>
              ) : (
                tipos.map((tipo) => (
                  <TableRow key={tipo.id} hover>
                    <TableCell>
                      <strong>{tipo.codigo}</strong>
                    </TableCell>
                    <TableCell>{tipo.nombre}</TableCell>
                    <TableCell>
                      <Tooltip title={tipo.ultimaAccion || "Sin información"}>
                        <span>
                          {new Date(
                            tipo.ultimaAccion || tipo.updatedAt
                          ).toLocaleDateString("es-CO")}{" "}
                          {new Date(
                            tipo.ultimaAccion || tipo.updatedAt
                          ).toLocaleTimeString("es-CO")}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={`Último usuario: ${
                          tipo.ultimoUsuario || "Sistema"
                        }`}
                      >
                        <span>{tipo.ultimoUsuario || "Sistema"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(tipo)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(tipo.id)}
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
            {editingId ? "Editar Tipo de Documento" : "Nuevo Tipo de Documento"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}
          >
            {!editingId && (
              <FormControl fullWidth>
                <InputLabel>Seleccionar Tipo Predefinido</InputLabel>
                <Select
                  label="Seleccionar Tipo Predefinido"
                  onChange={(e) => {
                    const selected = e.target.value.split("|");
                    setFormData({ codigo: selected[0], nombre: selected[1] });
                  }}
                  defaultValue=""
                >
                  <MenuItem value="">Personalizado</MenuItem>
                  <MenuItem value="CC|Cédula de Ciudadanía">
                    Cédula de Ciudadanía
                  </MenuItem>
                  <MenuItem value="PASS|Pasaporte">Pasaporte</MenuItem>
                  <MenuItem value="CE|Cédula de Extranjería">
                    Cédula de Extranjería
                  </MenuItem>
                  <MenuItem value="PE|Permiso de Estancia">
                    Permiso de Estancia
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              label="Código"
              placeholder="Ej: CC, PASS, CE..."
              value={formData.codigo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  codigo: e.target.value.toUpperCase(),
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Nombre/Descripción"
              placeholder="Ej: Cédula de Ciudadanía, Pasaporte..."
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              fullWidth
              required
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

export default DocumentTypes;
