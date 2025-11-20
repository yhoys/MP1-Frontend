# Política de Soft-Delete (Actualizada)

## Descripción General

El sistema implementa **eliminación lógica (soft-delete)** en lugar de eliminación física. Los registros nunca se borran, sino que se marcan como inactivos mediante un campo booleano `estado`.

## Restricciones Principales

### 1. **Visualización (READ)**

- ✅ Tab **"Activos"**: Muestra solo registros con `estado: true`
- ✅ Tab **"Inactivos"**: Muestra solo registros con `estado: false`
- ✅ Interfaz dedicada para ver y reactivar elementos inactivos

### 2. **Edición (UPDATE)**

- ✅ **Solo se pueden editar registros activos** (`estado: true`)
- ❌ Los botones de editar NO aparecen en registros inactivos
- Los botones solo son accesibles en la tab de "Activos"

### 3. **Eliminación (DELETE)**

- ✅ **Solo se pueden eliminar registros activos** (marcar como inactivo)
- ❌ Los botones de eliminar NO aparecen en registros inactivos
- La eliminación cambia `estado` a `false` en lugar de borrar

### 4. **Detección de Duplicados**

- ✅ Al crear un nuevo elemento, el sistema verifica si existe uno inactivo con el **mismo identificador único**
- ✅ Si lo encuentra, muestra un diálogo de advertencia: **"⚠️ [Tipo] Duplicado"**
- ✅ El usuario puede optar por:
  - **"Reactivar y Actualizar"**: Reactiva con la nueva información
  - **"Cancelar"**: Cancela la operación

### 5. **Reactivación**

- ✅ Solo en la tab "Inactivos" aparece un botón **"Reactivar"** (icono de refresh)
- ✅ Al reactivar:
  - Se cambia `estado` de `false` a `true`
  - Se actualiza `updatedAt`
  - Se registra en auditoría
  - El elemento se mueve a la tab "Activos"

## Identificadores Únicos por Módulo

| Módulo                 | Campo(s) Único(s)     | Búsqueda         |
| ---------------------- | --------------------- | ---------------- |
| **Usuarios**           | `nombres + apellidos` | Case-insensitive |
| **Roles**              | `nombre`              | Case-insensitive |
| **Tipos de Documento** | `codigo`              | Case-insensitive |

## Flujo de Creación con Duplicado

```
1. Usuario intenta crear: "Rol" → nombre = "Administrador"
   ↓
2. Sistema valida campos → ✓ Válido
   ↓
3. Busca rol inactivo con nombre "Administrador" → ✓ Encontrado
   ↓
4. Muestra diálogo: "⚠️ Rol Duplicado
                      Ya existe un rol con el nombre Administrador
                      pero está marcado como inactivo.
                      ¿Deseas reactivarlo con la nueva información?"
   ↓
5. Usuario elige:

   Opción A: "Reactivar y Actualizar"
   ├─ Reactiva registro (estado: true)
   ├─ Actualiza información
   ├─ Registra auditoría: "Reactivado: Administrador"
   └─ Muestra en tab "Activos"

   Opción B: "Cancelar"
   └─ Cierra diálogo sin hacer cambios
```

## Estructura de Tabs

### Tab 1: Activos (Ejemplo: "Activos (5)")

- Muestra todos los registros con `estado !== false`
- Botón **"Nuevo [Elemento]"** disponible en header
- Columnas: Datos principales + botones **Editar** y **Eliminar**
- Filas con opacidad normal (opacity: 1)

### Tab 2: Inactivos (Ejemplo: "Inactivos (2)")

- Muestra todos los registros con `estado === false`
- No hay botón "Nuevo" (solo en tab Activos)
- Columnas: Datos principales + fecha inactivado + botón **Reactivar**
- Filas con opacidad reducida (opacity: 0.7)
- Alert informativo: "Aquí se muestran los elementos inactivos..."

## Operaciones Detalladas

### CREATE (Crear)

```javascript
1. Valida campos requeridos
2. Si es crear (no editar):
   - Busca duplicado inactivo (mismo identificador)
   - Si existe → Muestra diálogo de duplicado
     - Usuario reactivar: Actualiza registro inactivo
     - Usuario cancelar: Cancela operación
   - Si no existe → Crea nuevo registro
3. Nuevo registro: estado = true, createdAt, updatedAt
```

### READ (Leer)

```javascript
const activos = allRecords.filter((r) => r.estado !== false);
const inactivos = allRecords.filter((r) => r.estado === false);
// Se muestran en tabs separados
```

### UPDATE (Actualizar)

```javascript
// Solo disponible en registros activos (estado === true)
// Cambios:
- Mantiene estado = true
- Actualiza updatedAt
- Registra en auditoría
```

### DELETE (Eliminar/Inactivar)

```javascript
// Solo disponible en registros activos
// En lugar de borrar:
- Establece estado = false
- Actualiza updatedAt
- Registra en auditoría como "Eliminado"
- Remueve de vista (aparece en tab inactivos)
```

### RESTORE (Reactivar)

```javascript
// Solo disponible en registros inactivos
// Al reactivar:
- Establece estado = true
- Actualiza updatedAt
- Registra en auditoría como "Reactivado"
- Remueve de tab inactivos
- Aparece en tab activos
```

## Ejemplo de Código

### Detección de Duplicado

```javascript
const checkDuplicate = (nombre) => {
  return allRoles.find(
    (r) =>
      r.estado === false && // ← Inactivo
      r.nombre.toLowerCase() === nombre.toLowerCase() // ← Mismo nombre
  );
};
```

### Manejo en handleSave

```javascript
if (!editingId) {
  // Si es crear
  const duplicate = checkDuplicate(formData.nombre);
  if (duplicate) {
    setDuplicateData(duplicate);
    setOpenDuplicateDialog(true);
    return; // ← Detiene guardado normal
  }
}
// Si no hay duplicado, continúa con CREATE normal
```

### Reactivación desde Duplicado

```javascript
const handleReactivate = async () => {
  const payload = {
    ...duplicateData, // Datos anteriores
    ...formData, // Nuevos datos
    estado: true, // ← Reactivar
    updatedAt: new Date().toISOString(),
  };
  await fetch(`${API}/roles/${duplicateData.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  // Actualizar vistas...
};
```

## Beneficios

✅ **Prevención de Duplicados:** Detecta intentos de crear duplicados  
✅ **Recuperación:** Los datos nunca se pierden  
✅ **Interfaz Clara:** Tabs separados para activos/inactivos  
✅ **Control Granular:** Solo permitir operaciones válidas por estado  
✅ **Auditoría Completa:** Registra todas las acciones  
✅ **UX Mejorada:** Opciones contextuales según estado  
✅ **Trazabilidad:** Historial completo de cambios

## Notas Importantes

- ⚠️ Los botones de editar/eliminar **no existen** en registros inactivos
- ⚠️ El botón "Nuevo" **solo aparece** en la tab "Activos"
- ⚠️ La reactivación se puede hacer desde:
  1. Tab "Inactivos" → Botón "Reactivar"
  2. Al crear duplicado → Diálogo → "Reactivar y Actualizar"
- ⚠️ Los registros nunca se borran físicamente
- ⚠️ `updatedAt` se actualiza en cada operación (crear, editar, eliminar, reactivar)
