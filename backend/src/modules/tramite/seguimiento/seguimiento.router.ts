import { Router } from 'express';
import { seguimientoController } from './seguimiento.controller';

const router = Router({ mergeParams: true }); // para acceder a :tramiteId del padre

// GET /api/tramites/:tramiteId/seguimientos
router.get('/', seguimientoController.listByTramite);

export default router;
