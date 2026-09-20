-- 005_seed_reservation_test.sql
-- Script de evolución: Reservación inicial para prueba de RN02 (traslape)
-- Inserta una reservación en estado ACTIVA para un vehículo disponible existente
-- dentro de un periodo futuro válido cumpliendo con CHECK (INICIO < FIN) y la política aplicable.

INSERT INTO RESERVACION (
    ID_RESERVACION,
    CODIGO_RESERVA,
    ID_VEHICULO,
    ID_USUARIO,
    INICIO,
    FIN,
    ESTADO,
    TOTAL_ESTIMADO
) VALUES (
    'RES_TEST_RN02_001',
    'RES-RN02-SEED',
    'V_BICI_001',
    'test-user-rn02-seed',
    '2026-10-01 10:00:00',
    '2026-10-01 12:00:00',
    'ACTIVA',
    40.00
);
