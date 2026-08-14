import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { clienteRouter } from '@/modules/cliente';
import { tramiteRouter } from '@/modules/tramite';
import { errorMiddleware } from '@/shared/error.middleware';

const app = express();

// ── Middlewares globales ───────────────────────────────────────────────────

const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',');

app.use(
  cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ── Módulos ────────────────────────────────────────────────────────────────

app.use('/api/clientes', clienteRouter);
app.use('/api/tramites', tramiteRouter);

// ── 404 para rutas no registradas ─────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' },
  });
});

// ── Middleware centralizado de errores (debe ir al final) ─────────────────

app.use(errorMiddleware);

export default app;
