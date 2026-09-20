-- Insertar Tipos de Vehículo
INSERT INTO TIPO_VEHICULO (ID_TIPO, NOMBRE, DESCRIPCION) VALUES 
('TIPO_BICI', 'Bicicleta', 'Bicicleta mecánica estándar'),
('TIPO_SCOOTER', 'Scooter Eléctrico', 'Scooter eléctrico de hasta 25km/h');

-- Insertar Políticas
INSERT INTO POLITICA_VEHICULO (ID_POLITICA, ID_TIPO, TARIFA_HORA, TIEMPO_MAX_MIN, RESTRICCIONES, VIGENTE) VALUES 
('POL_BICI_1', 'TIPO_BICI', 20.00, 240, 'Uso exclusivo dentro de las ciclovías. Retornar en estación.', 1),
('POL_SCOOTER_1', 'TIPO_SCOOTER', 50.00, 120, 'Uso para mayores de edad. Obligatorio uso de casco.', 1);

-- Insertar Vehículos
INSERT INTO VEHICULO (ID_VEHICULO, CODIGO, ID_TIPO, ESTADO) VALUES 
('V_BICI_001', 'BIC-001', 'TIPO_BICI', 'DISPONIBLE'),
('V_BICI_002', 'BIC-002', 'TIPO_BICI', 'DISPONIBLE'),
('V_BICI_003', 'BIC-003', 'TIPO_BICI', 'EN_USO'),
('V_SCOOTER_001', 'SCO-001', 'TIPO_SCOOTER', 'DISPONIBLE'),
('V_SCOOTER_002', 'SCO-002', 'TIPO_SCOOTER', 'MANTENIMIENTO');
