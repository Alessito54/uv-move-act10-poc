# Documento de Revisión: Implementación Actividad 10

## 1. ESTADO GENERAL
- **Implementado**: Backend modular, frontend en React, scripts de base de datos IBM Db2 (incluyendo `004_add_check_constraints.sql`), autenticación de Supabase sin fallbacks.
- **Compilado**: Sí (`npm run build` ejecutado sin errores tanto en backend como frontend).
- **Probado**: Parcialmente. Los flujos de autenticación y lógica interna compilan y son estructuralmente correctos.
- **Pendiente**: Prueba contra Db2 real. No se ha podido probar el flujo localmente debido a la falta de credenciales/instancia de Db2 proporcionada en este entorno (error al conectar con credenciales inválidas).

## 2. ARQUITECTURA
- **Estructura**: Monolito modular. No hay microservicios.
- **Flujo**: Frontend Vite React -> Backend Node/Express (Monolito) -> IBM Db2.

## 3. MÓDULO VEHÍCULOS
- Implementa `VehiculoServicePort`.
- Consultas a Db2 centralizadas.
- Expone información general de los vehículos sin que el módulo de reservaciones consulte directamente la tabla `VEHICULO`.

## 4. MÓDULO RESERVACIONES
- Inyecta y utiliza `VehiculoServicePort` para consultar disponibilidad, información y política del vehículo.
- Coordina la transacción para evitar traslapes al momento de crear reservas.

## 5. CONTRATO
- `VehiculoServicePort` ahora cuenta con la función `obtenerVehiculo(vehiculoId)` garantizando separación de responsabilidades y evitando que Reservaciones haga consultas a tablas de Vehículos.

## 6. IBM DB2
- Única base de datos para la lógica de negocio.
- Transacciones soportadas vía callback custom `executeTransactionWithLogic`.
- Añadidos CHECK constraints (`TARIFA_HORA >= 0`, `TIEMPO_MAX_MIN > 0`, `INICIO < FIN`) a través de scripts de evolución (004).

## 7. SUPABASE AUTH
- Middleware valida JWT.
- Se ha eliminado el fallback `TEST_USER_ID`. Si no hay token, retorna 401.

## 8. RN01
- Se obtiene la disponibilidad del vehículo mediante `VehiculoServicePort`. Si no es "DISPONIBLE", retorna 409 dentro de la transacción de reserva.

## 9. RN02 (Traslapes)
- Las validaciones de traslape y la inserción se realizan de manera contigua dentro de una **transacción** (`executeTransactionWithLogic`).
- Db2 usa aislamiento/RR (`SERIALIZABLE`) a través de un `SET CURRENT ISOLATION TO RR` antes del bloque, protegiendo ante concurrencia y validando superposición en el mismo commit.

## 10. RN03 (Políticas)
- La tarifa y el tiempo máximo por cada tipo de vehículo se verifican consultando Db2 (`POLITICA_VEHICULO`) usando la interfaz correspondiente.

## 11. RN04 (Agnóstico de tipos)
- La lógica en `ReservacionService` se basa únicamente en la política extraída de los datos. No existen sentencias `if(tipo === 'bicicleta')`.

## 12. ESCENARIO EXITOSO
- [x] Implementado
- [x] Compilado
- [ ] Probado con Db2 real (El código es seguro, pero no hay entorno Db2 para corroborar).

## 13. ESCENARIO RECHAZADO (RN02 - Traslape)
- [x] Implementado (Levantará un error HTTP 409 dentro de la transacción).
- [x] Compilado
- [ ] Probado con Db2 real (Imposible sin BD local).

## 14. PRUEBAS
- Debido a la falta de credenciales de la instancia de Db2 proporcionada localmente (arroja SQL30082N USERNAME AND/OR PASSWORD INVALID), las validaciones a DB fallan en la conexión. Solo se compilaron ambos proyectos y se validó el código.

## 15. PROBLEMAS ENCONTRADOS
- La conexión predeterminada a DB2 requiere la contraseña y no se provee.
- Las promesas por defecto de `ibm_db` limitan ejecutar lógica compleja en medio de la transacción nativa del paquete, se requirió crear un wrapper (`executeTransactionWithLogic`).

## 16. DECISIONES TÉCNICAS
- Se implementó un Wrapper de Transacción en `Db2Connection` que permite ejecutar sentencias consecutivas comprobando `throw/catch` antes de hacer el `commitTransaction`.
- Se configuró el nivel de aislamiento `RR` usando un `query` inicial a la sesión de Db2 antes de empezar el `beginTransaction`.

## 17. CAMBIOS RESPECTO A LA ACTIVIDAD 9
- Consolidación del contrato (se eliminaron selectivos de Vehículo en Reservaciones).
- `ReservacionService` ahora efectúa transacciones lógicas y seguras ante concurrencia.
- Archivos `.gitignore` configurados, código depurado de repositorios remotos.
- Seguridad en Autenticación strictamente adherida a Supabase JWT.

## 18. TRAZABILIDAD

| Requisito/Regla | Módulo | Caso de uso | Archivo/clase | Db2 | Evidencia |
|---|---|---|---|---|---|
| RN01 (Disp) | Reservaciones/Vehículos | Crear Reserva | `ReservacionService.ts` / `VehiculoService.ts` | Si | Valida estado 'DISPONIBLE' en TX |
| RN02 (Traslape)| Reservaciones | Crear Reserva | `ReservacionService.ts` | Si | Transacción `executeTransactionWithLogic`, aislamiento RR y verificación COUNT de traslapes en tabla `RESERVACION`. Retorna HTTP 409 |
| RN03 (Políticas)| Reservaciones | Crear Reserva | `VehiculoServicePort.ts` | Si | Consulta a tabla `POLITICA_VEHICULO` obteniendo tarifas |
| RN04 (Abierto) | Reservaciones | Crear Reserva | `ReservacionService.ts` | Si | `obtenerPoliticaAplicable` devuelve dinámicamente las restricciones sin ifs |
| Monolito Modular| Arquitectura | Todo | `VehiculoServicePort.ts` | No | No hay red, se inyecta la instancia y se consulta como puerto |

## 19. INSTRUCCIONES DE EJECUCIÓN

1. Base de Datos (Db2 vía Docker):
Asegurar que la instancia `db2inst1` en `localhost:50000` con DB `UVMOVE` está corriendo. Exportar la variable de entorno de conexión.
`export DB2_CONNECTION_STRING="DATABASE=UVMOVE;HOSTNAME=localhost;UID=db2inst1;PWD=YOUR_PASS;PORT=50000;PROTOCOL=TCPIP"`

2. Backend:
```bash
cd backend
npm install
npm run dev
# (o npm run build && npm start)
```

3. Frontend:
```bash
cd frontend
npm install
npm run build
npm run dev
```
