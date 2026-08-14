import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from './auth.middleware';

const router = Router();

// POST /api/auth/login — Iniciar sesión (público)
router.post('/login', authController.login);

// GET  /api/auth/me    — Obtener usuario actual en sesión (protegido)
router.get('/me', requireAuth, authController.me);

export default router;
