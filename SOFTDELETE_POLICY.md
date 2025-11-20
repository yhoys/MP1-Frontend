# Política de Soft-Delete

## Descripción General

El sistema implementa **eliminación lógica (soft-delete)** en lugar de eliminación física. Esto significa que los registros nunca se borran de la base de datos, sino que se marcan como inactivos mediante un campo booleano `estado`.

## Campo `estado`

- **Tipo:** Booleano
- **Valores:**
  - `true`: Registro activo (visible en la aplicación)
  - `false`: Registro inactivo (no visible en la aplicación)

## Operaciones según el Estado

### 1. **CREAR (CREATE)**

- Se crea el registro con `estado: true`
- Se establecen `createdAt` y `updatedAt` con la fecha/hora actual
- Se registra el usuario que realizó la acción (en auditoría)

### 2. **LEER (READ)**

- Las consultas filtran automáticamente registros con `estado: true`
- Los registros con `estado: false` no se muestran en las listas
- Solo aparecen en reportes de auditoría si se requiere historial

### 3. **ACTUALIZAR (UPDATE)**

- Al modificar un registro, se:
  - Mantiene el `estado` actual
  - Actualiza `updatedAt` con la fecha/hora actual
  - Registra quién realizó la acción (auditoría)
- Los registros activos (`estado: true`) se pueden editar normalmente
- Los registros inactivos (`estado: false`) pueden reactivarse estableciendo `estado: true`

### 4. **ELIMINAR (DELETE)**

- En lugar de borrar físicamente:
  1. Se establece `estado: false`
  2. Se actualiza `updatedAt` con la fecha/hora actual
  3. Se registra quién realizó la acción en auditoría
  4. Se remueve de la vista de la aplicación

## Beneficios

✅ **Trazabilidad completa:** Historial completo de cambios
✅ **Recuperación:** Los datos nunca se pierden, pueden reactivarse
✅ **Auditoría:** Se puede registrar quién y cuándo realizó cada acción
✅ **Cumplimiento legal:** Conserva datos para auditorías futuras
✅ **Integridad referencial:** Evita problemas con relaciones entre tablas

## Implementación

### En Usuarios

- Campo: `estado` (booleano)
- Auditoría: `ultimoUsuario`, `ultimaAccion`
- Filtro en listado: `(data || []).filter((u) => u.estado !== false)`

### En Roles

- Campo: `estado` (booleano)
- Filtro en listado: `(data || []).filter((r) => r.estado !== false)`

### En DocumentTypes

- Campo: `estado` (booleano)
- Auditoría completa en `auditLogs`
- Campos: `ultimoUsuario`, `ultimaAccion`
- Filtro en listado: `(data || []).filter((t) => t.estado !== false)`

## Ejemplo en Código

```javascript
// Al eliminar un usuario
const usuario = { id: 1, nombre: "Juan", estado: true };
// Se ejecuta:
await fetch(`/api/usuarios/1`, {
  method: "PUT",
  body: JSON.stringify({
    ...usuario,
    estado: false, // ← Soft-delete
    updatedAt: new Date().toISOString(),
  }),
});

// En la vista, se filtra:
const usuariosActivos = usuarios.filter((u) => u.estado !== false);
```

## Notas Importantes

- El frontend **siempre filtra** registros con `estado !== false` antes de mostrar
- Los registros se actualizan en timestamp cada vez que se modifican
- La auditoría registra quién realizó cada acción (cuando se implementa)
- Nunca se debe eliminar físicamente datos de la base de datos
- Para reactivar un registro, solo cambiar `estado` a `true`
