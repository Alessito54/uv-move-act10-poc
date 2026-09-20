import { Request, Response, NextFunction } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY (o SUPABASE_PUBLISHABLE_KEY) son requeridas y no están configuradas.');
        }

        supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseClient;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado. Token faltante o inválido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error || !data.user) {
            return res.status(401).json({ error: 'No autorizado. Token inválido o expirado.' });
        }

        // Inyectar el usuario en la request para uso posterior
        (req as any).user = data.user;
        next();
    } catch (err: any) {
        console.error('Error en authMiddleware:', err?.message || err);
        return res.status(500).json({ error: 'Error interno en la autenticación.' });
    }
};
