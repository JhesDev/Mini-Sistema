import { Router } from 'express';
import { tramiteController } from './tramite.controller';
import { seguimientoRouter } from './seguimiento';

const router = Router();

// GET    /api/tramites                   — listar trámites
// POST   /api/tramites                   — crear trámite
// GET    /api/tramites/:id               — obtener trámite + cliente
// PATCH  /api/tramites/:id/estado        — cambiar estado (máquina de estados)

router.get('/', tramiteController.list);
router.post('/', tramiteController.create);
router.get('/:id', tramiteController.getById);
router.patch('/:id', tramiteController.update);
router.delete('/:id', tramiteController.delete);
router.patch('/:id/estado', tramiteController.cambiarEstado);

// Subdominio seguimientos
// GET /api/tramites/:tramiteId/seguimientos
router.use('/:tramiteId/seguimientos', seguimientoRouter);

export default router;
