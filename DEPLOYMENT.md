# Guía de Despliegue - Sistema de Gestión de Usuarios

## Pre-requisitos

### Software necesario

- Node.js (v16 o superior)
- PostgreSQL 16
- WSL (Windows Subsystem for Linux) - si estás en Windows

### Verificar instalación de PostgreSQL en WSL

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Si no está corriendo, iniciarlo
sudo service postgresql start
```

## Configuración del Backend

### 1. Navegar a la carpeta del backend

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya debe estar configurado con:

```env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=usuarios_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambialo-en-produccion
JWT_EXPIRE=7d
```

**Importante**: Si cambiaste la contraseña de PostgreSQL, actualiza `DB_PASSWORD`.

### 4. Crear la base de datos (solo la primera vez)

```bash
# Conectarse a PostgreSQL
sudo -u postgres psql

# Dentro de psql, ejecutar:
CREATE DATABASE usuarios_db;
\q
```

### 5. Inicializar la base de datos con Sequelize

```bash
# Esto creará todas las tablas automáticamente
node src/server.js
```

Deberías ver mensajes indicando que las tablas fueron sincronizadas.

**Detén el servidor** con `Ctrl+C` una vez que veas la confirmación.

### 6. Poblar la base de datos con datos iniciales

```bash
node src/utils/seed.js
```

Verás mensajes confirmando que se crearon:

- 2 roles (Super Admin y Admin)
- 3 tipos de documento (CC, TI, CE)
- 2 usuarios de prueba

### 7. Iniciar el servidor backend

```bash
node src/server.js
```

**Importante**: El servidor puede tardar **10-15 segundos** en iniciar debido a la inicialización de Sequelize. Espera a ver el mensaje:

```
✅ Servidor corriendo en http://0.0.0.0:3001
✅ Base de datos conectada exitosamente
```

**Mantén este terminal abierto** con el servidor corriendo.

## Configuración del Frontend

### 1. Abrir una nueva terminal WSL

### 2. Navegar a la raíz del proyecto

```bash
cd /mnt/c/Users/yonny/OneDrive\ -\ unicauca.edu.co/Electiva\ Web/MP1/microproyecto-usuarios
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Deberías ver algo como:

```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Acceder a la aplicación

### 1. Abrir el navegador

Ve a: `http://localhost:5173`

### 2. Credenciales de prueba

#### Super Admin (todos los permisos)

- **Email**: carlos.garcia@example.com
- **Contraseña**: admin123

#### Admin (permisos limitados)

- **Email**: pedro.perez@example.com
- **Contraseña**: pass123

## Verificar que todo funciona

### Checklist de funcionalidades:

1. **Login**

   - ✅ Iniciar sesión con credenciales válidas
   - ✅ Ver mensaje de error con credenciales inválidas

2. **Gestión de Usuarios** (como Super Admin)

   - ✅ Ver lista de usuarios activos
   - ✅ Crear nuevo usuario
   - ✅ Editar usuario existente
   - ✅ Marcar usuario como inactivo
   - ✅ Ver pestaña de usuarios inactivos
   - ✅ Reactivar usuario inactivo
   - ✅ Paginación de usuarios (si hay más de 10)

3. **Gestión de Roles**

   - ✅ Ver lista de roles
   - ✅ Crear nuevo rol con permisos
   - ✅ Editar rol existente
   - ✅ Marcar rol como inactivo
   - ✅ Reactivar rol inactivo

4. **Gestión de Tipos de Documento**

   - ✅ Ver lista de tipos de documento
   - ✅ Crear nuevo tipo
   - ✅ Editar tipo existente
   - ✅ Marcar tipo como inactivo
   - ✅ Reactivar tipo inactivo

5. **Auditoría**
   - ✅ Todas las operaciones CRUD se registran en `audit_logs`

## Solución de Problemas

### El backend no inicia

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Reiniciar PostgreSQL si es necesario
sudo service postgresql restart

# Verificar conexión a la base de datos
sudo -u postgres psql -d usuarios_db -c "SELECT 1;"
```

### Error "EADDRINUSE" (puerto en uso)

```bash
# Encontrar proceso usando el puerto 3001
lsof -i :3001

# Matar el proceso (reemplaza <PID> con el número que aparece)
kill -9 <PID>
```

### El frontend no puede conectarse al backend

1. Verifica que el backend esté corriendo en `http://localhost:3001`
2. Verifica que no haya errores CORS en la consola del navegador
3. Verifica que tengas un token válido en localStorage (o recién iniciaste sesión)

### Error de autenticación

```bash
# Limpiar localStorage del navegador
# En la consola del navegador:
localStorage.clear()
# Luego recargar la página
```

### Ver logs de auditoría en la base de datos

```bash
sudo -u postgres psql -d usuarios_db

# Ver últimas acciones
SELECT * FROM audit_logs ORDER BY "createdAt" DESC LIMIT 10;

# Salir
\q
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

### Usuarios

- `GET /api/usuarios` - Listar usuarios (con paginación)
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar (inactivar) usuario

### Roles

- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar (inactivar) rol

### Tipos de Documento

- `GET /api/document-types` - Listar tipos
- `POST /api/document-types` - Crear tipo
- `PUT /api/document-types/:id` - Actualizar tipo
- `DELETE /api/document-types/:id` - Eliminar (inactivar) tipo

### Auditoría

- `GET /api/audit` - Ver registros de auditoría

## Notas Importantes

1. **Tiempo de inicio**: El backend puede tardar 10-15 segundos en iniciar completamente.

2. **WSL Networking**: El backend escucha en `0.0.0.0:3001` para ser accesible desde Windows.

3. **JWT Tokens**: Los tokens expiran en 7 días. Después de ese tiempo, deberás volver a iniciar sesión.

4. **Passwords**: Las contraseñas se hashean con bcrypt antes de almacenarse.

5. **UUIDs**: Todos los IDs son UUIDs (v4), no enteros secuenciales.

6. **Estado de registros**: Los registros no se eliminan físicamente, solo se marcan con `estado: false`.

## Estructura de la Base de Datos

```
usuarios_db
├── usuarios
│   ├── id (UUID, PK)
│   ├── nombre
│   ├── email (unique)
│   ├── password (hashed)
│   ├── roleId (FK → roles)
│   ├── documentTypeId (FK → document_types)
│   ├── numeroDocumento
│   ├── estado (boolean)
│   └── timestamps
│
├── roles
│   ├── id (UUID, PK)
│   ├── nombre (unique)
│   ├── descripcion
│   ├── permisos (JSON array)
│   ├── estado (boolean)
│   └── timestamps
│
├── document_types
│   ├── id (UUID, PK)
│   ├── codigo (unique)
│   ├── nombre
│   ├── estado (boolean)
│   ├── tipoAccion
│   ├── usuarioAccion
│   ├── fechaHoraEvento
│   └── timestamps
│
└── audit_logs
    ├── id (UUID, PK)
    ├── accion (CREATE, UPDATE, DELETE, etc.)
    ├── entidad (Usuario, Role, DocumentType)
    ├── entidadId
    ├── detalles (JSON)
    └── timestamps
```

## Comandos Útiles

```bash
# Ver todas las tablas
sudo -u postgres psql -d usuarios_db -c "\dt"

# Ver todos los usuarios
sudo -u postgres psql -d usuarios_db -c "SELECT id, nombre, email, estado FROM usuarios;"

# Ver todos los roles
sudo -u postgres psql -d usuarios_db -c "SELECT id, nombre, permisos FROM roles;"

# Contar registros en audit_logs
sudo -u postgres psql -d usuarios_db -c "SELECT COUNT(*) FROM audit_logs;"

# Reiniciar la base de datos (CUIDADO: borra todo)
sudo -u postgres psql -c "DROP DATABASE usuarios_db;"
sudo -u postgres psql -c "CREATE DATABASE usuarios_db;"
# Luego ejecutar seed.js nuevamente
```
