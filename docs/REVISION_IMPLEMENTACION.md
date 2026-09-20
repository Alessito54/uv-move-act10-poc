# Documento de Revisión: Implementación Actividad 10

## 1. ESTADO GENERAL
- **Implementado**: Backend modular, frontend en React, scripts de base de datos IBM Db2 (incluyendo `004_add_check_constraints.sql`), autenticación de Supabase sin fallbacks ni secretos ficticios, DTO tipado `VehiculoDTO` en el puerto de comunicación entre módulos.
- **Compilado**: Sí (`npm run build` ejecutado exitosamente sin errores tanto en backend como en frontend).
- **Probado**: Parcialmente (arquitectura, tipos, interfaces, scripts SQL y compilación validados).
- **PENDIENTE (MUY IMPORTANTE)**: Las pruebas de extremo a extremo con IBM Db2 real **SIGUEN PENDIENTES** hasta que se ejecuten contra un servidor/contenedor IBM Db2 activo con credenciales reales configuradas. **NO están marcadas como realizadas.**

---

## 2. ARQUITECTURA
- **Estructura**: Monolito modular. No hay microservicios ni llamadas HTTP entre módulos.
- **Flujo**: Frontend Vite React -> Backend Node/Express (Monolito) -> IBM Db2 (Única base de datos de negocio).

---

## 3. MÓDULO VEHÍCULOS
- Implementa `VehiculoServicePort`.
- Consultas a Db2 centralizadas.
- Expone información tipada de los vehículos (`VehiculoDTO`) sin que el módulo de reservaciones consulte directamente la tabla `VEHICULO`.

---

## 4. MÓDULO RESERVACIONES
- Inyecta y utiliza `VehiculoServicePort` para consultar disponibilidad, información (`VehiculoDTO`) y política del vehículo.
- Coordina la transacción para evitar traslapes al momento de crear reservas.

---

## 5. CONTRATO
- `VehiculoServicePort` define `obtenerVehiculo(vehiculoId): Promise<VehiculoDTO | null>`, eliminando `Promise<any>`.
- Garantiza la separación estricta de responsabilidades entre módulos respetando el contrato de la Actividad 9.

---

## 6. IBM DB2
- Única base de datos para la lógica de negocio.
- Transacciones soportadas vía callback custom `executeTransactionWithLogic` con nivel de aislamiento RR (`SET CURRENT ISOLATION TO RR`).
- Se eliminó completamente cualquier cadena de conexión fallback ("testdb/password"). Si `DB2_CONNECTION_STRING` no está definida, lanza un error claro.
- Añadidos CHECK constraints (`TARIFA_HORA >= 0`, `TIEMPO_MAX_MIN > 0`, `INICIO < FIN`) a través de scripts de evolución (`004_add_check_constraints.sql`).

---

## 7. SUPABASE AUTH
- Middleware valida JWT sin fallbacks (`authMiddleware`).
- Se eliminaron por completo URLs o llaves ficticias (`example.supabase.co`, `example_key`).
- Carga de `dotenv/config` garantizada antes de inicializar clientes de autenticación.
- Si no se provee token o si faltan las variables de entorno de Supabase, se rechaza la petición apropiadamente.

---

## 8. REGLAS DE NEGOCIO (RN)
- **RN01 (Disponibilidad):** Se obtiene la disponibilidad del vehículo mediante `VehiculoServicePort`. Si no está en estado "DISPONIBLE", retorna HTTP 409 dentro de la transacción de reserva.
- **RN02 (Traslapes):** Las validaciones de traslape y la inserción se realizan de manera contigua dentro de una transacción en Db2 con aislamiento Serializable/RR (`executeTransactionWithLogic`).
- **RN03 (Políticas):** Tarifa por hora y tiempo máximo configurables en Db2 (`POLITICA_VEHICULO`), consultadas dinámicamente vía el puerto.
- **RN04 (Agnóstico de tipos):** Lógica desacoplada de nombres de tipo; no existen condicionales específicos de tipo de vehículo en el código.

---

## 9. MATRIZ DE ESTADO DE ESCENARIOS

| Escenario | Implementación | Compilación | Prueba con Db2 Real |
|---|---|---|---|
| Escenario Exitoso (Reserva Válida) | ✅ Completado | ✅ Verificado (`tsc`) | ⏳ **PENDIENTE** (Requiere conexión a instancia Db2 activa con credenciales) |
| Escenario Rechazado (RN02 - Traslape) | ✅ Completado | ✅ Verificado (`tsc`) | ⏳ **PENDIENTE** (Requiere conexión a instancia Db2 activa con credenciales) |
| Validación de Políticas (RN03 / RN04) | ✅ Completado | ✅ Verificado (`tsc`) | ⏳ **PENDIENTE** (Requiere conexión a instancia Db2 activa con credenciales) |

---

## 10. TRAZABILIDAD

| Requisito/Regla | Módulo | Caso de uso | Archivo / Clase | Persistencia | Detalle Técnico |
|---|---|---|---|---|---|
| RN01 (Disponibilidad) | Reservaciones / Vehículos | Crear Reserva | `ReservacionService.ts` / `VehiculoService.ts` | Db2 | Valida estado `DISPONIBLE` dentro de la transacción |
| RN02 (Traslape) | Reservaciones | Crear Reserva | `ReservacionService.ts` | Db2 | Transacción `executeTransactionWithLogic` con `SET CURRENT ISOLATION TO RR` y verificación `COUNT` de traslapes en tabla `RESERVACION`. Retorna HTTP 409 |
| RN03 (Políticas) | Reservaciones | Crear Reserva | `VehiculoServicePort.ts` | Db2 | Consulta dinámica a tabla `POLITICA_VEHICULO` |
| RN04 (Agnóstico) | Reservaciones | Crear Reserva | `ReservacionService.ts` | Db2 | `obtenerPoliticaAplicable` devuelve dinámicamente las restricciones sin ifs de negocio |
| Monolito Modular | Arquitectura | Todo | `VehiculoServicePort.ts` | N/A | Inyección de dependencias en memoria, sin HTTP interno |
| Tipado de Contrato | Shared Ports | Colaboración | `VehiculoDTO.ts` | N/A | `obtenerVehiculo` retorna `Promise<VehiculoDTO \| null>` |

---

## 11. INSTRUCCIONES DE CONFIGURACIÓN Y EJECUCIÓN

1. **Variables de entorno:**
   - Crear `backend/.env` a partir de `backend/.env.example` con `DB2_CONNECTION_STRING`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
   - Crear `frontend/.env` a partir de `frontend/.env.example` con `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

2. **Base de Datos (IBM Db2):**
   - Ejecutar los scripts `db/scripts/001_create_schema.sql` a `004_add_check_constraints.sql`.

3. **Ejecución:**
   - Terminal 1: `npm run dev` (Frontend en `http://localhost:5173`)
   - Terminal 2: `npm run backend` (Backend en `http://localhost:3000`)
