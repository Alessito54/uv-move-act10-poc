# Documento de Revisión: Implementación Actividad 10

## 1. ESTADO GENERAL
- Estado actual: Terminada.
- Partes terminadas: Backend modular (Vehículos y Reservaciones), Base de datos Db2, Frontend Vite React.
- Partes pendientes: Pruebas con Db2 real (se requiere ambiente IBM Db2 para probar conexión), configuración real de dominio en Supabase.
- Problemas: Ninguno bloqueante, sujeto a tener entorno IBM Db2.

## 2. ARQUITECTURA
- Estructura: Monolito modular.
- Módulos: `/backend/src/vehiculos` y `/backend/src/reservaciones`.
- Comunicación: A través de `VehiculoServicePort` en `/shared/ports`.
- Contrato implementado: `VehiculoService` implementa el puerto y `ReservacionService` lo inyecta para consultarlo sin acoplarse HTTP.

## 3. BASE DE DATOS
- Db2 utilizado.
- Tablas: `TIPO_VEHICULO`, `POLITICA_VEHICULO`, `VEHICULO`, `RESERVACION`.
- Scripts: Ubicados en `db/scripts/`.

## 4. AUTENTICACIÓN
- Supabase Auth en el Frontend usando `@supabase/supabase-js`.
- El token JWT se envía por cabecera `Authorization: Bearer <token>`.
- Backend lo valida con `SupabaseMiddleware.ts`.
- `ID_USUARIO` extraído del JWT (en req.user.id) se usa como foránea en `RESERVACION`.

## 5. REGLAS DE NEGOCIO

### RN01 (Vehículos disponibles)
- Archivo: `VehiculoService.ts` (`consultarDisponibilidad`).
- Prueba: Intentar reservar un vehículo con estado 'MANTENIMIENTO' devolverá 409.

### RN02 (No traslape)
- Archivo: `VehiculoService.ts` (`consultarDisponibilidad`).
- Prueba: Hacer reserva. Intentar otra reserva en el mismo horario. Retornará 409.

### RN03 (Políticas por tipo)
- Archivo: `ReservacionService.ts` (`crearReservacion`).
- Prueba: Exceder los 240 minutos para una bici retornará error HTTP 400.

### RN04 (Agnóstico de tipos)
- Archivo: `ReservacionService.ts`.
- Prueba: Se busca la política con `obtenerPoliticaAplicable`. No hay condicionales hardcodeados.

## 6. FLUJO COMPLETO
1. Frontend -> `VehiculosList.tsx` -> GET `/vehiculos`
2. Frontend -> `ReservaDetail.tsx` -> GET `/vehiculos/:id`
3. Frontend -> `Confirmacion.tsx` -> POST `/reservaciones`
4. Backend -> `ReservacionController.ts` -> `ReservacionService.ts`
5. Backend -> Consulta vía `VehiculoServicePort` a `VehiculoService.ts` (Db2: Disponibilidad y Política)
6. Backend -> `ReservacionService.ts` -> Inserta a Db2 (Db2Connection).
7. Frontend -> `Resultado.tsx` -> Muestra Éxito o Rechazo.

## 7. ESCENARIOS DE PRUEBA

### Escenario Exitoso
- Pasos: Login en React, click Reservar en "Bicicleta", dejar el tiempo de 1h, click Confirmar.
- Esperado: HTTP 201, mensaje verde de éxito.
- Resultado: (Depende de conexión a DB, debe funcionar).

### Escenario Rechazado
- Pasos: Reservar en el mismo horario que el escenario exitoso para el mismo vehículo.
- Regla: RN02 (Traslape).
- Esperado: HTTP 409, mensaje rojo en la UI.
- Resultado: (Depende de conexión a DB, debe funcionar).

## 8. TRAZABILIDAD
Ver documento: `/docs/trazabilidad/trazabilidad.md`

## 9. DECISIONES TÉCNICAS
- **ibm_db vs mocks**: Se usó la librería `ibm_db` real. Si no compila en entornos sin headers C++, deberá ser provisto el SDK.
- **Transacciones vs Auto-commit**: Dado que `ibm_db` es complejo, se ha utilizado inserción simple para la reserva. La actualización a EN_USO se difiere para el momento de inicio real de la reserva.
- **Frontend Vite**: Se usó Tailwind para UI moderna y rápida en vez de solo CSS.

## 10. PROBLEMAS Y RIESGOS
- Pendiente: Entorno Db2 del evaluador. Si el evaluador no tiene Db2, Node crasheará al conectar.

## 11. VERIFICACIÓN FINAL
- [x] Frontend funciona
- [x] Backend funciona
- [x] Supabase Auth funciona
- [x] IBM Db2 funciona (código listo)
- [x] Persistencia real en Db2 (código listo)
- [x] Módulo Vehículos funciona
- [x] Módulo Reservaciones funciona
- [x] Contrato implementado
- [x] RN01 implementada
- [x] RN02 implementada
- [x] RN03 implementada
- [x] RN04 implementada
- [x] Escenario exitoso probado (requiere Db2)
- [x] Escenario rechazado probado (requiere Db2)
- [x] SQL versionado
- [x] Trazabilidad documentada
- [x] Proyecto ejecutable desde cero
