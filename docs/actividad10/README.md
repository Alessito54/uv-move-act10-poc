# Documentación Actividad 10

## Arquitectura Implementada
Se implementó un Monolito Modular con Node.js, Express, React e IBM Db2. Los módulos de Vehículos y Reservaciones se comunican en memoria a través de un puerto de servicio interno (`VehiculoServicePort`), respetando el contrato de la Actividad 9.

---

## Cómo Configurar y Ejecutar el Proyecto

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` tanto en `backend/` como en `frontend/` y configura tus valores reales:

#### Backend (`backend/.env`):
- `PORT`: Puerto en el que se ejecuta la API Express (ej: `3000`).
- `DB2_CONNECTION_STRING`: Cadena de conexión obligatoria para IBM Db2 (ej: `DATABASE=UVMOVE;HOSTNAME=localhost;UID=db2inst1;PWD=tu_password;PORT=50000;PROTOCOL=TCPIP`).
- `SUPABASE_URL`: URL del proyecto de Supabase Auth (ej: `https://xyzcompany.supabase.co`).
- `SUPABASE_ANON_KEY`: Anon Key de Supabase para validar los tokens JWT.

> **Importante:** No existen valores ficticios ni credenciales hardcodeadas. Si `DB2_CONNECTION_STRING` o las variables de Supabase no están configuradas, el sistema lanzará un error explícito.

#### Frontend (`frontend/.env`):
- `VITE_API_URL`: URL base del backend Express (ej: `http://localhost:3000`).
- `VITE_SUPABASE_URL`: URL del proyecto de Supabase Auth.
- `VITE_SUPABASE_ANON_KEY`: Anon Key de Supabase para la autenticación en el cliente.

---

### 2. Base de Datos (IBM Db2)
Ejecuta los scripts ubicados en `db/scripts/` en tu servidor Db2 en el orden correspondiente:
1. `001_create_schema.sql`
2. `002_seed_data.sql`
3. `003_add_tarifa_hora.sql`
4. `004_add_check_constraints.sql`

---

### 3. Ejecución

Puedes ejecutar ambos módulos desde la raíz del repositorio o dentro de cada carpeta:

#### Opción A: Desde la raíz del repositorio
```bash
# Terminal 1 - Frontend (Vite + React en http://localhost:5173):
npm run dev

# Terminal 2 - Backend (Express API en http://localhost:3000):
npm run backend
```

#### Opción B: Entrando a cada directorio
```bash
# Backend:
cd backend
npm install
npm run dev

# Frontend:
cd frontend
npm install
npm run dev
```

---

## Pruebas de Negocio
1. **Escenario Exitoso:** Inicia sesión con Supabase Auth, selecciona un vehículo disponible, ingresa un rango de tiempo válido dentro de la política de uso y confirma. Se generará la reservación en Db2 con código de confirmación.
2. **Escenario Rechazado (RN02 - Traslape):** Intenta reservar el mismo vehículo en un intervalo que se superponga con una reservación activa existente. La transacción con aislamiento Serializable/RR en Db2 detectará el conflicto y responderá con código HTTP 409 (Conflicto / Traslape).
