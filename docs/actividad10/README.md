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
1. `001_create_tables.sql`: Creación de tablas de tipos de vehículo, políticas, vehículos y reservaciones.
2. `002_constraints.sql`: Definición de Primary Keys, Foreign Keys y Unique Constraints.
3. `003_seed_data.sql`: Datos semilla base (tipos de vehículos, políticas y vehículos iniciales).
4. `004_add_check_constraints.sql`: Evolución del modelo que incorpora restricciones de dominio `CHECK` (`TARIFA_HORA >= 0`, `TIEMPO_MAX_MIN > 0`, `INICIO < FIN`).
5. `005_seed_reservation_test.sql`: Evolución del modelo que inserta una reservación inicial activa para el vehículo `V_BICI_001` (`BIC-001`) en un periodo futuro (`2026-10-01 10:00:00` a `2026-10-01 12:00:00`), diseñada específicamente para probar y demostrar el rechazo por traslape (RN02).

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
1. **Escenario Exitoso:** Inicia sesión con Supabase Auth, selecciona un vehículo disponible (por ejemplo, `V_BICI_002` o `V_SCOOTER_001`), ingresa un rango de tiempo válido dentro de la política de uso y confirma. Se generará la reservación en Db2 con código de confirmación.
2. **Escenario Rechazado (RN02 - Traslape con Reservación Semilla):** 
   - Gracias al script `005_seed_reservation_test.sql`, el vehículo `V_BICI_001` cuenta con una reservación `ACTIVA` para el `2026-10-01` de `10:00` a `12:00`.
   - Intenta reservar `V_BICI_001` para un horario que se traslape (por ejemplo, `2026-10-01 11:00:00` a `2026-10-01 13:00:00`).
   - La transacción con nivel de aislamiento Serializable/RR en Db2 detectará la superposición y rechazará la solicitud devolviendo código `HTTP 409` (Conflicto / Traslape).
