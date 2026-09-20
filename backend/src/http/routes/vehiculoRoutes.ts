import { Router } from 'express';
import { VehiculoController } from '../controllers/VehiculoController';
import { authMiddleware } from '../../infrastructure/auth/SupabaseMiddleware';

const router = Router();
const controller = new VehiculoController();

// Rutas protegidas
router.get('/', authMiddleware, controller.listarVehiculos);
router.get('/:id', authMiddleware, controller.obtenerVehiculo);

export default router;
