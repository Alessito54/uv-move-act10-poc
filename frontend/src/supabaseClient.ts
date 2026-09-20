import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Configuración de Supabase faltante en variables de entorno (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
