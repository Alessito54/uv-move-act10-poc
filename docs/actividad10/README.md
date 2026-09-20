# Documentación Actividad 10

## Arquitectura Implementada
Se implementó un Monolito Modular con Node.js, Express, React e IBM Db2. Los módulos de Vehículos y Reservaciones se comunican a través de un puerto de servicio interno, respetando el contrato de la Actividad 9.

## Cómo Ejecutar el Proyecto

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env` en `backend/` y `frontend/` y configura tus credenciales.
Para el backend:
`DB2_CONNECTION_STRING`
`SUPABASE_URL`
`SUPABASE_ANON_KEY`

Para el frontend:
`VITE_SUPABASE_URL`
`VITE_SUPABASE_ANON_KEY`
`VITE_API_URL` (por defecto `http://localhost:3000`)

### 2. Base de Datos
Ejecuta los scripts ubicados en `db/scripts/` en tu servidor Db2 en el orden numerado.

### 3. Iniciar Backend
```bash
cd backend
npm install
npm run dev # (Asumiendo que agregaste un script ts-node-dev o ejecutas: npx ts-node src/app.ts)
```

### 4. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev
```

## Pruebas
1. **Escenario Exitoso:** Inicia sesión, selecciona un vehículo, elige un rango válido (ej: la próxima hora) y confirma. Verás la pantalla de éxito con el código generado.
2. **Escenario Rechazado (Traslape):** Intenta reservar el *mismo vehículo* en el mismo horario de la reserva anterior. El sistema lanzará un HTTP 409 y mostrará el error.
