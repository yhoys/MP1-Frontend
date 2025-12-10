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
  Tabs,
  Tab,
  Alert,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
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

function DocumentTypes() {
  const [allTipos, setAllTipos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [duplicateData, setDuplicateData] = useState(null);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    tipoAccion: "create",
  });

  const tipos = allTipos.filter((t) => t.estado !== false);
  const tiposInactivos = allTipos.filter((t) => t.estado === false);

  useEffect(() => {
    api
      .get("/document-types")
      .then((data) => setAllTipos(data || []))
      .catch(() => setAllTipos([]));
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

  const checkDuplicate = (codigo) => {
    return allTipos.find(
      (t) =>
        t.estado === false && t.codigo.toLowerCase() === codigo.toLowerCase()
    );
  };

  const handleSave = async () => {
    if (!formData.codigo || !formData.nombre) {
      alert("El código y nombre del tipo de documento son requeridos");
      return;
    }

    if (!editingId) {
      const duplicate = checkDuplicate(formData.codigo);
      if (duplicate) {
        setDuplicateData(duplicate);
        setOpenDuplicateDialog(true);
        return;
      }
    }

    const now = new Date().toISOString();
    const accion = editingId ? "edit" : "create";

    const payload = {
      ...formData,
      estado: true,
      tipoAccion: accion,
      usuarioAccion: "Sistema",
      fechaHoraEvento: now,
      createdAt: editingId ? undefined : now,
      updatedAt: now,
    };

    try {
      if (editingId) {
        await api.put(`/document-types/${editingId}`, payload);
      } else {
        await api.post("/document-types", payload);
      }

      setOpenModal(false);
      const data = await api.get("/document-types");
      setAllTipos(data);
    } catch {
      alert("Error al guardar tipo de documento");
    }
  };

  const handleReactivate = async () => {
    if (!duplicateData) return;
    try {
      const now = new Date().toISOString();
      const payload = {
        ...duplicateData,
        ...formData,
        estado: true,
        tipoAccion: "reactivate",
        usuarioAccion: "Sistema",
        fechaHoraEvento: now,
        updatedAt: now,
      };

      await api.put(`/document-types/${duplicateData.id}`, payload);

      setOpenDuplicateDialog(false);
      setOpenModal(false);
      setDuplicateData(null);
      const data = await api.get("/document-types");
      setAllTipos(data);
    } catch {
      alert("Error al reactivar tipo de documento");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Deseas marcar este tipo de documento como inactivo?")
    ) {
      try {
        const tipo = tipos.find((t) => t.id === id);
        const now = new Date().toISOString();

        await api.put(`/document-types/${id}`, {
          ...tipo,
          estado: false,
          tipoAccion: "delete",
          usuarioAccion: "Sistema",
          fechaHoraEvento: now,
          updatedAt: now,
        });

        const data = await api.get("/document-types");
        setAllTipos(data);
      } catch {
        alert("Error al eliminar tipo de documento");
      }
    }
  };

  const handleRestoreInactive = async (id) => {
    if (window.confirm("¿Deseas reactivar este tipo de documento?")) {
      try {
        const tipo = tiposInactivos.find((t) => t.id === id);
        const now = new Date().toISOString();

        await api.put(`/document-types/${id}`, {
          ...tipo,
          estado: true,
          tipoAccion: "reactivate",
          usuarioAccion: "Sistema",
          fechaHoraEvento: now,
          updatedAt: now,
        });

        const data = await api.get("/document-types");
        setAllTipos(data);
      } catch {
        alert("Error al reactivar tipo de documento");
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
          {tabValue === 0 && (
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
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="document type tabs"
          >
            <Tab label={`Activos (${tipos.length})`} id="tab-0" />
            <Tab label={`Inactivos (${tiposInactivos.length})`} id="tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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
                    <strong>Tipo Acción</strong>
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
                        <Tooltip
                          title={tipo.fechaHoraEvento || "Sin información"}
                        >
                          <span>
                            {new Date(
                              tipo.fechaHoraEvento || tipo.updatedAt
                            ).toLocaleDateString("es-CO")}{" "}
                            {new Date(
                              tipo.fechaHoraEvento || tipo.updatedAt
                            ).toLocaleTimeString("es-CO")}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`Acción: ${tipo.tipoAccion || "N/A"}`}>
                          <span>{tipo.tipoAccion || "N/A"}</span>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Aquí se muestran los tipos de documento inactivos. Puedes
            reactivarlos si es necesario.
          </Alert>
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
                    <strong>Inactivado en</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tipo Acción</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tiposInactivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No hay tipos de documento inactivos
                    </TableCell>
                  </TableRow>
                ) : (
                  tiposInactivos.map((tipo) => (
                    <TableRow key={tipo.id} hover sx={{ opacity: 0.7 }}>
                      <TableCell>
                        <strong>{tipo.codigo}</strong>
                      </TableCell>
                      <TableCell>{tipo.nombre}</TableCell>
                      <TableCell>
                        {new Date(tipo.updatedAt).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={`Tipo acción: ${tipo.tipoAccion || "N/A"}`}
                        >
                          <span>{tipo.tipoAccion || "N/A"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreInactive(tipo.id)}
                          title="Reactivar tipo de documento"
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

        <Dialog
          open={openDuplicateDialog}
          onClose={() => setOpenDuplicateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tipo de Documento Duplicado</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ya existe un tipo de documento con el código{" "}
              <strong>{formData.codigo}</strong> pero está marcado como
              inactivo.
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

export default DocumentTypes;
