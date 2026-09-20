import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Reemplazar con variables de entorno en producción
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'example_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado. Token faltante o inválido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error || !data.user) {
            return res.status(401).json({ error: 'No autorizado. Token inválido o expirado.' });
        }

        // Inyectar el usuario en la request para uso posterior
        (req as any).user = data.user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Error interno en la autenticación.' });
    }
};
