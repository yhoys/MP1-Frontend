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

function Roles() {
  const [allRoles, setAllRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [duplicateData, setDuplicateData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
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

  const checkDuplicate = (nombre) => {
    return allRoles.find(
      (r) =>
        r.estado === false && r.nombre.toLowerCase() === nombre.toLowerCase()
    );
  };

  const handleSave = async () => {
    if (!formData.nombre) {
      alert("El nombre del rol es requerido");
      return;
    }

    // Si es crear, verificar duplicados
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
    } catch {
      alert("Error al guardar rol");
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
    } catch {
      alert("Error al reactivar rol");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas marcar este rol como inactivo?")) {
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
      } catch {
        alert("Error al eliminar rol");
      }
    }
  };

  const handleRestoreInactive = async (id) => {
    if (window.confirm("¿Deseas reactivar este rol?")) {
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
      } catch {
        alert("Error al reactivar rol");
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
                    <TableRow key={rol.id} hover sx={{ opacity: 0.7 }}>
                      <TableCell>
                        <strong>{rol.nombre}</strong>
                      </TableCell>
                      <TableCell>{rol.descripcion}</TableCell>
                      <TableCell>
                        {new Date(rol.updatedAt).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreInactive(rol.id)}
                          title="Reactivar rol"
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

        {/* Dialog duplicado */}
        <Dialog
          open={openDuplicateDialog}
          onClose={() => setOpenDuplicateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>⚠️ Rol Duplicado</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ya existe un rol con el nombre <strong>{formData.nombre}</strong>{" "}
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

export default Roles;
