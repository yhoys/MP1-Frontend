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
  IconButton,
  Typography,
  Tabs,
  Tab,
  Alert,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import { PERMISOS } from "../constants/enums";

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

function Roles() {
  const [allRoles, setAllRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [duplicateData, setDuplicateData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
  });

  const roles = allRoles.filter((r) => r.estado !== false);
  const rolesInactivos = allRoles.filter((r) => r.estado === false);

  useEffect(() => {
    fetch(`${API}/roles`)
      .then((r) => r.json())
      .then((data) => setAllRoles(data || []))
      .catch(() => setAllRoles([]));
  }, []);

  const handleOpenModal = (rol = null) => {
    if (rol) {
      setEditingId(rol.id);
      setFormData({
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        permisos: rol.permisos || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        permisos: [],
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

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => {
      const permisos = prev.permisos.includes(permission)
        ? prev.permisos.filter((p) => p !== permission)
        : [...prev.permisos, permission];
      return { ...prev, permisos };
    });
  };

  const checkDuplicate = (nombre) => {
    return allRoles.find(
      (r) =>
        r.estado === false && r.nombre.toLowerCase() === nombre.toLowerCase()
    );
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.nombre?.trim()) errors.nombre = "El nombre es requerido";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!editingId) {
      const duplicate = checkDuplicate(formData.nombre);
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
      setAllRoles(await res.json());
    } catch (err) {
      setFormErrors({ submit: "Error al guardar rol" });
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
      await fetch(`${API}/roles/${duplicateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOpenDuplicateDialog(false);
      setOpenModal(false);
      setDuplicateData(null);
      const res = await fetch(`${API}/roles`);
      setAllRoles(await res.json());
    } catch (err) {
      setFormErrors({ submit: "Error al reactivar rol" });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas marcar este rol como inactivo?"
      )
    ) {
      try {
        const rol = roles.find((r) => r.id === id);
        await fetch(`${API}/roles/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rol,
            estado: false,
            updatedAt: new Date().toISOString(),
          }),
        });
        const res = await fetch(`${API}/roles`);
        setAllRoles(await res.json());
      } catch (err) {
        alert("Error al eliminar rol");
        console.error(err);
      }
    }
  };

  const handleRestoreInactive = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas reactivar este rol?")) {
      try {
        const rol = rolesInactivos.find((r) => r.id === id);
        await fetch(`${API}/roles/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rol,
            estado: true,
            updatedAt: new Date().toISOString(),
          }),
        });
        const res = await fetch(`${API}/roles`);
        setAllRoles(await res.json());
      } catch (err) {
        alert("Error al reactivar rol");
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
            Gestión de Roles
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
              Nuevo Rol
            </Button>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="rol tabs"
          >
            <Tab label={`Activos (${roles.length})`} id="tab-0" />
            <Tab label={`Inactivos (${rolesInactivos.length})`} id="tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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
                    <strong>Permisos</strong>
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
                      <TableCell>{rol.nombre}</TableCell>
                      <TableCell>{rol.descripcion}</TableCell>
                      <TableCell>{(rol.permisos || []).length}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal(rol)}
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(rol.id)}
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
            Aquí se muestran los roles inactivos. Puedes reactivarlos si es
            necesario.
          </Alert>
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
                    <strong>Inactivado en</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rolesInactivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No hay roles inactivos
                    </TableCell>
                  </TableRow>
                ) : (
                  rolesInactivos.map((rol) => (
                    <TableRow key={rol.id} hover>
                      <TableCell>{rol.nombre}</TableCell>
                      <TableCell>{rol.descripcion}</TableCell>
                      <TableCell>
                        {rol.updatedAt
                          ? new Date(rol.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreInactive(rol.id)}
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
          {editingId ? "Editar Rol" : "Nuevo Rol"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {formErrors.submit && (
              <Alert severity="error">{formErrors.submit}</Alert>
            )}

            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
              size="small"
            />

            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              size="small"
              multiline
              rows={2}
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Permisos
              </Typography>
              <FormGroup>
                {PERMISOS.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={formData.permisos.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                      />
                    }
                    label={permission.replace(/_/g, " ").toUpperCase()}
                  />
                ))}
              </FormGroup>
            </Box>
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
          Rol Inactivo Encontrado
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ya existe un rol inactivo con el nombre{" "}
            <strong>{formData.nombre}</strong>.
          </Alert>
          <Typography variant="body2">
            ¿Deseas reactivarlo o crear uno nuevo?
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
            Reactivar Rol
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Roles;
