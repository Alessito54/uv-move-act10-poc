# Trazabilidad

| Requisito/Regla | Módulo | Caso de uso | Archivo/clase | Db2 | Evidencia |
|---|---|---|---|---|---|
| **RN01**: Solo vehículos disponibles pueden ser reservados. | Reservaciones / Vehículos | Crear Reservación | `ReservacionService.ts`, `VehiculoService.ts` | Consulta a `VEHICULO` | HTTP 409 si el estado es distinto a DISPONIBLE. |
| **RN02**: No traslape de reservaciones. | Reservaciones / Vehículos | Crear Reservación | `VehiculoService.ts` | Consulta `COUNT(*)` en `RESERVACION` | HTTP 409 si la fecha interseca con reservaciones ACTIVAS. |
| **RN03**: Políticas variables por tipo (tarifa, tiempo max). | Vehículos / Reservaciones | Consultar y Validar Reserva | `VehiculoService.ts`, `ReservacionService.ts` | Lectura de `POLITICA_VEHICULO` | Error 400 si se excede tiempo, cálculo correcto del `TOTAL_ESTIMADO`. |
| **RN04**: Agregar tipos no requiere modificar código central. | Vehículos | Crear Reservación | `VehiculoService.ts` (obtenerPolitica) | Depende puramente de tabla `POLITICA_VEHICULO` | El código no contiene condicionales `if scooter` o `if bici`. |
