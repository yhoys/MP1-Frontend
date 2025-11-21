# Microproyecto - Gestión de Usuarios, Roles y Tipos de Documento

Aplicación React con autenticación, autorización por roles (RBAC) y módulos CRUD para administrar usuarios, roles y tipos de documento usando json-server como backend mock.

## Características
- Autenticación con email/contraseña contra `json-server`.
- Control de acceso por permisos: rutas y navegación dinámicas.
- CRUD completo de usuarios, roles y tipos de documento con soft delete (estado).
- Validaciones centralizadas (email, teléfono, documento, edad mínima).
- Auditoría simple para tipos de documento.

## Stack
- React 18 + Vite
- Material UI (MUI) v5
- React Router v6
- Context API para sesión
- json-server (localhost:3001)

## Instalación
```bash
cd "Electiva Web/MP1/microproyecto-usuarios"
npm install
```

## Scripts
- `npm run dev`: arranca Vite (frontend en http://localhost:5173).
- `npm run server` o `npm run backend`: arranca json-server (backend en http://localhost:3001).
- `npm run build`: build de producción.
- `npm run lint`: ejecuta ESLint.

## Credenciales de prueba
- Super Admin: email `carlos.garcia@example.com` / contraseña `admin123`
- Admin: email `pedro.perez@example.com` / contraseña `pass123`

## Uso rápido
1. En una terminal: `npm run server`
2. En otra: `npm run dev`
3. Abrir http://localhost:5173 y hacer login con las credenciales de prueba.

## Datos de ejemplo (db.json)
- 2 usuarios, 2 roles, 3 tipos de documento (CC, PASS, CE).
- Permisos disponibles:
  - ver/crear/editar/eliminar usuarios
  - ver/crear/editar/eliminar roles
  - ver/crear/editar/eliminar tipos de documento

## Notas
- El soft delete se maneja con el campo `estado` (true/false).
- Los formularios validan campos requeridos, email, teléfono (7–10 dígitos), documento (5–20 alfanumérico) y edad mínima de 18 años.
- El menú solo muestra módulos según los permisos del rol del usuario autenticado.
