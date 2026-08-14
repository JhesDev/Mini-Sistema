# Mini Sistema - Gestión de Trámites

Este repositorio contiene un mini sistema con Backend (API REST) y Frontend (React + Vite) pensado para gestionar trámites y clientes.

## Estructura del proyecto

- `backend/`: API REST (Node.js + Express + Sequelize + MySQL).
- `frontend/`: aplicación React + Vite.
- `database/schema.sql`: esquema SQL oficial con creación de la BD y seeds.

## 1) Requisitos previos

- Node.js 20.19.x
- npm 10.x
- MySQL 5.7+ o MariaDB 10.4+
- Opcional: Docker & Docker Compose (ya incluido soporte en este repo)

Nota: en Windows usar las herramientas de línea de comandos que prefiera (PowerShell o WSL). Las instrucciones usan comandos POSIX cuando no se indica lo contrario.

## 2) Base de datos: crear y cargar seed

1. Crear la base de datos y estructuras ejecutando el script SQL incluido:

```bash
# desde la raíz del proyecto
mysql -u root -p < database/schema.sql
```

2. El script `database/schema.sql` crea la base de datos, tablas y carga datos de ejemplo (seed). También se aplica automáticamente al iniciar el servicio `db` cuando se usa Docker Compose por primera vez.

Archivo SQL:
- [database/schema.sql](C:/Users/USER/OneDrive/Documentos/Proyectos/Jhon/Mini-Sistema/database/schema.sql)


## 3) Variables de entorno

Copiar los ejemplos de cada carpeta (backend y frontend) y ajustar credenciales/URLs:

- Backend (desde `backend/`):

```bash
cp .env.example .env   # Unix/macOS
# o en PowerShell (Windows)
Copy-Item .env.example .env
```

Variables principales en `backend/.env.example`:
- NODE_ENV: entorno (development/production)
- PORT: puerto donde corre el backend (por defecto 3000)
- DB_HOST: host de la base de datos (p. ej. localhost)
- DB_PORT: puerto de la BD (3306)
- DB_NAME: nombre de la BD (gestion_tramites por defecto)
- DB_USER: usuario de la BD (root por defecto en los ejemplos)
- DB_PASS: contraseña de la BD
- CORS_ORIGINS: orígenes permitidos para CORS (ej: http://localhost:5173)
- JWT_SECRET: clave para firmar tokens JWT
- JWT_EXPIRES_IN: tiempo de expiración de tokens (ej: 8h)

- Frontend (desde `frontend/`):

```bash
cp .env.example .env   # Unix/macOS
# o en PowerShell (Windows)
Copy-Item .env.example .env
```

Variables principales en `frontend/.env.example`:
- VITE_API_URL: URL base de la API (incluye /api), por ejemplo `http://localhost:3000/api`

Rutas a ejemplos en el repo:
- [backend/.env.example](C:/Users/USER/OneDrive/Documentos/Proyectos/Jhon/Mini-Sistema/backend/.env.example)
- [frontend/.env.example](C:/Users/USER/OneDrive/Documentos/Proyectos/Jhon/Mini-Sistema/frontend/.env.example)


## 4) Backend: instalación y arranque

Desde la raíz del proyecto:

```bash
cd backend
npm install
npm run dev
```

- El backend escucha por defecto en el puerto configurado en `backend/.env` (por defecto `3000`).
- Endpoint de salud: `http://localhost:3000/api/health`

Si se usa Docker Compose, el backend también se arranca con `docker compose up --build -d`.


## 5) Frontend: instalación y arranque

Desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

- Vite por defecto sirve la app en `http://localhost:5173`.
- Asegúrate de que `VITE_API_URL` en `frontend/.env` apunte al backend (ej: `http://localhost:3000/api`).


## 6) Endpoints principales y cómo probarlos

A continuación una lista breve de endpoints útiles y ejemplos de prueba. Si el backend tiene autenticación, ajusta los ejemplos con el header `Authorization: Bearer <token>` según corresponda.

- Health (comprobar que la API está arriba)
  - GET /api/health
  - Ejemplo: curl http://localhost:3000/api/health

- Clientes (ejemplos comunes)
  - GET /api/clientes            — Listar clientes / búsqueda
  - GET /api/clientes/:id        — Obtener cliente por id
  - POST /api/clientes           — Crear cliente

- Trámites / Recursos principales
  - GET /api/tramites
  - GET /api/tramites/:id
  - POST /api/tramites

Ejemplo usando curl para listar clientes (ajustar URL si corresponde):

```bash
curl -s "${VITE_API_URL%/api}/api/clientes" | jq .
# o
curl http://localhost:3000/api/clientes
```

Si deseas un listado exacto de todos los endpoints expuestos, arrancar el backend y revisar los logs al iniciar (muchas apps imprimen las rutas) o inspeccionar la carpeta `backend/src/routes` / archivos de controllers según la implementación del proyecto.


## 7) Decisiones técnicas y qué quedó fuera (honesto)

Decisiones principales
- Backend: Node.js (v20) + Express + Sequelize para ORM y compatibilidad con MySQL/MariaDB.
- Frontend: React + Vite para desarrollo ágil y recarga rápida.
- DB: MySQL / MariaDB como fuente de datos relacional.
- Docker: se incluye `docker-compose.yml` para facilitar despliegue local con servicios (db, backend, frontend/nginx).

Limitaciones y trabajo pendiente (lo que no está implementado o no llegó a tiempo)
- Tests automatizados: no hay una suite completa de tests unitarios / integración en este repo. Si se estructuraran:
  - Backend: tests unitarios con Jest + supertest para endpoints, fixtures y una base de datos sqlite o una instancia MySQL en memoria para integración.
  - Frontend: tests con React Testing Library y mocks de API (msw).
- CI/CD: no hay pipeline de CI configurado (GitHub Actions / GitLab CI). Recomendado: ejecutar linters, tests y build en PRs.
- Seguridad/producción: configuración de secretos y rotación de claves está básica. Para producción usar un gestor de secretos y variables de entorno en el hosting.
- Validaciones y límites: se pueden mejorar validaciones de entrada, paginación, rate limiting y control de errores más detallado.

Notas sobre decisiones no tomadas por falta de tiempo
- No se incluyeron pruebas automatizadas completas por tiempo; prioridad fue tener API funcional y frontend que consuma la API.
- La paginación y filtros en listados están básicos; si se requiere, estructuraría paginación estándar (limit/offset) y parámetros de búsqueda bien tipados.


## Probar localmente (resumen rápido)

1. Configurar variables de entorno (backend/.env y frontend/.env). Copiar desde los `.env.example`.
2. Crear la base de datos y cargar seed:

```bash
mysql -u root -p < database/schema.sql
```

3. Arrancar backend:

```bash
cd backend
npm install
npm run dev
# backend por defecto: http://localhost:3000
```

4. Arrancar frontend:

```bash
cd frontend
npm install
npm run dev
# frontend por defecto: http://localhost:5173
```


## Docker (alternativa)

Levantar todo con Docker Compose:

```bash
docker compose up --build -d
```

Ver logs:

```bash
docker compose logs -f
```

Detener:

```bash
docker compose down
```


---

Si se desea, puedo:
- Añadir un archivo `CONTRIBUTING.md` con pasos de desarrollo y estilo de commits.
- Estructurar tests iniciales y un pipeline básico de CI.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>