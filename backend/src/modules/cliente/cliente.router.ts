import { Router } from 'express';
import { clienteController } from './cliente.controller';

const router = Router();

// GET    /api/clientes         — listar con filtros + paginación
// POST   /api/clientes         — crear cliente
// GET    /api/clientes/:id     — obtener por ID
// PUT    /api/clientes/:id     — actualizar cliente
// DELETE /api/clientes/:id     — eliminar cliente

router.get('/', clienteController.list);
router.post('/', clienteController.create);
router.get('/:id', clienteController.getById);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

export default router;
