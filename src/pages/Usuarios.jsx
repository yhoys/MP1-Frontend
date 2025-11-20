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
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";

const API = "http://localhost:3001";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function Usuarios() {
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [duplicateData, setDuplicateData] = useState(null);
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

  const usuarios = allUsuarios.filter((u) => u.estado !== false);
  const usuariosInactivos = allUsuarios.filter((u) => u.estado === false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, typesRes] = await Promise.all([
          fetch(`${API}/usuarios`),
          fetch(`${API}/documentTypes`),
        ]);
        setAllUsuarios((await usersRes.json()) || []);
        setDocumentTypes(
          ((await typesRes.json()) || []).filter((d) => d.estado !== false)
        );
      } catch {
        setAllUsuarios([]);
        setDocumentTypes([]);
      }
    };
    fetchData();
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

  const checkDuplicate = (nombres, apellidos) => {
    return allUsuarios.find(
      (u) =>
        u.estado === false &&
        u.nombres.toLowerCase() === nombres.toLowerCase() &&
        u.apellidos.toLowerCase() === apellidos.toLowerCase()
    );
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

    // Si es crear, verificar duplicados
    if (!editingId) {
      const duplicate = checkDuplicate(formData.nombres, formData.apellidos);
      if (duplicate) {
        setDuplicateData(duplicate);
        setOpenDuplicateDialog(true);
        return;
      }
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
      const res = await fetch(`${API}/usuarios`);
      setAllUsuarios(await res.json());
    } catch (err) {
      alert("Error al guardar usuario");
      console.error(err);
    }
  };

  const handleReactivate = async () => {
    if (!duplicateData) return;
    try {
      const payload = {
        ...duplicateData,
        ...formData,
        estado: true,
        updatedAt: new Date().toISOString(),
      };
      await fetch(`${API}/usuarios/${duplicateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOpenDuplicateDialog(false);
      setOpenModal(false);
      setDuplicateData(null);
      const res = await fetch(`${API}/usuarios`);
      setAllUsuarios(await res.json());
    } catch (err) {
      alert("Error al reactivar usuario");
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
        const res = await fetch(`${API}/usuarios`);
        setAllUsuarios(await res.json());
      } catch (err) {
        alert("Error al eliminar usuario");
        console.error(err);
      }
    }
  };

  const handleRestoreInactive = async (id) => {
    if (window.confirm("¿Deseas reactivar este usuario?")) {
      try {
        const usuario = usuariosInactivos.find((u) => u.id === id);
        await fetch(`${API}/usuarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...usuario,
            estado: true,
            updatedAt: new Date().toISOString(),
          }),
        });
        const res = await fetch(`${API}/usuarios`);
        setAllUsuarios(await res.json());
      } catch (err) {
        alert("Error al reactivar usuario");
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
          {tabValue === 0 && (
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
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="usuario tabs"
          >
            <Tab label={`Activos (${usuarios.length})`} id="tab-0" />
            <Tab label={`Inactivos (${usuariosInactivos.length})`} id="tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Aquí se muestran los usuarios inactivos. Puedes reactivarlos si es
            necesario.
          </Alert>
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
                    <strong>Inactivado en</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosInactivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No hay usuarios inactivos
                    </TableCell>
                  </TableRow>
                ) : (
                  usuariosInactivos.map((usuario) => (
                    <TableRow key={usuario.id} hover sx={{ opacity: 0.7 }}>
                      <TableCell>{usuario.nombres}</TableCell>
                      <TableCell>{usuario.apellidos}</TableCell>
                      <TableCell>
                        {usuario.tipoDocumento} - {usuario.numeroDocumento}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        {new Date(usuario.updatedAt).toLocaleDateString(
                          "es-CO"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreInactive(usuario.id)}
                          title="Reactivar usuario"
                        >
                          <RestoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Modal crear/editar */}
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

        {/* Dialog duplicado */}
        <Dialog
          open={openDuplicateDialog}
          onClose={() => setOpenDuplicateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>⚠️ Usuario Duplicado</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ya existe un usuario con el nombre{" "}
              <strong>
                {formData.nombres} {formData.apellidos}
              </strong>{" "}
              pero está marcado como inactivo.
            </Alert>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ¿Deseas reactivarlo con la nueva información o deseas cancelar?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDuplicateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReactivate}
              variant="contained"
              color="success"
            >
              Reactivar y Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Usuarios;
