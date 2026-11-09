# Bitácora de Casos de Uso Implementados — FashionStore SaaS (Segundo Parcial)
> Estado de verificación y pruebas funcionales en entorno de desarrollo.

- [x] **CU-12: Gestionar Devoluciones y Cambios de Talla (Garantía)**
  - Plazo de devolución: 7 días legal / 24h.
  - Reingreso de prenda a inventario de almacén (+1 stock).
  - Cálculo automático de diferencia económica y notificación PUSH con pasarela Stripe.
  - Estado: Implementado y probado satisfactoriamente.

- [x] **CU-14: Sincronización Automática de Datos Locales con el Servidor Central**
  - Despacho de transacciones offline por lote (/api/v1/sync/batch).
  - Idempotencia garantizada por UUIDv4 y resolución de colisiones por timestamp.
  - Vaciado de cola pending_sync al restablecer enlace de red.
  - Estado: Implementado y probado satisfactoriamente.

- [x] **CU-16: Tablero de Control de KPIs y Predicción ML de Demanda**
  - Métricas ejecutivas en tiempo real: ingresos, rotación de inventario y margen bruto.
  - Modelo de machine learning (Scikit-Learn) para predicción de series temporales de demanda.
  - Segmentación de clientes RFM (Recencia, Frecuencia, Monto) con clustering.
  - Estado: Implementado y probado satisfactoriamente.

- [x] **CU-18: Respaldo y Restauración Automatizada de la Base de Datos**
  - Generación de respaldos completos e incrementales de esquemas multitenant PostgreSQL.
  - Cifrado seguro AES-256 y almacenamiento estructurado de snapshots.
  - Verificación de integridad con hashes SHA-256 y utilitario de restauración en Sandbox.
  - Estado: Implementado y probado satisfactoriamente.
