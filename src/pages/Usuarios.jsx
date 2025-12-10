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
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import { GENEROS } from "../constants/enums";
import { validateForm } from "../utils/validators";
import { api } from "../utils/api";

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
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [duplicateData, setDuplicateData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumentoId: "",
    numeroDocumento: "",
    genero: "",
    email: "",
    telefono: "",
    rolId: "",
    fechaNacimiento: "",
    foto: "",
    direccion: "",
    password: "",
  });

  const usuarios = allUsuarios.filter((u) => u.estado !== false);
  const usuariosInactivos = allUsuarios.filter((u) => u.estado === false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuarios, documentTypes, roles] = await Promise.all([
          api.get("/usuarios"),
          api.get("/document-types?estado=true"),
          api.get("/roles?estado=true"),
        ]);

        setAllUsuarios(usuarios.usuarios || usuarios || []);
        setDocumentTypes(documentTypes || []);
        setRoles(roles || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setAllUsuarios([]);
        setDocumentTypes([]);
        setRoles([]);
      }
    };
    fetchData();
  }, []);

  const getDocumentoName = (tipoId) => {
    return documentTypes.find((d) => d.id === tipoId)?.nombre || "N/A";
  };

  const getRolName = (rolId) => {
    return roles.find((r) => r.id === rolId)?.nombre || "N/A";
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.id);
      setFormData({ ...usuario });
    } else {
      setEditingId(null);
      setFormData({
        nombres: "",
        apellidos: "",
        tipoDocumentoId: "",
        numeroDocumento: "",
        genero: "",
        email: "",
        telefono: "",
        rolId: "",
        fechaNacimiento: "",
        foto: "",
        direccion: "",
        password: "",
      });
    }
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
    const requiredFields = [
      "nombres",
      "apellidos",
      "email",
      "tipoDocumentoId",
      "numeroDocumento",
      "genero",
      "rolId",
      "telefono",
      "fechaNacimiento",
    ];

    if (!editingId) requiredFields.push("password");

    const errors = validateForm(formData, requiredFields);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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
    };

    if (editingId && !payload.password) {
      delete payload.password;
    }

    try {
      if (editingId) {
        await api.put(`/usuarios/${editingId}`, payload);
      } else {
        await api.post("/usuarios", payload);
      }

      const data = await api.get("/usuarios");
      setAllUsuarios(data.usuarios || data || []);

      setTimeout(() => {
        setOpenModal(false);
        setFormErrors({});
      }, 500);
    } catch (err) {
      setFormErrors({ submit: err.message || "Error al guardar usuario" });
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

      if (!payload.password) delete payload.password;

      await fetch(`${API}/usuarios/${duplicateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await fetch(`${API}/usuarios`);
      setAllUsuarios(await res.json());

      setOpenDuplicateDialog(false);
      setOpenModal(false);
      setDuplicateData(null);
    } catch (err) {
      setFormErrors({ submit: "Error al reactivar usuario" });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas marcar este usuario como inactivo?"
      )
    ) {
      try {
        await api.delete(`/usuarios/${id}`);
        const data = await api.get("/usuarios");
        setAllUsuarios(data.usuarios || data || []);
      } catch (err) {
        alert(err.message || "Error al eliminar usuario");
        console.error(err);
      }
    }
  };

  const handleRestoreInactive = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas reactivar este usuario?")) {
      try {
        const usuario = usuariosInactivos.find((u) => u.id === id);
        await api.put(`/usuarios/${id}`, {
          ...usuario,
          estado: true,
        });

        const data = await api.get("/usuarios");
        setAllUsuarios(data.usuarios || data || []);
      } catch (err) {
        alert(err.message || "Error al reactivar usuario");
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
                        {getDocumentoName(usuario.tipoDocumentoId)} -{" "}
                        {usuario.numeroDocumento}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.telefono}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRolName(usuario.rolId) || "Sin rol"}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal(usuario)}
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(usuario.id)}
                          title="Desactivar"
                        >
                          <DeleteIcon fontSize="small" />
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
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No hay usuarios inactivos
                    </TableCell>
                  </TableRow>
                ) : (
                  usuariosInactivos.map((usuario) => (
                    <TableRow key={usuario.id} hover>
                      <TableCell>{usuario.nombres}</TableCell>
                      <TableCell>{usuario.apellidos}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.updatedAt
                          ? new Date(usuario.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreInactive(usuario.id)}
                          title="Reactivar"
                        >
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingId ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            {formErrors.submit && (
              <Alert severity="error">{formErrors.submit}</Alert>
            )}

            <TextField
              fullWidth
              label="Nombres"
              value={formData.nombres}
              onChange={(e) => handleInputChange("nombres", e.target.value)}
              error={!!formErrors.nombres}
              helperText={formErrors.nombres}
              size="small"
            />

            <TextField
              fullWidth
              label="Apellidos"
              value={formData.apellidos}
              onChange={(e) => handleInputChange("apellidos", e.target.value)}
              error={!!formErrors.apellidos}
              helperText={formErrors.apellidos}
              size="small"
            />

            <FormControl
              fullWidth
              size="small"
              error={!!formErrors.tipoDocumentoId}
            >
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                value={formData.tipoDocumentoId}
                label="Tipo de Documento"
                onChange={(e) =>
                  handleInputChange("tipoDocumentoId", e.target.value)
                }
              >
                {documentTypes.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Número de Documento"
              value={formData.numeroDocumento}
              onChange={(e) =>
                handleInputChange("numeroDocumento", e.target.value)
              }
              error={!!formErrors.numeroDocumento}
              helperText={formErrors.numeroDocumento}
              size="small"
            />

            <FormControl fullWidth size="small" error={!!formErrors.genero}>
              <InputLabel>Género</InputLabel>
              <Select
                value={formData.genero}
                label="Género"
                onChange={(e) => handleInputChange("genero", e.target.value)}
              >
                {GENEROS.map((g) => (
                  <MenuItem key={g.value} value={g.value}>
                    {g.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              size="small"
            />

            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              error={!!formErrors.telefono}
              helperText={formErrors.telefono}
              size="small"
            />

            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.fechaNacimiento}
              onChange={(e) =>
                handleInputChange("fechaNacimiento", e.target.value)
              }
              error={!!formErrors.fechaNacimiento}
              helperText={formErrors.fechaNacimiento}
              size="small"
            />

            <FormControl fullWidth size="small" error={!!formErrors.rolId}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.rolId}
                label="Rol"
                onChange={(e) => handleInputChange("rolId", e.target.value)}
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Dirección"
              value={formData.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              size="small"
            />

            {!editingId && (
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password || "Mínimo 6 caracteres"}
                size="small"
              />
            )}

            <TextField
              fullWidth
              label="Foto (URL)"
              value={formData.foto}
              onChange={(e) => handleInputChange("foto", e.target.value)}
              placeholder="https://ejemplo.com/foto.jpg"
              size="small"
              helperText="Ingresa la URL de la foto (opcional)"
            />
          </Stack>
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
            {editingId ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDuplicateDialog}
        onClose={() => setOpenDuplicateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#f44336" }}>
          Usuario Inactivo Encontrado
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ya existe un usuario inactivo con estos nombres y apellidos.
          </Alert>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Nombre:</strong> {duplicateData?.nombres}{" "}
            {duplicateData?.apellidos}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {duplicateData?.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDuplicateDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleReactivate}
            variant="contained"
            color="warning"
            startIcon={<RestoreIcon />}
          >
            Reactivar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Usuarios;
