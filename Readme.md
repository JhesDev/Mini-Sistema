# Mini Sistema - Gestión de Trámites

Guía rápida para correr el proyecto **con Docker** o **sin Docker**.

## Requisitos

- Node.js 20.19.x
- npm 10.x
- MySQL 5.7+ o MariaDB 10.4+
- Docker + Docker Compose (opcional)

## Estructura

- `backend/` API (Node + Express + Sequelize)
- `frontend/` Web (React + Vite)
- `database/schema.sql` esquema + seed

---

## Opción 1: Ejecutar sin Docker

### 1) Base de datos

Desde la raíz:

```bash
mysql -u root -p < database/schema.sql
```

### 2) Variables de entorno

Backend:

```bash
cd backend
cp .env.example .env
```

Frontend:

```bash
cd ../frontend
cp .env.example .env
```

> En PowerShell: `Copy-Item .env.example .env`

Variables clave:
- Backend: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `PORT`
- Frontend: `VITE_API_URL` (ej: `http://localhost:3000/api`)

### 3) Compilar y correr backend

```bash
cd backend
npm install
npm run build
npm run dev
```

Backend por defecto: `http://localhost:3000`  
Health: `GET http://localhost:3000/api/health`

### 4) Compilar y correr frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

Frontend por defecto: `http://localhost:5173`

---

## Opción 2: Ejecutar con Docker

Desde la raíz:

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

Reiniciar con limpieza de volumen BD:

```bash
docker compose down -v
```

---

## Endpoints principales

- `GET /api/health`
- `GET /api/clientes`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `GET /api/tramites`
- `GET /api/tramites/:id`
- `POST /api/tramites`
- `PATCH /api/tramites/:id`
- `PATCH /api/tramites/:id/estado`
- `DELETE /api/tramites/:id`
- `GET /api/tramites/:tramiteId/seguimientos`

Prueba rápida:

```bash
curl http://localhost:3000/api/health
```

---

## Notas

- La creación de trámite usa transacción (cliente + trámite + primer seguimiento).
- Los cambios de estado validan transiciones y registran seguimiento.
- No incluir en git: `node_modules`, `.env`, credenciales reales.
