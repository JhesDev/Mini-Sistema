# Mini Sistema - Gestion de Tramites

## Estructura del proyecto

- `backend/`: API REST (Node.js + Express + Sequelize + MySQL).
- `frontend/`: aplicacion React + Vite.
- `database/schema.sql`: esquema SQL oficial con creacion de BD, tablas y seed.

## Docker

### Archivos agregados

- `docker-compose.yml`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `frontend/.dockerignore`

### Levantar el proyecto completo

```bash
docker compose up --build -d
```

### Ver logs

```bash
docker compose logs -f
```

### Detener contenedores

```bash
docker compose down
```

### Detener y eliminar volumen de datos (reinicio total de BD)

```bash
docker compose down -v
```

## Endpoints y URLs

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:3000/api/health`
- MySQL: `localhost:3306` (root/secret)

## Base de datos obligatoria

El archivo `database/schema.sql` esta pensado para ejecutarse directamente en una instancia limpia:

```bash
mysql -u root -p < database/schema.sql
```

Tambien se ejecuta automaticamente al iniciar el contenedor `db` por primera vez.