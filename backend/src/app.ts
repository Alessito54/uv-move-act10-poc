import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import vehiculoRoutes from './http/routes/vehiculoRoutes';
import reservacionRoutes from './http/routes/reservacionRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/vehiculos', vehiculoRoutes);
app.use('/reservaciones', reservacionRoutes);

// Manejo de errores global simple
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

export default app;
