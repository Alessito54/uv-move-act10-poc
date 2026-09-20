# Scripts de Base de Datos Db2

Este directorio contiene los scripts SQL necesarios para inicializar la base de datos de IBM Db2 para la PoC.

## Orden de Ejecución

1. `001_create_tables.sql`: Crea las estructuras básicas.
2. `002_constraints.sql`: Añade llaves primarias, foráneas y restricciones únicas.
3. `003_seed_data.sql`: Inserta los datos base necesarios (vehículos y políticas) para probar la aplicación.

## Cómo Ejecutar

Si dispones de una consola Db2 local:
```bash
db2 -tvf 001_create_tables.sql
db2 -tvf 002_constraints.sql
db2 -tvf 003_seed_data.sql
```
