import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { authRouter, requireAuth } from '@/modules/auth';
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

// Rutas de autenticación (login es público, /me es protegido internamente)
app.use('/api/auth', authRouter);

// Rutas protegidas que requieren JWT válido
app.use('/api/clientes', requireAuth, clienteRouter);
app.use('/api/tramites', requireAuth, tramiteRouter);

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
