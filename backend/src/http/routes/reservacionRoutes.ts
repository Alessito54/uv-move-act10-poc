import { Router } from 'express';
import { ReservacionController } from '../controllers/ReservacionController';
import { authMiddleware } from '../../infrastructure/auth/SupabaseMiddleware';

const router = Router();
const controller = new ReservacionController();

// Rutas protegidas
router.post('/', authMiddleware, controller.crearReservacion);
router.get('/:codigo', authMiddleware, controller.obtenerReservacion);

export default router;
