# Guía Rápida: Nueva Funcionalidad de Soft-Delete

## 🎯 En 30 Segundos

El sistema ahora tiene:

1. **Dos tabs por módulo:** Activos (normal) e Inactivos (archivados)
2. **Detección de duplicados:** Si creas algo que ya existe (inactivo), te pregunta si reactivarlo
3. **Restricciones inteligentes:**
   - Activos: puedes editar y eliminar
   - Inactivos: solo puedes reactivar
4. **Sin pérdida de datos:** Nada se borra, todo se puede recuperar

---

## 🖱️ Operaciones Comunes

### ✅ Crear Elemento Nuevo

```
1. Abre módulo (ej: Usuarios)
2. Click: [Nuevo Usuario]
3. Completa formulario
4. Click: [Guardar]
→ Aparece en Tab "Activos"
```

### ✅ Editar Elemento

```
1. Tab "Activos"
2. Busca el elemento
3. Click: ✏️ (Editar)
4. Modifica datos
5. Click: [Guardar]
→ Actualizado en Tab "Activos"
```

### ✅ Eliminar Elemento (Inactivar)

```
1. Tab "Activos"
2. Busca el elemento
3. Click: 🗑️ (Eliminar)
4. Confirma: "¿Deseas marcar como inactivo?"
5. Acepta
→ Desaparece de "Activos"
→ Aparece en Tab "Inactivos"
```

### ✅ Reactivar Elemento

```
Opción A - Desde Tab Inactivos:
  1. Abre Tab "Inactivos"
  2. Busca el elemento
  3. Click: 🔄 (Reactivar)
  4. Confirma
  → Aparece en Tab "Activos"

Opción B - Al Crear Duplicado:
  1. Intenta crear elemento con nombre duplicado
  2. Sistema detecta que existe (inactivo)
  3. Muestra: "⚠️ Duplicado"
  4. Click: [Reactivar y Actualizar]
  → Se reactiva y actualiza
```

---

## ⚠️ Lo que Cambió

### Antes

```
[Usuarios]
├─ Tabla con todos (activos + inactivos)
├─ Un botón "Nuevo"
├─ Botones: Editar, Eliminar
└─ Sin opciones de recuperación
```

### Ahora

```
[Usuarios]
├─ Tab 1 "Activos (15)"
│  ├─ Solo activos
│  ├─ Botón "Nuevo" aquí
│  └─ Botones: Editar, Eliminar
│
└─ Tab 2 "Inactivos (3)"
   ├─ Solo inactivos (semi-transparentes)
   ├─ Sin botón "Nuevo"
   └─ Solo botón: Reactivar
```

---

## 🔍 Ejemplos Prácticos

### Ejemplo 1: Usuario Duplicado

```
SITUACIÓN: María García fue eliminada hace 2 meses
           Ahora quieres crear a otra María García

PASO 1: Click en [Nuevo Usuario]
PASO 2: Ingresa:
        - Nombres: María
        - Apellidos: García
        - Otros datos...

PASO 3: Click en [Guardar]

RESULTADO: Aparece diálogo

┌─────────────────────────────────────┐
│ ⚠️ Usuario Duplicado               │
├─────────────────────────────────────┤
│ Ya existe un usuario con el nombre  │
│ María García pero está marcado      │
│ como inactivo.                      │
│                                     │
│ ¿Deseas reactivarlo con la nueva   │
│ información o deseas cancelar?      │
│                                     │
│ [Cancelar] [Reactivar y Actualizar]│
└─────────────────────────────────────┘

OPCIÓN A: Click [Cancelar]
  → Modal sigue abierto
  → Puedes editar y cambiar datos
  → Intentar guardar de nuevo

OPCIÓN B: Click [Reactivar y Actualizar]
  → María García se reactiva
  → Se actualiza con nuevos datos
  → Aparece en Tab "Activos"
  → Modal se cierra
```

### Ejemplo 2: Eliminar y Recuperar

```
PASO 1: Tab "Activos" → Busca "Pedro Pérez"
PASO 2: Click en 🗑️ (Eliminar)
PASO 3: Confirma: "¿Deseas marcar como inactivo?"
PASO 4: Click [Aceptar]

RESULTADO:
✓ Pedro desaparece de Tab "Activos"
✓ Aparece en Tab "Inactivos"
✓ Las filas inactivas se ven semi-transparentes

RECUPERACIÓN:
PASO 1: Abre Tab "Inactivos"
PASO 2: Busca "Pedro Pérez"
PASO 3: Click en 🔄 (Reactivar)
PASO 4: Confirma
RESULTADO:
✓ Pedro reaparece en Tab "Activos"
```

### Ejemplo 3: Cambiar de Tab

```
ANTES: Solo había una lista mezclada

AHORA:
┌──────────────────────────────────────┐
│ [Activos (15)]  [Inactivos (3)]     │
├──────────────────────────────────────┤
│                                      │
│ TAB 1 - Activos:                    │
│ • Todos los elementos en uso        │
│ • Botón: Nuevo                      │
│ • Botones: Editar, Eliminar        │
│                                      │
│ TAB 2 - Inactivos:                  │
│ • Todos los elementos archivados    │
│ • Sin botón: Nuevo                  │
│ • Solo botón: Reactivar            │
│ • Filas semi-transparentes          │
│                                      │
└──────────────────────────────────────┘
```

---

## 📊 Estados Posibles

### Estado: ACTIVO ✅

```
Código: estado = true
Ubicación: Tab "Activos"
Visible: Sí, normal
Opacidad: 100%
Operaciones: ✏️ Editar, 🗑️ Eliminar
Auditoría: Se registra cualquier cambio
```

### Estado: INACTIVO ❌

```
Código: estado = false
Ubicación: Tab "Inactivos"
Visible: Sí, pero difuminado
Opacidad: 70%
Operaciones: 🔄 Reactivar (solo)
Auditoría: Se registra la reactivación
```

---

## 🔐 Seguridades Implementadas

✅ **Prevención de Duplicados**

- No puedes crear dos con el mismo nombre
- Te ofrece reactivar en lugar de crear nuevo

✅ **Restricciones Contextuales**

- No puedes editar inactivos
- No puedes eliminar inactivos
- No puedes crear nuevo desde tab inactivos

✅ **Recuperación Garantizada**

- Nada se borra permanentemente
- Todo se puede reactivar desde tab inactivos

✅ **Auditoría Completa**

- Se registra quién hizo qué y cuándo
- Disponible en `auditLogs` (DocumentTypes)

---

## 🎨 Iconos y Colores

| Icono | Significado          | Ubicación            |
| ----- | -------------------- | -------------------- |
| ➕    | Crear nuevo          | Tab Activos header   |
| ✏️    | Editar               | Tab Activos, fila    |
| 🗑️    | Eliminar (inactivar) | Tab Activos, fila    |
| 🔄    | Reactivar            | Tab Inactivos, fila  |
| ℹ️    | Información          | Tab Inactivos, alert |

---

## 📋 Módulos con Nueva Funcionalidad

- ✅ **Usuarios** - Detecta duplicados por: `nombres + apellidos`
- ✅ **Roles** - Detecta duplicados por: `nombre`
- ✅ **Document Types** - Detecta duplicados por: `codigo`

---

## 🚨 Casos de Error (¿Qué Sucede?)

### Intento editar elemento inactivo

```
❌ No ves botón ✏️ en Tab Inactivos
→ Debes reactivar primero
→ Luego puedes editar en Tab Activos
```

### Intento eliminar elemento inactivo

```
❌ No ves botón 🗑️ en Tab Inactivos
→ Ya está inactivo
→ Solo puedes reactivarlo o dejarlo así
```

### Intento crear duplicado

```
✅ Sistema lo detecta
→ Muestra diálogo
→ Te pregunta si reactivar
→ Nunca crea duplicado
```

---

## 📞 Preguntas Frecuentes

**P: ¿Se pierde la información cuando inactivo?**  
R: No. La información queda guardada en Tab "Inactivos" y puedes reactivarla cuando quieras.

**P: ¿Puedo editar un elemento inactivo?**  
R: No directamente. Primero debes reactivarlo (aparecerá en Tab "Activos"), luego editar.

**P: ¿Cuál es la diferencia entre Editar y Reactivar+Actualizar?**  
R:

- Editar: Módulo normal, actualizas datos de elemento activo
- Reactivar+Actualizar: Al crear duplicado, el sistema reactiva el inactivo y lo actualiza

**P: ¿Se puede eliminar permanentemente?**  
R: No. El sistema nunca borra datos permanentemente. Todo queda archivado en "Inactivos".

**P: ¿Quién puede ver elementos inactivos?**  
R: Todos los usuarios autenticados. Aparecen en Tab "Inactivos".

---

## 🎓 Resumen

```
Operación       Antes           Ahora
─────────────────────────────────────────
Crear           Create normal   ✓ Detecta duplicados
Visualizar      Mezclado        ✓ Tabs separados
Editar          Normal          ✓ Solo activos
Eliminar        Delete físico   ✓ Soft-delete
Recuperar       No posible      ✓ Reactivar
Auditoría       No completa     ✓ Completa
```

---

**Última actualización:** 20 de Noviembre, 2025  
**Versión:** 2.0  
**Estado:** ✅ Producción
