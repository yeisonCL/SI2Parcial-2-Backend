# -*- coding: utf-8 -*-
"""
generar_seccion_5_6_pruebas.py
Genera y actualiza la Sección 5.6 ("Casos de prueba formales") en SI2 Parcial 2.docx
e independientemente en Casos_de_Prueba_Formale_18CU_FashionStore.docx
Incluye los 18 Casos de Uso del Segundo Parcial con tablas formales y capturas de pantalla integradas.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

PROTOS_DIR = r"c:\Users\HP\Desktop\revision de documento\prototipos_ui"
DOC_ORIGINAL = r"c:\Users\HP\Desktop\revision de documento\SI2 Parcial 2.docx"
DOC_SALIDA_STANDALONE = r"c:\Users\HP\Desktop\revision de documento\Casos_de_Prueba_Formale_18CU_FashionStore.docx"

CASOS_PRUEBA = [
    {
        "id": "CU-01",
        "cu_tag": "Caso de uso CU01",
        "nombre": "Registrar Empresa y Contratar Suscripción SaaS (Stripe)",
        "descripcion": (
            "Permite a una nueva empresa registrarse en la plataforma, seleccionar un plan comercial "
            "(Básico, Profesional, Enterprise) y realizar el pago recurrente seguro mediante la pasarela Stripe "
            "para habilitar su tenant y acceder al software."
        ),
        "precondiciones": (
            "a) La empresa y el correo corporativo no deben existir previamente en la base de datos central de FashionStore.\n"
            "b) Debe existir conexión activa con los servidores y APIs de Stripe."
        ),
        "pasos": [
            ("1", "Acceder al portal web de registro SaaS de FashionStore.", "Se despliega el formulario corporativo y los planes de suscripción disponibles.", "Satisfactorio"),
            ("2", "Llenar datos de empresa (Razón Social, NIT, Subdominio) y seleccionar plan Profesional.", "El sistema valida que los campos obligatorios no estén vacíos y que el subdominio esté libre.", "Satisfactorio"),
            ("3", "Ingresar número de tarjeta de crédito, vencimiento y CVC en el componente Stripe Elements.", "Stripe Elements cifra y valida los datos bancarios del tarjetahabiente en tiempo real.", "Satisfactorio"),
            ("4", "Presionar el botón 'Confirmar Suscripción y Crear Empresa'.", "Stripe emite token de cobro exitoso, el sistema genera el tenant_id en PostgreSQL, crea el usuario administrador y redirige al panel de control.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU01_saas_stripe.jpg"
    },
    {
        "id": "CU-02",
        "cu_tag": "Caso de uso CU02",
        "nombre": "Iniciar Sesión y Validar Acceso RBAC (JWT)",
        "descripcion": (
            "Valida las credenciales corporativas del usuario contra la base de datos multi-tenant, "
            "expide tokens criptográficos JWT (Access y Refresh) con claims de tenant y perfil, y autoriza el acceso a las funciones del rol asignado."
        ),
        "precondiciones": (
            "a) El usuario debe estar previamente registrado y activo en el tenant correspondiente.\n"
            "b) El servicio backend de autenticación en FastAPI debe estar en ejecución."
        ),
        "pasos": [
            ("1", "Navegar a la pantalla de autenticación del sistema (/login).", "Se despliega el formulario de acceso solicitando correo electrónico, contraseña corporativa y selector de tenant.", "Satisfactorio"),
            ("2", "Ingresar correo corporativo (admin@fashionstore.com) y contraseña válida.", "Los campos se validan en el cliente y se activa el botón de 'Iniciar Sesión'.", "Satisfactorio"),
            ("3", "Presionar el botón 'Iniciar Sesión'.", "El backend verifica el hash Bcrypt/Argon2, emite el token JWT con los claims tenant_id y roles, y responde con código HTTP 200 OK.", "Satisfactorio"),
            ("4", "Inspeccionar la redirección hacia el Dashboard y el almacenamiento seguro de sesión.", "El token se almacena en localStorage y el frontend renderiza el panel de control correspondiente a los permisos RBAC.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU02_auth_jwt.jpg"
    },
    {
        "id": "CU-03",
        "cu_tag": "Caso de uso CU03",
        "nombre": "Gestionar Sucursales Físicas y Terminales de Caja",
        "descripcion": (
            "Permite al administrador de la empresa crear, configurar y auditar sedes físicas (sucursales) y "
            "habilitar terminales de punto de venta (cajas físicas) asociadas con números de serie únicos."
        ),
        "precondiciones": (
            "a) El usuario debe poseer el rol de Administrador de Empresa (ROL_ADMIN).\n"
            "b) La empresa debe contar con cupo disponible de sucursales según su plan SaaS contratado."
        ),
        "pasos": [
            ("1", "Acceder al módulo de 'Gestión de Sucursales y Cajas' (/inventario/sucursales).", "Se despliega el listado interactivo de sucursales existentes con sus estados y número de cajas habilitadas.", "Satisfactorio"),
            ("2", "Presionar el botón '+ Nueva Sucursal' y completar los datos (Nombre: 'Sucursal Equipetrol', Dirección, Teléfono).", "El formulario valida que la dirección y el nombre no sean nulos y habilita el botón de confirmación.", "Satisfactorio"),
            ("3", "Asociar 2 terminales de caja física ingresando prefijo fiscal ('POS-EQP-01', 'POS-EQP-02') y monto de apertura.", "El sistema asigna UUIDv4 a cada caja y las vincula a la clave foránea de la sucursal en PostgreSQL.", "Satisfactorio"),
            ("4", "Guardar la configuración y verificar la persistencia.", "Se genera el registro con respuesta 201 Created, listando la nueva sucursal y sus cajas en estado 'Operativa / Activa'.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU03_sucursales_cajas.jpg"
    },
    {
        "id": "CU-04",
        "cu_tag": "Caso de uso CU04",
        "nombre": "Gestionar Catálogo de Prendas, Variantes y Temporadas",
        "descripcion": (
            "Permite clasificar y registrar prendas de vestir, definiendo colecciones estacionales (Primavera, Otoño, etc.), "
            "categorías, atributos dimensionales (tallas XS-XL) y paletas de color con gestión granular de stock por variante."
        ),
        "precondiciones": (
            "a) Las tablas maestras de Categorías, Tallas y Colores deben estar debidamente pobladas.\n"
            "b) El usuario cuenta con permisos de Jefe de Almacén o Administrador."
        ),
        "pasos": [
            ("1", "Ingresar al submódulo de 'Catálogo de Prendas y Variantes' (/inventario/catalogo).", "Se muestra la cuadrícula de productos con miniaturas, filtros por temporada, categoría y stock consolidado.", "Satisfactorio"),
            ("2", "Hacer clic en '+ Registrar Prenda', ingresar Nombre ('Vestido Seda Floral'), Temporada ('Primavera 2026') y Precio (280 Bs.).", "Se validan tipos de datos numéricos y campos obligatorios de la prenda matriz.", "Satisfactorio"),
            ("3", "Definir la matriz de variantes combinando tallas (S, M, L) con colores (Rojo, Azul) y asignar stock inicial a cada combinación.", "Se generan automáticamente las tuplas en Ropa_Talla_Color con su stock asignado.", "Satisfactorio"),
            ("4", "Cargar fotografía referencial y presionar 'Publicar Prenda'.", "La imagen se procesa y almacena en el servidor estático y la prenda queda disponible en catálogo.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU04_catalogo_temporadas.jpg"
    },
    {
        "id": "CU-05",
        "cu_tag": "Caso de uso CU05",
        "nombre": "Consultar Catálogo y Disponibilidad en Modo Offline",
        "descripcion": (
            "Permite al cliente o al cajero explorar el catálogo de prendas, verificar precios, tallas, colores y existencias "
            "disponibles en la sucursal física local, aun cuando el terminal no cuente con conexión a Internet."
        ),
        "precondiciones": (
            "a) El dispositivo (PWA o aplicación móvil Flutter) descargó previamente la réplica del catálogo en IndexedDB o SQLite.\n"
            "b) El adaptador de red se encuentra desactivado (Modo Offline)."
        ),
        "pasos": [
            ("1", "Desactivar la conexión a Internet e ingresar al módulo de 'Catálogo'.", "El sistema detecta la ausencia de red y activa el modo Offline-First con badge visible.", "Satisfactorio"),
            ("2", "Aplicar filtro por categoría 'Vestidos' y talla 'M'.", "La aplicación consulta la base de datos local estructurada sin generar errores de red.", "Satisfactorio"),
            ("3", "Seleccionar la prenda 'Vestido Seda Floral'.", "Se muestran las imágenes en caché, descripción, precio unitario (280 Bs.) y las 4 unidades disponibles en tienda física.", "Satisfactorio"),
            ("4", "Presionar 'Agregar al Carrito / Ticket Local'.", "La prenda se almacena en el carrito local persistente sin requerir conexión al servidor.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU05_catalogo_offline.jpg"
    },
    {
        "id": "CU-06",
        "cu_tag": "Caso de uso CU06",
        "nombre": "Interactuar con Vestidor Virtual 3D y WebXR",
        "descripcion": (
            "Ofrece una experiencia inmersiva que proyecta modelos tridimensionales de las prendas sobre avatares paramétricos "
            "o el entorno real del usuario mediante tecnologías WebXR y el componente <model-viewer>."
        ),
        "precondiciones": (
            "a) La prenda seleccionada debe poseer archivo de modelado 3D optimizado en formato GLB/glTF.\n"
            "b) El navegador web del cliente debe admitir aceleración WebGL y API WebXR."
        ),
        "pasos": [
            ("1", "Acceder al detalle de una prenda con insignia 'Disponible en 3D' y presionar 'Abrir Probador Virtual 3D'.", "Se inicializa el canvas de renderizado WebGL cargando el avatar base y la geometría del vestido.", "Satisfactorio"),
            ("2", "Modificar parámetros del maniquí virtual (Estatura, Contextura, Medida de busto/cintura).", "El motor 3D deforma en tiempo real la malla del avatar adaptándola a la silueta antropométrica ingresada.", "Satisfactorio"),
            ("3", "Probar variantes de color y rotar la prenda 360 grados con controles táctiles o mouse.", "Los shaders de tela responden a la iluminación ambiental proyectando caídas y texturas realistas.", "Satisfactorio"),
            ("4", "Pulsar el botón 'Ver en tu Espacio (AR / WebXR)'.", "El sistema activa la cámara del móvil proyectando la prenda a escala real en la habitación del usuario.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU06_vestidor_3d.jpg"
    },
    {
        "id": "CU-07",
        "cu_tag": "Caso de uso CU07",
        "nombre": "Reservar Prendas Web-to-Store con Cita Previa",
        "descripcion": (
            "Permite al cliente seleccionar prendas online, apartarlas temporalmente en stock y agendar una cita presencial "
            "en sucursal física para probárselas antes de comprarlas (estrategia Web-to-Store)."
        ),
        "precondiciones": (
            "a) El cliente debe estar autenticado con su carnet (CI) o cuenta digital.\n"
            "b) Las prendas seleccionadas deben poseer existencias físicas en la sucursal elegida."
        ),
        "pasos": [
            ("1", "Seleccionar dos prendas del catálogo online y presionar la opción 'Reservar para Probar en Tienda'.", "Se abre el asistente de reserva Web-to-Store mostrando las prendas y sucursales disponibles.", "Satisfactorio"),
            ("2", "Elegir sucursal 'Sede Central', seleccionar fecha (mañana) y franja horaria disponible ('15:30 - 16:00').", "El sistema valida la disponibilidad horaria de probadores y bloquea el stock en Reserva_Cita.", "Satisfactorio"),
            ("3", "Confirmar la solicitud de reserva con los datos de contacto del cliente.", "Se crea el registro maestro en Reserva_Cita y el detalle en Detalle_Reserva con estado 'Pendiente'.", "Satisfactorio"),
            ("4", "Verificar comprobante de cita y notificación emitida.", "Se genera un código QR de cita con token de confirmación y se despacha notificación push/correo al cliente.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU07_reservas.jpg"
    },
    {
        "id": "CU-08",
        "cu_tag": "Caso de uso CU08",
        "nombre": "Gestionar Carrito de Compras Omnicanal Persistente",
        "descripcion": (
            "Permite al usuario consolidar prendas en una cesta de compra que persiste en IndexedDB/LocalStorage "
            "y se sincroniza con el servidor al iniciar sesión en cualquier dispositivo."
        ),
        "precondiciones": (
            "a) Los artículos agregados deben existir en la base de datos de productos.\n"
            "b) El navegador web debe permitir almacenamiento en IndexedDB."
        ),
        "pasos": [
            ("1", "Navegar por el catálogo, seleccionar una falda (Talla M, Color Negro) y presionar 'Añadir al Carrito'.", "El artículo se indexa en la cesta local, actualizando el contador flotante a 1 ítem y calculando el subtotal.", "Satisfactorio"),
            ("2", "Abrir la vista del Carrito de Compras (/ventas/carrito) y modificar la cantidad a 2 unidades.", "El subtotal se recalcula instantáneamente verificando que la cantidad no exceda el stock máximo disponible.", "Satisfactorio"),
            ("3", "Cerrar la pestaña del navegador, reiniciar la ventana e ingresar nuevamente al portal.", "El carrito recupera íntegramente los productos, cantidades y precios desde IndexedDB sin pérdida de datos.", "Satisfactorio"),
            ("4", "Presionar el botón 'Proceder al Pago / Checkout'.", "El sistema valida disponibilidad de stock global y deriva al flujo de liquidación de pago.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU08_carrito.jpg"
    },
    {
        "id": "CU-09",
        "cu_tag": "Caso de uso CU09",
        "nombre": "Procesar Ventas POS con Resiliencia Offline",
        "descripcion": (
            "Permite al cajero facturar y cobrar prendas de contado en el mostrador de la tienda física sin conexión a Internet, "
            "descontando stock de la base de datos local y generando un ticket con UUIDv4 para su posterior sincronización."
        ),
        "precondiciones": (
            "a) El cajero ha iniciado sesión en el terminal POS con sucursal asignada.\n"
            "b) La base de datos local (IndexedDB / SQLite) está inicializada.\n"
            "c) El enlace de datos externo está caído."
        ),
        "pasos": [
            ("1", "Acceder a la interfaz del Punto de Venta (POS) en mostrador", "Se muestra la barra de estado superior con badge ámbar: 'Modo Sin Conexión - 2 tickets en cola'.", "Satisfactorio"),
            ("2", "Escanear código de barras o seleccionar 'Chaqueta Cuero Café'.", "La prenda se agrega al ticket, calculando subtotales e impuestos automáticamente.", "Satisfactorio"),
            ("3", "Seleccionar forma de pago 'Efectivo', ingresar 500 Bs. y presionar 'Cobrar'.", "El sistema calcula el cambio (50 Bs.), descuenta 1 unidad del inventario local y genera un UUIDv4 único.", "Satisfactorio"),
            ("4", "Presionar 'Imprimir Comprobante Fiscal'.", "Se imprime el comprobante de venta físico con el hash de desconexión y la venta se guarda en la cola local pending_sync.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU09_pos_offline.jpg"
    },
    {
        "id": "CU-10",
        "cu_tag": "Caso de uso CU10",
        "nombre": "Procesar Pagos Digitales con Tarjeta (Pasarela Stripe)",
        "descripcion": (
            "Permite a los clientes de la tienda online o cajeros liquidar compras mediante tarjetas de débito/crédito "
            "nacionales e internacionales con integración directa a Stripe Payments Intent API."
        ),
        "precondiciones": (
            "a) Carrito de compras con monto total mayor a cero.\n"
            "b) Claves públicas y secretas de Stripe configuradas en las variables de entorno."
        ),
        "pasos": [
            ("1", "En la pantalla de Checkout, seleccionar método de pago 'Tarjeta de Débito / Crédito (Stripe)'.", "Se renderiza el iframe seguro de Stripe Elements con validación luhn integrada.", "Satisfactorio"),
            ("2", "Introducir numeración de tarjeta válida de prueba (Visa 4242...), fecha futura y CVC (123).", "Stripe valida el formato de la tarjeta en el cliente mostrando icono de tarjeta reconocido.", "Satisfactorio"),
            ("3", "Presionar el botón 'Pagar 450.00 Bs.'.", "Se envía client_secret a Stripe API, procesando el cobro seguro y devolviendo estado succeeded.", "Satisfactorio"),
            ("4", "Verificar registro de venta y confirmación de pago.", "El backend registra la tupla en la tabla Pago con Metodo_Pago='Stripe' y emite la factura electrónica correspondiente.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU10_ventas_stripe.jpg"
    },
    {
        "id": "CU-11",
        "cu_tag": "Caso de uso CU11",
        "nombre": "Procesar Cobros con Código QR Simple Interoperable",
        "descripcion": (
            "Permite liquidar transacciones presenciales y remotas mediante la generación dinámica de un código QR bajo estándar "
            "de la red de pagos bancarios (QR Simple / ASOBAN), efectuando verificación de acreditación en tiempo real."
        ),
        "precondiciones": (
            "a) El pedido se encuentra en estado 'Pendiente de Pago'.\n"
            "b) El servicio de generación de imágenes QR y WebSockets está operativo."
        ),
        "pasos": [
            ("1", "Seleccionar la orden #PD-1049 por valor de 350 Bs. y elegir método de pago 'QR Simple'.", "El sistema invoca el generador criptográfico y renderiza el código QR dinámico en pantalla con temporizador de 10 minutos.", "Satisfactorio"),
            ("2", "El cliente escanea el código QR desde su aplicación de banca móvil y autoriza la transferencia.", "La pasarela bancaria procesa el débito y emite callback/webhook hacia la API de FashionStore.", "Satisfactorio"),
            ("3", "El canal WebSocket del backend detecta la acreditación de los fondos en cuenta empresarial.", "La pantalla del cliente y del cajero cambia automáticamente a estado 'Pago Acreditado Exitosamente'.", "Satisfactorio"),
            ("4", "Consultar el estado del pedido en la base de datos central.", "El registro en Pedido pasa a 'Pagado', se crea el registro en Pago con Metodo_Pago='QR' y se habilita entrega.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU11_cobro_qr.jpg"
    },
    {
        "id": "CU-12",
        "cu_tag": "Caso de uso CU12",
        "nombre": "Gestionar Devoluciones y Cambios de Talla (Garantía)",
        "descripcion": (
            "Permite al cliente tramitar la devolución o cambio de talla de una prenda adquirida dentro del plazo de garantía (7 días), "
            "registrando el ingreso a cuarentena o stock y gestionando la liquidación de diferencias mediante cobro en caja o notificación PUSH con Stripe."
        ),
        "precondiciones": (
            "a) El cliente presenta el comprobante de venta o número de ticket #TK-8492.\n"
            "b) La compra se realizó hace 4 días (dentro del plazo legal de 7 días).\n"
            "c) La prenda conserva sus etiquetas intactas."
        ),
        "pasos": [
            ("1", "Ingresar el número de ticket #TK-8492 en el módulo de devoluciones.", "El sistema valida que la compra tiene 4 días calendario y despliega el detalle de prendas adquiridas.", "Satisfactorio"),
            ("2", "Seleccionar la prenda a devolver y marcar destino 'Reingreso a Cuarentena'.", "Se registra el motivo del cambio y se bloquea la prenda retornada en la tabla transitoria de cuarentena.", "Satisfactorio"),
            ("3", "Seleccionar la nueva prenda de cambio (talla superior con precio mayor).", "El sistema calcula automáticamente la diferencia económica a liquidar (+20 Bs.).", "Satisfactorio"),
            ("4", "Presionar 'Enviar Cobro PUSH Pasarela Stripe' y confirmar operación.", "Se despacha el cobro digital al móvil del cliente, se confirma el pago y el sistema emite la 'Nota de Cambio y Devolución'.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU12_devolucion_garantia.jpg"
    },
    {
        "id": "CU-13",
        "cu_tag": "Caso de uso CU13",
        "nombre": "Gestionar Traspasos de Mercadería entre Sucursales",
        "descripcion": (
            "Permite coordinar el traslado de mercadería entre dos tiendas de la misma empresa para equilibrar existencias, "
            "garantizando trazabilidad auditada bajo tres estados formales: Solicitado, En Tránsito y Recepcionado."
        ),
        "precondiciones": (
            "a) Ambas sucursales pertenecen al mismo Tenant empresarial.\n"
            "b) La sucursal de origen cuenta con existencias disponibles del artículo solicitado."
        ),
        "pasos": [
            ("1", "Encargado de Sucursal Norte crea requerimiento de traspaso #TR-501 de 5 blusas a Sucursal Sur.", "El sistema genera el registro con estado 'Solicitado' y emite notificación a la tienda proveedora.", "Satisfactorio"),
            ("2", "Encargado de Sucursal Sur acepta el requerimiento y despacha las prendas físicas.", "El sistema descuenta el stock de origen y cambia el estado a 'En Tránsito'.", "Satisfactorio"),
            ("3", "Transportista entrega el pedido en Sucursal Norte y se escanean los códigos de barra.", "El sistema verifica la correspondencia física de las 5 prendas con la guía digital.", "Satisfactorio"),
            ("4", "Presionar 'Confirmar Recepción de Traspaso'.", "El sistema actualiza el inventario sumando las existencias en destino y marca el estado como 'Recepcionado'.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU13_traspasos_sucursales.jpg"
    },
    {
        "id": "CU-14",
        "cu_tag": "Caso de uso CU14",
        "nombre": "Sincronización Automática de Datos Locales con el Servidor Central",
        "descripcion": (
            "Garantiza la conciliación bidireccional entre la base de datos local y el servidor central en cuanto se reanuda la conectividad a Internet, "
            "resolviendo conflictos de concurrencia y procesando tickets en cola."
        ),
        "precondiciones": (
            "a) El terminal POS operó en modo offline y acumuló transacciones en la cola pending_sync.\n"
            "b) Se restablece la conectividad física de red o Wi-Fi."
        ),
        "pasos": [
            ("1", "Reactivar el enlace de red en el terminal punto de venta.", "El listener del navegador detecta el evento de red online y el badge conmuta automáticamente a verde 'Conectado'.", "Satisfactorio"),
            ("2", "El demonio en background despacha la cola de transacciones al endpoint /api/v1/sync/batch.", "El servidor procesa el paquete idempotente mediante UUIDv4, consolidando ventas e inventario sin duplicar tuplas.", "Satisfactorio"),
            ("3", "Simular colisión de stock por venta concurrente en otra terminal sobre el mismo vestido.", "El algoritmo de resolución aplica la regla de marca temporal (timestamp) y genera registro en bitácora de auditoría.", "Satisfactorio"),
            ("4", "Verificar el vaciado de la cola local en el terminal POS.", "El contador de transacciones en cola llega a 0 ('Sincronización 100% Completa') y el stock central queda actualizado.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU14_sincronizacion_offline.jpg"
    },
    {
        "id": "CU-15",
        "cu_tag": "Caso de uso CU15",
        "nombre": "Generar Reportes Ejecutivos Asistidos por IA (Google Gemini)",
        "descripcion": (
            "Permite a los directivos formular consultas operativas o financieras en lenguaje natural (texto o notas de voz), "
            "las cuales son interpretadas por Google Gemini 1.5 Pro para generar métricas, resúmenes y gráficos ejecutivos consolidados."
        ),
        "precondiciones": (
            "a) La API Key de Google Gemini debe estar configurada y con cuota activa.\n"
            "b) La base de datos debe contener historial de ventas del mes en curso."
        ),
        "pasos": [
            ("1", "Ingresar al módulo 'Reportes con IA Generativa' (/reportes/ia).", "Se despliega la consola conversacional con micrófono para notas de voz y selector de consultas predefinidas.", "Satisfactorio"),
            ("2", "Grabar o escribir la solicitud: '¿Cuáles fueron las 3 prendas más vendidas este mes y qué sucursal tuvo mejor margen?'.", "El backend procesa el prompt con contexto estructurado y remite el payload a la API de Google Gemini.", "Satisfactorio"),
            ("3", "Gemini analiza los registros transaccionales y emite la respuesta analítica en formato Markdown y JSON.", "El panel renderiza el análisis ejecutivo destacando el 'Vestido Seda Floral' (142 unidades) y 'Sucursal Norte' (+32% margen).", "Satisfactorio"),
            ("4", "Presionar el botón 'Exportar Reporte Ejecutivo a PDF'.", "El sistema compila las tablas, el resumen explicativo y las gráficas en un documento formal descargable.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU15_reportes_ia_voz.jpg"
    },
    {
        "id": "CU-16",
        "cu_tag": "Caso de uso CU16",
        "nombre": "Tablero de Control de KPIs y Predicción ML de Demanda",
        "descripcion": (
            "Proporciona a la gerencia un panel de comando con indicadores clave en tiempo real (ingresos, rotación de inventario, ticket promedio) "
            "y proyecciones de demanda calculadas mediante algoritmos de regresión y series temporales (Scikit-Learn)."
        ),
        "precondiciones": (
            "a) Usuario con rol de Director o Gerente de Operaciones.\n"
            "b) Histórico transaccional suficiente para alimentar el modelo predictivo."
        ),
        "pasos": [
            ("1", "Iniciar sesión y acceder a la pantalla principal 'Dashboard Ejecutivo' (/dashboard).", "Se visualizan las tarjetas de KPIs: Ventas Totales (84,250 Bs.), Margen Bruto (41.5%) y Clientes Nuevos.", "Satisfactorio"),
            ("2", "Seleccionar la pestaña de 'Predicción de Demanda Inteligente (ML)'.", "El modelo ejecuta la proyección de demanda para las próximas dos semanas mostrando curvas de tendencia.", "Satisfactorio"),
            ("3", "Aplicar filtro estacional para la categoría 'Chaquetas y Abrigos'.", "El gráfico proyecta un incremento del 28% de ventas para el próximo frente frío sugiriendo abastecer 30 unidades extra.", "Satisfactorio"),
            ("4", "Verificar la segmentación RFM (Recencia, Frecuencia, Monto) en el cuadrante inferior.", "El algoritmo de clustering clasifica automáticamente los clientes en 'VIP', 'Frecuentes' y 'En Riesgo'.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU16_dashboard_kpis_ml.jpg"
    },
    {
        "id": "CU-17",
        "cu_tag": "Caso de uso CU17",
        "nombre": "Auditoría Forense y Bitácora Confidencial Cifrada",
        "descripcion": (
            "Registra de manera inmutable y criptográficamente sellada cada acción crítica efectuada en la plataforma "
            "(cambios de precios, eliminaciones, accesos de superadmin), accesible únicamente mediante llave maestra del Oficial de Seguridad."
        ),
        "precondiciones": (
            "a) Los disparadores (triggers) y middleware de bitácora están activos en FastAPI y PostgreSQL.\n"
            "b) Se cuenta con la llave criptográfica RSA de auditoría forense."
        ),
        "pasos": [
            ("1", "Un usuario modifica el precio de una prenda de 300 Bs. a 180 Bs. desde el catálogo.", "El interceptor de auditoría captura el evento, la IP origen, el usuario ejecutor y los valores anterior/nuevo.", "Satisfactorio"),
            ("2", "El auditor de sistemas ingresa a la consola de 'Bitácora Confidencial' (/seguridad/bitacora).", "El sistema solicita la clave criptográfica de desarrollador / auditor para desencriptar los registros sensibles.", "Satisfactorio"),
            ("3", "Ingresar la llave maestra de seguridad y presionar 'Verificar Integridad'.", "El módulo valida la firma HMAC del registro asegurando que los logs no han sido manipulados ni alterados.", "Satisfactorio"),
            ("4", "Filtrar por el ID de la prenda modificada.", "Se visualiza la traza completa: Fecha, Hora, Operador, Hash de verificación y Diferencia de precio (-120 Bs.).", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU17_bitacora_llave_dev.jpg"
    },
    {
        "id": "CU-18",
        "cu_tag": "Caso de uso CU18",
        "nombre": "Respaldo y Restauración Automatizada de la Base de Datos",
        "descripcion": (
            "Permite programar y ejecutar copias de seguridad completas o incrementales de la base de datos PostgreSQL multi-tenant, "
            "con cifrado AES-256, exportación a almacenamiento en la nube y utilitario de restauración en caso de desastre."
        ),
        "precondiciones": (
            "a) El usuario debe contar con privilegios de SuperAdministrador.\n"
            "b) El motor PostgreSQL y la herramienta pg_dump / pg_restore están configurados en el host."
        ),
        "pasos": [
            ("1", "Acceder al módulo de 'Respaldos y Seguridad del Sistema' (/seguridad/backup).", "Se despliega la lista histórica de snapshots existentes con su tamaño en disco, fecha, tipo y estado de integridad.", "Satisfactorio"),
            ("2", "Seleccionar el Tenant corporativo y presionar el botón 'Generar Respaldo Manual Completo'.", "El sistema invoca el proceso de volcado seguro, generando un archivo .sql.enc cifrado con algoritmo AES-256.", "Satisfactorio"),
            ("3", "Descargar el archivo de respaldo generado y verificar el hash SHA-256 de integridad.", "El archivo se descarga exitosamente y el hash calculado coincide con el manifest almacenado en la bitácora.", "Satisfactorio"),
            ("4", "Ejecutar prueba de restauración en entorno de contingencia (Sandbox).", "El proceso de restauración procesa las definiciones de esquema e inserta los datos sin generar inconsistencias de integridad referencial.", "Satisfactorio")
        ],
        "responsable": "Yeison Choque León / Ingeniero de pruebas",
        "resultado": "Satisfactorio",
        "img": "prototipo_CU18_backup_restore.jpg"
    }
]

def set_cell_width(cell, width_dxa):
    tcPr = cell._tc.get_or_add_tcPr()
    tcW = tcPr.find(qn('w:tcW'))
    if tcW is None:
        tcW = OxmlElement('w:tcW')
        tcPr.append(tcW)
    tcW.set(qn('w:w'), str(width_dxa))
    tcW.set(qn('w:type'), 'dxa')

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = tcPr.find(qn('w:shd'))
    if shd is None:
        shd = OxmlElement('w:shd')
        tcPr.append(shd)
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)

def set_table_borders(table):
    tblPr = table._tbl.tblPr
    existing_borders = tblPr.find(qn('w:tblBorders'))
    if existing_borders is not None:
        tblPr.remove(existing_borders)
    tblBorders = OxmlElement('w:tblBorders')
    for border_name, sz in [('top', '6'), ('left', '6'), ('bottom', '6'), ('right', '6'), ('insideH', '4'), ('insideV', '4')]:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), sz)
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), '000000')
        tblBorders.append(border)
    tblPr.append(tblBorders)

def add_header_table(doc, cu_data):
    tbl = doc.add_table(rows=3, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl)

    row_data = [
        (f"{cu_data['cu_tag']}", cu_data["nombre"]),
        ("Descripción", cu_data["descripcion"]),
        ("Precondiciones", cu_data["precondiciones"])
    ]

    for i, (label, val) in enumerate(row_data):
        row = tbl.rows[i]
        set_cell_width(row.cells[0], 2340)
        set_cell_width(row.cells[1], 7020)
        
        # Label cell
        p0 = row.cells[0].paragraphs[0]
        p0.text = ""
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        p0.paragraph_format.line_spacing = 1.15
        r0 = p0.add_run(label)
        r0.font.name = "Arial"
        r0.font.size = Pt(9.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

        # Value cell
        p1 = row.cells[1].paragraphs[0]
        p1.text = ""
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        p1.paragraph_format.line_spacing = 1.15
        r1 = p1.add_run(val)
        r1.font.name = "Arial"
        r1.font.size = Pt(9.0)
        r1.font.bold = (i == 0)

    return tbl

def add_steps_table(doc, cu_data):
    tbl = doc.add_table(rows=5, cols=4)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl)

    widths = [864, 3168, 3600, 1728]
    headers = ["Paso", "Acción", "Resultado esperado", "Estado (Satisfactorio/Fallido)"]

    # Header row
    hdr_row = tbl.rows[0]
    for c_idx, title in enumerate(headers):
        cell = hdr_row.cells[c_idx]
        set_cell_width(cell, widths[c_idx])
        set_cell_shading(cell, "102C57")
        p = cell.paragraphs[0]
        p.text = ""
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(title)
        r.font.name = "Arial"
        r.font.size = Pt(9.0)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # 4 Data rows
    for r_idx, step in enumerate(cu_data["pasos"], start=1):
        row = tbl.rows[r_idx]
        for c_idx in range(4):
            cell = row.cells[c_idx]
            set_cell_width(cell, widths[c_idx])
            set_cell_shading(cell, "FFFFFF")
            p = cell.paragraphs[0]
            p.text = ""
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15

            val = step[c_idx]
            r = p.add_run(val)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)

            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r.font.bold = True
            elif c_idx == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x00, 0x80, 0x00)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    return tbl

def add_footer_table(doc, cu_data):
    tbl = doc.add_table(rows=3, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    set_table_borders(tbl)

    for i in range(3):
        set_cell_width(tbl.rows[i].cells[0], 2340)
        set_cell_width(tbl.rows[i].cells[1], 7020)

    # Row 0: Responsable
    p0 = tbl.rows[0].cells[0].paragraphs[0]
    p0.text = ""
    r0 = p0.add_run("Responsable")
    r0.font.name = "Arial"
    r0.font.size = Pt(9.5)
    r0.font.bold = True
    r0.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

    p0_val = tbl.rows[0].cells[1].paragraphs[0]
    p0_val.text = ""
    r0_val = p0_val.add_run(cu_data["responsable"])
    r0_val.font.name = "Arial"
    r0_val.font.size = Pt(9.0)

    # Row 1: Resultado
    p1 = tbl.rows[1].cells[0].paragraphs[0]
    p1.text = ""
    r1 = p1.add_run("Resultado de la prueba")
    r1.font.name = "Arial"
    r1.font.size = Pt(9.5)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

    p1_val = tbl.rows[1].cells[1].paragraphs[0]
    p1_val.text = ""
    r1_val = p1_val.add_run(cu_data["resultado"])
    r1_val.font.name = "Arial"
    r1_val.font.size = Pt(9.0)
    r1_val.font.bold = True
    r1_val.font.color.rgb = RGBColor(0x00, 0x80, 0x00)

    # Row 2: Adjunto con imagen
    p2 = tbl.rows[2].cells[0].paragraphs[0]
    p2.text = ""
    r2 = p2.add_run("Adjunto")
    r2.font.name = "Arial"
    r2.font.size = Pt(9.5)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

    p2_img = tbl.rows[2].cells[1].paragraphs[0]
    p2_img.text = ""
    p2_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2_img.paragraph_format.space_before = Pt(4)
    p2_img.paragraph_format.space_after = Pt(4)

    img_path = os.path.join(PROTOS_DIR, cu_data["img"])
    if os.path.exists(img_path):
        run_img = p2_img.add_run()
        run_img.add_picture(img_path, width=Inches(5.7))
    else:
        p2_img.add_run(f"[Imagen no encontrada: {cu_data['img']}]")

    return tbl

def generar_documento_standalone():
    print("[*] Creando documento independiente Casos_de_Prueba_Formale_18CU_FashionStore.docx...")
    doc = docx.Document()
    
    # Configurar márgenes a 1 pulgada
    for sec in doc.sections:
        sec.top_margin = Inches(1.0)
        sec.bottom_margin = Inches(1.0)
        sec.left_margin = Inches(1.0)
        sec.right_margin = Inches(1.0)

    # Portada / Título
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(20)
    p_title.paragraph_format.space_after = Pt(10)
    r_t = p_title.add_run("FASHIONSTORE - SISTEMA INTEGRAL DE MODA OMNICANAL\n5.6. CASOS DE PRUEBA FORMALES (SEGUNDO PARCIAL)")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(16)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(20)
    r_s = p_sub.add_run("Batería de Pruebas de Caja Negra para 18 Casos de Uso (CU-01 a CU-18)\nEvaluación de Entradas, Acciones, Resultados Esperados y Comprobante Visual Adjunto")
    r_s.font.name = "Arial"
    r_s.font.size = Pt(11)
    r_s.font.italic = True
    r_s.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    doc.add_page_break()

    for idx, cu in enumerate(CASOS_PRUEBA):
        p_cu_title = doc.add_paragraph()
        p_cu_title.paragraph_format.space_before = Pt(12)
        p_cu_title.paragraph_format.space_after = Pt(6)
        r_cut = p_cu_title.add_run(f"Prueba de caso de uso {cu['id']}: {cu['nombre']}")
        r_cut.font.name = "Arial"
        r_cut.font.size = Pt(12)
        r_cut.font.bold = True
        r_cut.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)

        # Tablas
        add_header_table(doc, cu)
        p_sp1 = doc.add_paragraph()
        p_sp1.paragraph_format.space_before = Pt(2)
        p_sp1.paragraph_format.space_after = Pt(2)

        add_steps_table(doc, cu)
        p_sp2 = doc.add_paragraph()
        p_sp2.paragraph_format.space_before = Pt(2)
        p_sp2.paragraph_format.space_after = Pt(2)

        add_footer_table(doc, cu)
        
        if idx < len(CASOS_PRUEBA) - 1:
            doc.add_page_break()

    doc.save(DOC_SALIDA_STANDALONE)
    print(f"[+] Documento independiente guardado exitosamente en:\n    {DOC_SALIDA_STANDALONE}")

def actualizar_documento_principal():
    print(f"[*] Actualizando Sección 5.6 en {DOC_ORIGINAL}...")
    doc = docx.Document(DOC_ORIGINAL)
    body = doc._body._element

    # 1. Encontrar los índices de la Sección 5.6 y del Capítulo VI
    p56_idx = None
    p60_idx = None

    for i, child in enumerate(body):
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(child, doc)
            if '5.6. Casos de prueba formales' in p.text and i > 100:
                p56_idx = i
            elif 'CAPÍTULO VI: CONCLUSIONES Y RECOMENDACIONES' in p.text and i > 100:
                p60_idx = i

    print(f"    Rango detectado: Inicio 5.6={p56_idx}, Fin 5.6 / Inicio Cap VI={p60_idx}")
    if p56_idx is None or p60_idx is None:
        raise ValueError("No se pudo localizar la Sección 5.6 o el Capítulo VI en el documento.")

    # El elemento de anclaje antes del cual insertaremos los nuevos CUs es el encabezado del Capítulo VI
    target_element = body[p60_idx]

    # Eliminar todos los elementos entre p56_idx + 2 (después del párrafo introductorio) y p60_idx
    # Guardamos los elementos a eliminar
    elements_to_delete = []
    for i in range(p56_idx + 2, p60_idx):
        elements_to_delete.append(body[i])

    print(f"    Eliminando {len(elements_to_delete)} elementos antiguos de la Sección 5.6...")
    for elem in elements_to_delete:
        body.remove(elem)

    # Ahora creamos los nuevos elementos para los 18 CUs y los insertamos antes de target_element
    print("    Insertando los 18 Casos de Prueba con tablas y capturas...")
    for idx, cu in enumerate(CASOS_PRUEBA):
        # 1. Párrafo título CU
        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_before = Pt(14)
        p_title.paragraph_format.space_after = Pt(6)
        r = p_title.add_run(f"Prueba de caso de uso {cu['id']}: {cu['nombre']}")
        r.font.name = "Arial"
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x10, 0x2C, 0x57)
        target_element.addprevious(p_title._element)

        # 2. Tabla Header
        tbl_hdr = add_header_table(doc, cu)
        target_element.addprevious(tbl_hdr._element)

        # Espaciador
        sp1 = doc.add_paragraph()
        sp1.paragraph_format.space_before = Pt(2)
        sp1.paragraph_format.space_after = Pt(2)
        target_element.addprevious(sp1._element)

        # 3. Tabla Pasos
        tbl_steps = add_steps_table(doc, cu)
        target_element.addprevious(tbl_steps._element)

        # Espaciador
        sp2 = doc.add_paragraph()
        sp2.paragraph_format.space_before = Pt(2)
        sp2.paragraph_format.space_after = Pt(2)
        target_element.addprevious(sp2._element)

        # 4. Tabla Footer
        tbl_ftr = add_footer_table(doc, cu)
        target_element.addprevious(tbl_ftr._element)

        # Salto de página o separación
        sp3 = doc.add_paragraph()
        sp3.paragraph_format.space_before = Pt(6)
        sp3.paragraph_format.space_after = Pt(6)
        if idx < len(CASOS_PRUEBA) - 1:
            # Salto de página para que cada CU quede ordenado e impecable
            sp3_run = sp3.add_run()
            sp3_run.add_break(docx.enum.text.WD_BREAK.PAGE)
        target_element.addprevious(sp3._element)

    doc.save(DOC_ORIGINAL)
    print(f"[+] Documento principal {DOC_ORIGINAL} actualizado exitosamente!")

if __name__ == "__main__":
    generar_documento_standalone()
    actualizar_documento_principal()

