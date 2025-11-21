# Estructura del Proyecto - Guía Completa

## 📁 Organización General

```
microproyecto-usuarios/
├── src/
│   ├── auth/              # Sistema de autenticación
│   ├── components/        # Componentes reutilizables
│   ├── constants/         # Valores constantes
│   ├── pages/            # Páginas principales
│   ├── utils/            # Funciones auxiliares
│   ├── App.jsx           # Configuración de rutas
│   └── main.jsx          # Punto de entrada
├── db.json               # Base de datos simulada
├── package.json          # Dependencias
└── README.md             # Documentación principal
```

---

## 🔐 Carpeta `auth/` - Sistema de Autenticación

### 📄 `AuthContext.js`

**¿Qué es?** Contexto de React que almacena el estado global de autenticación.

**¿Para qué?** Permite que cualquier componente acceda a la información del usuario autenticado sin pasar props manualmente.

**Qué exporta:**

```javascript
export const AuthContext = createContext(null);
```

---

### 📄 `AuthProvider.jsx`

**¿Qué es?** Componente proveedor que envuelve toda la aplicación.

**¿Para qué?** Maneja la lógica de login/logout y proporciona el contexto a toda la app.

**Responsabilidades:**

- `login({ email, password })` - Valida credenciales contra la BD
- `logout()` - Limpia sesión
- `hasPermission(permission)` - Verifica si el usuario tiene un permiso específico

**¿Cómo funciona?**

1. Usuario ingresa email y contraseña
2. Se busca en `/usuarios` de la API
3. Se obtiene el rol del usuario desde `/roles`
4. Se guardan los datos en `localStorage`
5. Se actualiza el contexto

---

### 📄 `useAuth.js`

**¿Qué es?** Hook personalizado para acceder al contexto de autenticación.

**¿Para qué?** Permite que los componentes usen `const { user, login, logout, hasPermission } = useAuth()`.

**¿Cómo usarlo?**

```javascript
import { useAuth } from "../auth/useAuth";

function MiComponente() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Salir {user?.nombres}</button>;
}
```

---

## 🎨 Carpeta `components/` - Componentes Reutilizables

### 📄 `Navigation.jsx`

**¿Qué es?** Barra superior con menú y perfil de usuario.

**¿Para qué?** Mostrar menús dinámicos según los permisos del usuario.

**Características:**

- ✅ Menú "Usuarios" solo si tiene permiso `ver_usuarios`
- ✅ Menú "Roles" solo si tiene permiso `ver_roles`
- ✅ Muestra nombre y rol del usuario
- ✅ Botón Logout

---

### 📄 `PrivateRoute.jsx`

**¿Qué es?** Componente que protege rutas.

**¿Para qué?** Evitar que usuarios no autenticados accedan a páginas privadas.

**¿Cómo funciona?**

- Si usuario NO está autenticado → Redirige a `/login`
- Si usuario ESTÁ autenticado → Muestra el contenido
- Si requiere permiso específico → Verifica permiso

**Uso:**

```javascript
<PrivateRoute requiredPermission="ver_usuarios">
  <Usuarios />
</PrivateRoute>
```

---

### 📄 `ProtectedRoute.jsx`

**¿Qué es?** Alternativa más simple a PrivateRoute.

**¿Para qué?** Proteger rutas de forma más ligera (actualmente no se usa).

---

## 📄 Carpeta `pages/` - Páginas Principales

### 📄 `Login.jsx`

**¿Qué es?** Página de inicio de sesión.

**¿Para qué?** Que el usuario ingrese email y contraseña.

**Campos:**

- Email (validado)
- Contraseña (mínimo 6 caracteres)

**Demo:**

- Email: `carlos.garcia@example.com`
- Pass: `admin123`

---

### 📄 `Home.jsx`

**¿Qué es?** Página de bienvenida después del login.

**¿Para qué?** Dashboard principal con información del usuario.

---

### 📄 `Usuarios.jsx`

**¿Qué es?** CRUD completo de usuarios.

**¿Para qué?** Crear, editar, ver y eliminar (soft delete) usuarios.

**Campos:**

- Nombres, Apellidos, Documento
- Email, Teléfono, Dirección
- Tipo de Documento (dropdown)
- Rol (dropdown)
- Género (Masculino/Femenino/Otro)
- Fecha de Nacimiento
- Contraseña (solo al crear)

**Funcionalidades:**

- ✅ Pestaña "Activos" - Usuarios vigentes
- ✅ Pestaña "Inactivos" - Usuarios eliminados (soft delete)
- ✅ Validación automática de campos
- ✅ Detección de duplicados
- ✅ Reactivar usuarios inactivos

---

### 📄 `Roles.jsx`

**¿Qué es?** CRUD de roles con gestión de permisos.

**¿Para qué?** Crear y modificar roles con permisos específicos.

**Campos:**

- Nombre del rol
- Descripción
- Checkboxes para 12 permisos diferentes

**Permisos disponibles:**

- `ver_usuarios`, `crear_usuarios`, `editar_usuarios`, `eliminar_usuarios`
- `ver_roles`, `crear_roles`, `editar_roles`, `eliminar_roles`
- `ver_tipos_documento`, `crear_tipos_documento`, `editar_tipos_documento`, `eliminar_tipos_documento`

---

### 📄 `DocumentTypes.jsx`

**¿Qué es?** CRUD de tipos de documento.

**¿Para qué?** Administrar tipos como CC, Pasaporte, etc.

**Campos:**

- Código (CC, PASS, CE, etc.)
- Nombre/Descripción
- Auditoría (fechaHoraEvento, usuarioAccion, tipoAccion)

---

## 📁 Carpeta `constants/` - Valores Constantes

### 📄 `enums.js`

**¿Qué es?** Archivo con valores constantes del sistema.

**Qué contiene:**

```javascript
export const GENEROS = ["Masculino", "Femenino", "Otro"];

export const PERMISOS = [
  "ver_usuarios",
  "crear_usuarios",
  // ... más permisos
];
```

**¿Para qué?** Evitar repetir strings y mantener coherencia en toda la app.

---

## 📁 Carpeta `utils/` - Funciones Auxiliares

### 📄 `validators.js`

**¿Qué es?** Funciones de validación reutilizables.

**Qué valida:**

- Email: `isValidEmail(email)` - Formato válido
- Teléfono: `isValidPhone(phone)` - 7-10 dígitos
- Documento: `isValidDocumentNumber(doc)` - 5-20 caracteres
- Fecha: `isValidDate(date)` - Formato correcto
- Edad: `isValidAge(birthDate, minAge)` - Mayor a edad mínima

**Uso:**

```javascript
import { isValidEmail } from "../utils/validators";

if (!isValidEmail(email)) {
  setError("Email inválido");
}
```

---

## 📄 `App.jsx` - Configuración de Rutas

**¿Qué es?** Archivo principal que define todas las rutas de la aplicación.

**Estructura:**

```
/           → Login (público)
/login      → Login (público)
/home       → Home (privado)
/users      → Usuarios (requiere permiso "ver_usuarios")
/roles      → Roles (requiere permiso "ver_roles")
/document-types → Tipos (requiere permiso "ver_tipos_documento")
```

**¿Cómo funciona?**

- Rutas públicas: Accesibles sin autenticación
- Rutas privadas: Dentro de `<PrivateRoute>` con `requiredPermission`
- Rutas desconocidas: Redirigen a `/`

---

## 🗄️ `db.json` - Base de Datos Simulada

**¿Qué es?** Archivo JSON que simula una base de datos.

**Colecciones:**

### `usuarios[]`

```json
{
  "id": 1,
  "nombres": "Carlos",
  "apellidos": "García",
  "email": "carlos.garcia@example.com",
  "password": "admin123",
  "rolId": 1,
  "tipoDocumentoId": 1,
  "estado": true
}
```

### `roles[]`

```json
{
  "id": 1,
  "nombre": "Super Administrador",
  "permisos": ["ver_usuarios", "crear_usuarios", ...]
}
```

### `documentTypes[]`

```json
{
  "id": 1,
  "codigo": "CC",
  "nombre": "Cédula de Ciudadanía",
  "tipoAccion": "create",
  "usuarioAccion": "system"
}
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa a / o /login
   ↓
2. Completa email y contraseña
   ↓
3. Click en "Ingresar"
   ↓
4. AuthProvider.login({ email, password })
   ├─ Busca usuario en /usuarios
   ├─ Obtiene rol desde /roles/{rolId}
   └─ Guarda en localStorage
   ↓
5. Redirige a /home
   ↓
6. Navigation muestra menús según permisos
   ↓
7. Usuario puede navegar a /users, /roles, /document-types
```

---

## 🔐 Flujo de Autorización (RBAC)

```
1. Usuario tiene rol "Super Administrador"
   ↓
2. Su rol tiene permisos: ["ver_usuarios", "crear_usuarios", ...]
   ↓
3. En Navigation:
   - if (hasPermission("ver_usuarios")) → Mostrar menú Usuarios
   ↓
4. En rutas:
   - <PrivateRoute requiredPermission="ver_usuarios">
   - Si usuario NO tiene permiso → Redirige a /home
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Terminal 1 - Frontend

```bash
npm run dev
```

→ Abre: `http://localhost:5173`

### Terminal 2 - Backend

```bash
npm run backend
```

→ API en: `http://localhost:3001`

---

## 📊 Datos de Prueba

**Usuario 1 - Acceso Total:**

- Email: `carlos.garcia@example.com`
- Pass: `admin123`
- Rol: Super Administrador
- Permisos: Todos ✅

**Usuario 2 - Acceso Limitado:**

- Email: `pedro.perez@example.com`
- Pass: `pass123`
- Rol: Administrador
- Permisos: ver_usuarios, crear_usuarios, editar_usuarios, ver_roles, ver_tipos_documento

---

## 📋 Pruebas Recomendadas

### Test 1: Login

- [ ] Ingresa credenciales incorrectas → Error
- [ ] Ingresa credenciales correctas → Va a /home
- [ ] Actualiza página → Mantiene sesión (localStorage)

### Test 2: RBAC

- [ ] Login como carlos → Ve todos los menús
- [ ] Login como pedro → Ve solo usuarios y tipos (no roles)
- [ ] Intenta acceder a /roles como pedro → Redirige a /home

### Test 3: CRUD Usuarios

- [ ] Crea usuario nuevo → Aparece en tabla
- [ ] Edita usuario → Cambios se guardan
- [ ] Desactiva usuario → Pasa a pestaña "Inactivos"
- [ ] Reactiva usuario → Vuelve a "Activos"

### Test 4: Validación

- [ ] Intenta crear usuario sin email → Error
- [ ] Intenta crear usuario con email inválido → Error
- [ ] Intenta crear usuario con edad < 18 → Error
- [ ] Intenta crear usuario con mismo documento → Opción de reactivar

---

## 🛠️ Tecnologías Usadas

| Tecnología          | Para qué                |
| ------------------- | ----------------------- |
| React 18            | Framework frontend      |
| Vite                | Build tool y dev server |
| Material-UI v5      | Componentes UI          |
| react-router-dom v6 | Enrutamiento            |
| localStorage        | Persistencia de sesión  |
| json-server         | Mock backend            |

---

## 💡 Conceptos Clave

### Soft Delete

Los registros NO se eliminan físicamente. Solo se marca `estado: false`.

- Ventaja: Se pueden recuperar datos
- Interfaz: Pestaña "Inactivos" para ver y reactivar

### RBAC (Role Based Access Control)

Control de acceso basado en roles:

1. Cada usuario tiene un rol
2. Cada rol tiene un array de permisos
3. Las rutas verifican permisos antes de mostrar contenido
4. Los menús se muestran solo si el usuario tiene permiso

### Context API

Sistema de estado global sin Redux:

- `AuthContext` guarda el usuario autenticado
- `AuthProvider` lo proporciona a toda la app
- `useAuth` hook permite usarlo en cualquier componente

---

## 📞 Dudas Frecuentes

**P: ¿Dónde se guardan las contraseñas?**
R: En `db.json` (solo para desarrollo). En producción usar hash + base de datos segura.

**P: ¿Cómo agrego un nuevo permiso?**
R: 1) Agrega a `PERMISOS` en `enums.js` 2) Asigna a roles en `db.json`

**P: ¿Por qué se pierden datos al recargar?**
R: Los datos en memoria se limpian. La sesión se recupera de `localStorage`.

**P: ¿Cómo cambio el puerto de json-server?**
R: En `package.json`: `json-server --watch db.json --port 5000`

---

**Estado:** ✅ Sistema funcional y listo para usar  
**Última actualización:** 20/11/2025
