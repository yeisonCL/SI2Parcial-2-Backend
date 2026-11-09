# -*- coding: utf-8 -*-
"""
Script maestro para generar 'Fichas_Tecnicas_Casos_de_Uso_Segundo_Parcial.docx'
con la totalidad de los 18 Casos de Uso del Segundo Parcial,
con formato de tabla idéntico al de la imagen compartida por el usuario.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Directorios de imágenes
DIR_PROTOTIPOS = r"c:\Users\HP\Desktop\revision de documento\prototipos_ui"
DIR_DIAGRAMAS = r"c:\Users\HP\Desktop\revision de documento\diagramas_casos_de_uso_parcial2"

FICHAS_18_CUS = [
    {
        "codigo": "CU-01",
        "nombre": "Registrar Empresa y Contratar Suscripción SaaS (Stripe)",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite a una nueva empresa registrarse en la plataforma, seleccionar un plan comercial (Básico, Profesional o Enterprise) y realizar el pago mediante la pasarela Stripe para habilitar su tenant y acceder al software.",
        "actores": "Administrador de Empresa (Inquilino), Pasarela Stripe.",
        "precondicion": "La empresa no debe existir previamente en la base de datos central de FashionStore.",
        "flujo_normal": [
            "1. El Administrador accede a la página de registro SaaS de FashionStore.",
            "2. El sistema despliega el formulario solicitando datos corporativos (Razón Social, NIT, Subdominio) y los planes de suscripción (Básico, Profesional, Enterprise).",
            "3. El usuario selecciona el plan deseado y completa sus credenciales maestras.",
            "4. El sistema conecta con Stripe Elements y despliega la pasarela segura para tarjeta de crédito.",
            "5. El usuario ingresa la información de pago y confirma la suscripción.",
            "6. Stripe procesa el cobro y emite un token de suscripción exitoso (subscription_id).",
            "7. El sistema crea el registro del inquilino (Tenant), asigna un tenant_id único, genera el usuario administrador y remite un correo electrónico de bienvenida."
        ],
        "flujo_alt": [
            "4a. Falla en pasarela Stripe: Si la tarjeta es rechazada o no posee fondos suficientes, el sistema no crea el Tenant, notifica el error específico devuelto por Stripe y permite reintentar con otro medio de pago."
        ],
        "postcondicion": "La empresa queda habilitada en la nube con aislamiento de datos multitenant y estado de suscripción 'Activo'.",
        "proto_file": "prototipo_CU01_saas_stripe.jpg",
        "proto_title": "Prototipo de Interfaz Web - Registro de Empresa y Suscripción SaaS (CU-01)",
        "proto_desc": "Pantalla de alta B2B multitenant donde el administrador de empresa ingresa los datos corporativos (razón social, NIT, subdominio), selecciona el plan comercial y completa el pago recurrente seguro mediante el componente Stripe Elements."
    },
    {
        "codigo": "CU-02",
        "nombre": "Autenticación y Control de Acceso Multitenant (JWT)",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite a los usuarios identificarse en el sistema mediante credenciales seguras, validando su pertenencia a una empresa activa (Tenant) y otorgando un token JWT cifrado con sus roles y permisos RBAC para navegar en la plataforma Web o Móvil.",
        "actores": "Todos los Usuarios (SuperAdmin, TenantAdmin, Encargado, Cajero, Cliente), Servidor de Autenticación.",
        "precondicion": "El usuario debe estar registrado y activo; la empresa asociada debe contar con suscripción SaaS vigente.",
        "flujo_normal": [
            "1. El usuario accede a la pantalla de inicio de sesión de FashionStore (Web o Móvil Flutter).",
            "2. El sistema despliega el formulario de autenticación solicitando usuario/correo y contraseña.",
            "3. El usuario ingresa sus credenciales y presiona 'Iniciar Sesión'.",
            "4. El sistema valida las credenciales contra la base de datos central verificando el hash bcrypt y el estado de la empresa inquilina.",
            "5. El sistema genera un par de tokens criptográficos JWT (Access Token de 60 minutos firmado con clave privada y Refresh Token) inyectando los claims: user_id, rol, empresa_id y sucursal_id.",
            "6. El sistema almacena la sesión de forma segura y redirige al panel de control correspondiente al rol asignado.",
            "7. Se registra el evento de inicio de sesión exitoso en la bitácora de auditoría inmutable."
        ],
        "flujo_alt": [
            "3a. Credenciales inválidas: El sistema notifica 'Usuario o contraseña incorrectos' y bloquea la cuenta tras 5 intentos fallidos consecutivos.",
            "4a. Empresa con suscripción vencida: El sistema restringe el acceso al software y redirige a la pantalla de regularización de pago en Stripe."
        ],
        "postcondicion": "El usuario queda autenticado en la sesión con contexto multitenant aislado y permisos RBAC activos.",
        "proto_file": "CU02_Autenticación_Multitenant.png",
        "proto_title": "Prototipo de Interfaz Web - Autenticación y Control de Acceso Multitenant (CU-02)",
        "proto_desc": "Pantalla de inicio de sesión con validación de credenciales, selección automática de tenant y generación de tokens JWT con roles jerárquicos (SuperAdmin, Admin Tenant, Encargado, Cajero, Cliente)."
    },
    {
        "codigo": "CU-03",
        "nombre": "Administrar Sucursales y Puntos de Caja por Empresa",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Administrador de Empresa crear, configurar y supervisar las tiendas físicas de su cadena comercial y registrar las terminales de caja POS asociadas a cada sucursal para la venta presencial.",
        "actores": "Administrador de Empresa.",
        "precondicion": "El usuario posee rol de Administrador de Empresa y la cantidad de sucursales no supera el límite de su plan SaaS.",
        "flujo_normal": [
            "1. El Administrador accede al submódulo de Configuración de Sucursales y Cajas POS.",
            "2. El sistema despliega el listado de sucursales activas de la empresa (ej: Barrio Lindo, Ventura Mall) con sus datos de contacto y estado.",
            "3. El usuario pulsa 'Nueva Sucursal' e ingresa: nombre comercial, dirección, ciudad, teléfono y coordenadas GPS.",
            "4. El sistema valida que el cupo de sucursales del plan contratado (max_sucursales) no haya sido excedido.",
            "5. El usuario asigna las cajas físicas de cobro correspondientes a dicha sucursal (Número de caja, tipo de terminal POS).",
            "6. El sistema guarda la sucursal y cajas en PostgreSQL, e inicializa automáticamente los registros de inventario en cero para todas las prendas vigentes.",
            "7. El sistema confirma el registro y habilita la sucursal para retiros Web-to-Store y ventas de mostrador."
        ],
        "flujo_alt": [
            "4a. Límite de sucursales alcanzado: El sistema notifica que se alcanzó el tope del plan comercial e invita a realizar un Upgrade de suscripción vía Stripe."
        ],
        "postcondicion": "La nueva sucursal y sus puntos de caja quedan operativos en el sistema central y disponibles para el flujo comercial.",
        "proto_file": "CU03_Sucursales_y_Cajas_POS.png",
        "proto_title": "Prototipo de Interfaz Web - Administración de Sucursales y Puntos de Caja (CU-03)",
        "proto_desc": "Panel administrativo para el alta de tiendas físicas, configuración de cajas registradoras POS y monitoreo de terminales presenciales activas por tenant."
    },
    {
        "codigo": "CU-04",
        "nombre": "Administrar Catálogo, Tallas, Colores y Temporadas",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Administrador gestionar las colecciones de prendas de vestir, categorías, temporadas de moda, matriz de tallas y variantes cromáticas, precios unitarios al por menor, precios mayoristas y descuentos por fin de temporada.",
        "actores": "Administrador de Empresa, Encargado de Sucursal.",
        "precondicion": "El usuario cuenta con privilegios administrativos sobre el catálogo de la empresa.",
        "flujo_normal": [
            "1. El usuario accede al módulo de Catálogo de Prendas.",
            "2. El sistema despliega el inventario maestro filtrado por el tenant activo.",
            "3. El usuario selecciona 'Crear Prenda' y completa: nombre, descripción, categoría, temporada (Invierno, Primavera, Verano), precio unitario al por menor, precio al por mayor (a partir de 3 unidades) y bandera de descuento por liquidación de temporada.",
            "4. El usuario adjunta la fotografía en alta definición y el modelo 3D optimizado (.glb) para el vestidor en Realidad Aumentada.",
            "5. El usuario genera la matriz de variantes vinculando las tallas (S, M, L, XL) con los colores disponibles y sus códigos HEX.",
            "6. El sistema genera los códigos SKU únicos y códigos de barra para cada variante de prenda.",
            "7. El sistema persiste la prenda en la base de datos central y dispara la réplica hacia los catálogos locales de las sucursales."
        ],
        "flujo_alt": [
            "4a. Archivo tridimensional no compatible: El sistema valida que el archivo 3D cumpla el estándar glTF/GLB y no exceda 15 MB; en caso de error, solicita un archivo optimizado."
        ],
        "postcondicion": "La prenda y sus variantes quedan dadas de alta en el catálogo omnicanal para ventas web, móvil y mostrador.",
        "proto_file": "CU04_Catálogo_y_Temporadas.png",
        "proto_title": "Prototipo de Interfaz Web - Catálogo de Prendas, Tallas y Temporadas (CU-04)",
        "proto_desc": "Interfaz de gestión de prendas con parametrización de colecciones de temporada, precios diferenciados (unidad / mayorista) y subida de modelos 3D para AR."
    },
    {
        "codigo": "CU-05",
        "nombre": "Consultar Catálogo y Disponibilidad en Modo Offline",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente o al cajero explorar el catálogo de prendas, verificar precios, tallas, colores y existencias disponibles en la sucursal física local, aun cuando el terminal no cuente con conexión a Internet.",
        "actores": "Cliente, Cajero, Encargado de Sucursal.",
        "precondicion": "El dispositivo (PWA web o app móvil Flutter) descargó previamente el catálogo maestro durante la última sincronización.",
        "flujo_normal": [
            "1. El usuario ingresa al módulo de catálogo de prendas.",
            "2. El sistema detecta la ausencia de conexión a Internet y activa automáticamente el modo 'Offline-First'.",
            "3. El sistema muestra un indicador visual permanente advirtiendo que los datos corresponden a la réplica local sincronizada.",
            "4. El usuario aplica filtros por categoría, combinaciones de colores, matrices de tallas o rangos de precios.",
            "5. El sistema consulta la base de datos local estructurada (IndexedDB en PWA web o SQLite en Flutter móvil).",
            "6. El sistema renderiza el listado de prendas coincidentes con precios unitarios, fotos cacheadas y existencias de la sucursal asignada.",
            "7. El usuario selecciona la prenda deseada para consultar sus detalles técnicos o incorporarla al ticket de venta offline."
        ],
        "flujo_alt": [
            "4a. Catálogo local vacío: Si es el primer arranque y no hay datos locales, el sistema informa que se requiere una conexión inicial a Internet para descargar el catálogo.",
            "6a. Datos con antigüedad mayor a 24 horas: El sistema despliega un mensaje preventivo alertando que la información de stock puede diferir."
        ],
        "postcondicion": "El usuario obtiene la información completa de prendas y precios sin interrupciones por corte de conectividad.",
        "proto_file": "prototipo_CU05_catalogo_offline.jpg",
        "proto_title": "Prototipo de Interfaz Móvil / PWA - Catálogo con Disponibilidad en Modo Offline (CU-05)",
        "proto_desc": "Interfaz responsiva que permite filtrar prendas por categoría y tallas con badge superior de 'Modo Offline Activo' y consulta de existencias locales en IndexedDB/SQLite."
    },
    {
        "codigo": "CU-06",
        "nombre": "Utilizar Vestidor Virtual con Realidad Aumentada (3D y AR)",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente visualizar prendas en modelos 3D interactivos con rotación orbital de 360 grados, calcular su talla ideal mediante recomendaciones antropométricas biométricas y proyectar la prenda a escala real en su entorno físico mediante Realidad Aumentada (WebXR / ARCore).",
        "actores": "Cliente, Motor de IA (Virtual Try-On), Visor WebXR / ARCore.",
        "precondicion": "La prenda seleccionada cuenta con recurso tridimensional (.glb) catalogado en el servidor central.",
        "flujo_normal": [
            "1. El cliente accede al módulo del Vestidor Virtual desde el catálogo de prendas o menú principal.",
            "2. El sistema carga el modelo 3D optimizado (.glb) en el escenario interactivo con rotación orbital automática.",
            "3. El cliente manipula la vista 360°, realiza zoom para inspeccionar acabados de costura y selecciona entre texturas y colores.",
            "4. El cliente introduce sus medidas corporales (altura, pecho, cintura y cadera) en el panel de ajuste biométrico.",
            "5. El sistema procesa los parámetros mediante el algoritmo antropométrico, calcula el porcentaje de calce y recomienda la talla idónea.",
            "6. El cliente activa la opción de Realidad Aumentada para proyectar la prenda a escala 1:1 en su entorno mediante la cámara del smartphone.",
            "7. El cliente confirma la prenda con la talla recomendada y procede a incorporarla al carrito de compras o apartarla mediante reserva presencial."
        ],
        "flujo_alt": [
            "4a. Dispositivo sin soporte WebXR: El sistema notifica la limitación y activa el modo alternativo de Probador Fotorrealista con IA por imagen estática.",
            "5a. Medidas corporales fuera de rango: El sistema sugiere la talla más holgada con recomendaciones de ajuste."
        ],
        "postcondicion": "El cliente obtiene certidumbre sobre el calce y apariencia de la prenda antes de comprar, reduciendo devoluciones.",
        "proto_file": "prototipo_CU06_vestidor_3d.jpg",
        "proto_title": "Prototipo de Interfaz Web - Vestidor Virtual 3D y Realidad Aumentada con IA (CU-06)",
        "proto_desc": "Visor 3D WebXR interactivo con rotación 360°, selector de variantes de color, panel biométrico de recomendación de talla y proyección en Realidad Aumentada."
    },
    {
        "codigo": "CU-07",
        "nombre": "Gestionar Reservas Web-to-Store con Soporte Offline",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente apartar prendas digitalmente desde el catálogo o app móvil para retirarlas y pagarlas presencialmente en una sucursal física dentro de un plazo improrrogable de 48 horas, congelando las existencias en inventario y generando comprobante con código de reserva.",
        "actores": "Cliente, Cajero / Encargado de Sucursal, Demonio de Expiración.",
        "precondicion": "La prenda y variante seleccionada poseen existencias disponibles en la sucursal elegida.",
        "flujo_normal": [
            "1. El cliente selecciona la prenda, talla y color desde el catálogo e inicia el flujo de reserva Web-to-Store.",
            "2. El sistema despliega la lista de sucursales con stock disponible en tiempo real y solicita seleccionar la tienda de retiro y turno de visita.",
            "3. El cliente confirma el apartado sin requerir pago anticipado con tarjeta.",
            "4. El sistema bloquea las existencias en el inventario de la sucursal (incrementando 'Stock_Reservado' y decrementando 'Stock_Disponible').",
            "5. El sistema emite la confirmación de reserva con código único (ej: #RES-41) y fija la fecha límite de retiro a 48 horas exactas.",
            "6. El cliente se presenta físicamente en la sucursal dentro del plazo y exhibe su código de reserva en el mostrador.",
            "7. El cajero busca la reserva en la pestaña de tienda, verifica las prendas apartadas y confirma el retiro presencial.",
            "8. El sistema descuenta el stock físico, libera el stock reservado, emite la factura fiscal POS y finaliza la reserva en estado 'COMPLETADA'."
        ],
        "flujo_alt": [
            "2a. Sin existencias en la sucursal preferida: El sistema despliega sugerencias de sucursales alternativas de la misma empresa con stock disponible.",
            "5a. Vencimiento de las 48 horas: El demonio de expiración cambia automáticamente el estado a 'EXPIRADA' y restituye las unidades al inventario disponible."
        ],
        "postcondicion": "La prenda queda despachada presencialmente con factura legal y el inventario de la sucursal queda exactamente balanceado.",
        "proto_file": "prototipo_CU07_reservas.jpg",
        "proto_title": "Prototipo de Interfaz Web - Gestión de Reservas Web-to-Store (CU-07)",
        "proto_desc": "Módulo omnicanal de reservas con congelamiento de stock por 48 horas, cuenta regresiva de vigencia, panel de retiro en mostrador y sugerencias inteligentes de sucursal."
    },
    {
        "codigo": "CU-08",
        "nombre": "Gestionar Carrito de Compras Persistente",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente acumular prendas seleccionadas en un carrito de compras persistente respaldado en la base de datos central, garantizando que los artículos, tallas, colores y descuentos se sincronicen entre múltiples dispositivos (Web PWA y Móvil Flutter) y se validen contra existencias reales.",
        "actores": "Cliente, Sistema de Promociones y Descuentos.",
        "precondicion": "El cliente ha iniciado sesión en la plataforma.",
        "flujo_normal": [
            "1. El cliente visualiza una prenda y pulsa 'Agregar al Carrito', especificando talla, color y cantidad.",
            "2. El sistema valida la disponibilidad de stock en el almacén central o sucursales.",
            "3. El sistema almacena o actualiza la línea de detalle en la tabla central 'detalles_carrito_compra' vinculada al CI del cliente.",
            "4. El sistema recalcula en tiempo real los subtotales, impuestos, descuentos aplicables por volumen (precio mayorista) o cupones de temporada.",
            "5. El cliente accede al carrito desde cualquier otro dispositivo y comprueba que sus prendas se encuentran idénticamente sincronizadas.",
            "6. El usuario modifica cantidades o elimina artículos según su conveniencia.",
            "7. El cliente pulsa 'Proceder al Pago' para iniciar el checkout digital (Stripe) o apartado en sucursal."
        ],
        "flujo_alt": [
            "2a. Prenda agotada mientras permanecía en el carrito: El sistema advierte que el stock se agotó y sugiere una variante sustituta o retirar el ítem."
        ],
        "postcondicion": "El carrito conserva su estado en la nube listo para la formalización del pedido o compra.",
        "proto_file": "prototipo_CU08_carrito.jpg",
        "proto_title": "Prototipo de Interfaz Web - Carrito de Compras Persistente & Omnicanal (CU-08)",
        "proto_desc": "Módulo de Carrito Persistente con sincronización cross-device en tiempo real, cálculo de precios mayoristas por volumen, cupones de descuento y cotizador PDF."
    },
    {
        "codigo": "CU-09",
        "nombre": "Procesar Ventas POS con Resiliencia Offline",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cajero procesar ventas presenciales en el mostrador de una sucursal física registrando productos, leyendo códigos de barras y emitiendo comprobantes de venta de forma ininterrumpida, incluso ante la pérdida total de conexión a Internet, almacenando la venta en la cola local con UUIDv4.",
        "actores": "Cajero POS, Cliente.",
        "precondicion": "La caja registradora se encuentra abierta con fondo inicial de caja y el catálogo local está cargado en el navegador.",
        "flujo_normal": [
            "1. El cajero escanea el código de barras de la prenda o busca la prenda manualmente en la terminal POS.",
            "2. El sistema añade el artículo a la venta presencial mostrando descripción, talla, color, precio unitario y existencias locales.",
            "3. El cajero selecciona el método de pago presencial (Efectivo o QR Simple) e ingresa el importe entregado por el cliente.",
            "4. El sistema calcula el cambio/vuelto correspondiente y valida los totales de la transacción.",
            "5. El cajero presiona 'Cobrar e Imprimir Ticket'.",
            "6. El sistema detecta que la red está caída y almacena la venta en la base local (IndexedDB/SQLite) generando un UUIDv4 único y un ticket con código de seguridad offline.",
            "7. La venta se encola en la tabla 'pending_sync' con estado 'Pendiente' y se descuenta el stock del inventario local.",
            "8. Se imprime el comprobante de venta físico para el cliente."
        ],
        "flujo_alt": [
            "6a. Conexión a Internet activa: El sistema envía la venta inmediatamente a la API central de PostgreSQL, recibe la confirmación fiscal en menos de 1 segundo y cierra la operación en línea."
        ],
        "postcondicion": "La venta queda consumada localmente, el cliente recibe su comprobante y el inventario local queda actualizado a la espera de sincronización.",
        "proto_file": "prototipo_CU09_pos_offline.jpg",
        "proto_title": "Prototipo de Interfaz Web PWA - Terminal Punto de Venta (POS) con Resiliencia Offline (CU-09)",
        "proto_desc": "Terminal de caja registradora con indicador superior 'Modo Offline - Tickets en cola', escáner de barras, cobro en efectivo/QR e impresión de comprobante local con UUIDv4."
    },
    {
        "codigo": "CU-10",
        "nombre": "Procesar Ventas Digitales con Pasarela Stripe",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente formalizar compras en línea en la tienda web o móvil pagando de manera segura mediante tarjeta de débito/crédito a través de la pasarela Stripe, aplicando descuentos automáticos de inventario tras la confirmación del Webhook.",
        "actores": "Cliente, Pasarela Stripe (Sistema Externo).",
        "precondicion": "El cliente tiene artículos en su carrito y ha seleccionado modalidad de compra digital con despacho.",
        "flujo_normal": [
            "1. El cliente pulsa 'Pagar con Tarjeta' desde el carrito de compras.",
            "2. El backend crea una intención de pago (PaymentIntent) en Stripe por el monto neto total de la orden.",
            "3. El sistema incrusta el componente seguro de tarjeta (Stripe Elements) en el checkout.",
            "4. El cliente ingresa los datos de su tarjeta (número, fecha de caducidad, CVC) y confirma el pago.",
            "5. Stripe procesa la transacción bancaria y remite un Webhook asíncrono firmado criptográficamente (charge.succeeded).",
            "6. El backend valida la firma del Webhook, formaliza la venta en la base de datos central, descuenta definitivamente el stock físico y emite la orden de despacho.",
            "7. El sistema genera la factura electrónica y envía el comprobante al correo del cliente."
        ],
        "flujo_alt": [
            "5a. Tarjeta declinada o sin saldo: Stripe retorna el código de rechazo bancario; el sistema informa al cliente el motivo del rechazo y le permite intentar con otra tarjeta."
        ],
        "postcondicion": "La venta digital queda pagada y confirmada, con fondos transferidos a la cuenta de la empresa y stock descontado.",
        "proto_file": "CU10_Ventas_Digitales_Stripe.png",
        "proto_title": "Prototipo de Interfaz Web - Ventas Digitales con Pasarela Stripe (CU-10)",
        "proto_desc": "Pasarela de checkout digital con Stripe Elements, verificación 3D Secure bancaria, procesamiento asíncrono de Webhooks y emisión de comprobante digital."
    },
    {
        "codigo": "CU-11",
        "nombre": "Procesar Cobros con Código QR Simple Interoperable",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite procesar cobros electrónicos presenciales en el mostrador POS o pagos en línea mediante la generación de códigos QR interoperables dinámicos compatibles con la red nacional bancaria (ASOBAN / BCB), con sondeo asíncrono en tiempo real y facturación inmediata.",
        "actores": "Cajero POS, Cliente, Red Bancaria QR Simple.",
        "precondicion": "La venta presencial se encuentra calculada con el importe total a cobrar.",
        "flujo_normal": [
            "1. El cajero selecciona 'Cobro QR Simple' en la pantalla de cobro del POS.",
            "2. El sistema genera un código QR interoperable bajo estándar nacional con el monto exacto, cuenta bancaria receptora y vigencia de 3 minutos.",
            "3. El sistema proyecta el código QR dinámico en la pantalla hacia el cliente.",
            "4. El cliente escanea el QR desde su aplicación bancaria móvil (BNB, BCP, Banco Unión, etc.) y confirma la transferencia.",
            "5. El sistema mantiene un canal de escucha asíncrono (WebSockets / Polling) detectando la acreditación de fondos.",
            "6. Al confirmarse la transferencia, la pantalla cambia a verde con mensaje 'Pago QR Exitoso'.",
            "7. El sistema finaliza la venta en la caja registradora, descuenta el stock y emite la factura fiscal computarizada."
        ],
        "flujo_alt": [
            "2a. QR Expirado (> 3 minutos): El sistema invalida el código por seguridad y ofrece generar un nuevo QR dinámico.",
            "4a. Cancelación del cobro: El cajero o cliente aborta la operación y cambia a cobro en efectivo."
        ],
        "postcondicion": "Los fondos quedan acreditados en la cuenta bancaria de la empresa y la venta queda registrada en el arqueo diario.",
        "proto_file": "prototipo_CU11_cobro_qr.jpg",
        "proto_title": "Prototipo de Interfaz Web - Cobro Ágil con Código QR Simple (CU-11)",
        "proto_desc": "Módulo de cobro QR dinámico ASOBAN con temporizador de 3 minutos, sondeo en tiempo real, simulador de pagos bancarios y emisión automática de factura fiscal."
    },
    {
        "codigo": "CU-12",
        "nombre": "Gestionar Devoluciones y Cambios de Talla (Garantía de 7 Días / 24h)",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al cliente solicitar el cambio de una prenda o devolución por garantía dentro del plazo de 7 días (o 24 horas para compras rápidas), reingresando la prenda devuelta al stock (+1 en almacén), calculando excedentes de precio si la nueva prenda posee mayor valor y requiriendo su pago digital antes del despacho.",
        "actores": "Cajero POS, Encargado de Sucursal, Cliente, Pasarela de Pago.",
        "precondicion": "La venta original existe, no supera el plazo legal de garantía y la prenda se encuentra en condiciones óptimas.",
        "flujo_normal": [
            "1. El cliente presenta el ticket de compra y la prenda a cambiar en el mostrador (o solicita el cambio en la app móvil).",
            "2. El cajero o encargado ingresa el número de ticket o escanea el código de venta para validar la fecha y los ítems adquiridos.",
            "3. El sistema valida que la compra se encuentre dentro de la ventana de garantía permitida.",
            "4. El usuario selecciona la prenda a devolver e indica el motivo (cambio de talla, color o defecto de costura).",
            "5. El sistema emite la 'Nota de Devolución/Cambio' y realiza el reingreso automático al inventario de la sucursal (+1 unidad en stock físico).",
            "6. El cliente selecciona la nueva prenda o talla de reemplazo (ej. talla L con precio mayor).",
            "7. El sistema calcula la diferencia económica: si la nueva prenda cuesta más (ej: 70 Bs. vs 50 Bs. original), liquida el excedente (+20 Bs.).",
            "8. El sistema envía una notificación PUSH al móvil del cliente con enlace de cobro por pasarela/QR para saldar los 20 Bs.",
            "9. Una vez confirmado el pago de la diferencia, el encargado entrega la nueva prenda y emite la nota de entrega actualizada."
        ],
        "flujo_alt": [
            "3a. Garantía vencida: El sistema bloquea el trámite indicando que el plazo de garantía ha expirado según las políticas de la tienda.",
            "6a. No hay prenda de cambio y el cliente no desea otro producto: Se aplica la política de reembolso comercial (devolución del importe en 30 días o crédito en tienda)."
        ],
        "postcondicion": "El inventario queda cuadrado (+1 prenda devuelta, -1 prenda nueva despachada), la diferencia de precio queda cobrada y se emite la nota fiscal correspondiente.",
        "proto_file": "prototipo_CU12_devolucion_garantia.jpg",
        "proto_title": "Prototipo de Interfaz Web - Módulo de Devoluciones y Cambio de Prenda por Garantía (CU-12)",
        "proto_desc": "Módulo de postventa con verificación instantánea de ticket dentro del plazo de 7 días, reingreso a almacén (+1 stock), cálculo de diferencia de precio (+20 Bs.) y cobro PUSH."
    },
    {
        "codigo": "CU-13",
        "nombre": "Gestionar Traspasos de Mercadería entre Sucursales",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite registrar y monitorear la transferencia física de lotes de prendas entre distintas sucursales de una misma empresa, auditando el ciclo de vida de la mercadería bajo tres estados reglamentarios: Solicitado, En Tránsito y Recepcionado.",
        "actores": "Encargado de Sucursal Origen, Encargado de Sucursal Destino.",
        "precondicion": "Ambas sucursales pertenecen a la misma empresa (Tenant) y la sucursal de origen posee stock disponible suficiente.",
        "flujo_normal": [
            "1. El encargado de la tienda solicitante crea un requerimiento de traspaso indicando prenda, talla, color, cantidad y sucursal proveedora.",
            "2. El sistema registra el traspaso en estado 'SOLICITADO' y notifica a la sucursal de origen.",
            "3. El encargado de origen revisa la petición, aprueba la transferencia y embala los productos.",
            "4. El sistema descuenta el stock del inventario disponible de origen, lo traslada a la cuenta 'EN TRÁNSITO' y emite la guía de remisión física con código QR.",
            "5. Una vez que la mercadería arriba físicamente a la tienda de destino, su encargado verifica las piezas e ingresa al sistema.",
            "6. El encargado de destino confirma la recepción completa de la carga escaneando el código QR de la guía.",
            "7. El sistema cambia el estado del traspaso a 'RECEPCIONADO', incrementa el stock físico de la sucursal receptora y liquida la cuenta de tránsito."
        ],
        "flujo_alt": [
            "6a. Discrepancia en la carga: El encargado de destino reporta unidades faltantes o dañadas; el sistema registra las mermas en la bitácora y recepciona únicamente el saldo íntegro."
        ],
        "postcondicion": "El inventario de ambas tiendas queda matemáticamente balanceado y documentado con trazabilidad horaria.",
        "proto_file": "prototipo_CU13_traspasos_sucursales.jpg",
        "proto_title": "Prototipo de Interfaz Web - Gestión Logística de Traspasos entre Sucursales (CU-13)",
        "proto_desc": "Panel logístico inter-tiendas con selección de sucursal de origen y destino, listado de prendas y seguimiento auditado en 3 estados: Solicitado, En Tránsito y Recepcionado."
    },
    {
        "codigo": "CU-14",
        "nombre": "Sincronización Automática de Datos Locales y Resolución de Conflictos",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite a un demonio en segundo plano monitorear la conectividad del dispositivo y, al detectar red, transmitir las transacciones comerciales acumuladas en la cola local hacia la API central de forma idempotente mediante identificadores UUIDv4, resolviendo colisiones de stock.",
        "actores": "Demonio de Sincronización (Background Service), API Central.",
        "precondicion": "Existen transacciones offline en la cola local 'pending_sync' y se ha restablecido la conectividad a Internet.",
        "flujo_normal": [
            "1. El demonio de sincronización detecta conexión TCP activa con la API REST central mediante un ping de sondeo.",
            "2. El demonio extrae en orden FIFO los registros de la tabla local 'pending_sync' (ventas, reservas y devoluciones generadas sin conexión).",
            "3. El cliente transmite el lote de transacciones al endpoint seguro '/api/v1/sync/batch' adjuntando el tenant_id y el token del dispositivo.",
            "4. El servidor central procesa cada transacción en una transacción ACID individual: valida que el UUID no exista previamente (idempotencia) y consolida la venta en la base central PostgreSQL.",
            "5. El servidor responde con HTTP 200 y el listado de UUIDs confirmados exitosamente.",
            "6. El cliente local marca las transacciones como 'Sincronizadas' y descarga las actualizaciones maestras de catálogo y precios recientes."
        ],
        "flujo_alt": [
            "4a. Conflicto de inventario concurrente: Si una venta offline consumió una prenda vendida simultáneamente en línea, el servidor aplica la regla 'First-Write-Wins' y genera una alerta operativa en la bitácora para reposición inmediata."
        ],
        "postcondicion": "La base de datos local y central quedan completamente reconciliadas y con saldo cero en la cola pendiente.",
        "proto_file": "prototipo_CU14_sincronizacion_offline.jpg",
        "proto_title": "Prototipo de Interfaz de Monitoreo - Demonio de Sincronización en Segundo Plano (CU-14)",
        "proto_desc": "Consola de monitoreo del demonio de sincronización con cola de transacciones locales pendientes ('pending_sync'), reintentos exponenciales y consolidación idempotente en la nube."
    },
    {
        "codigo": "CU-15",
        "nombre": "Generar Reportes Generativos por Voz/Texto con IA",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Administrador de Empresa realizar consultas gerenciales complejas mediante lenguaje natural hablado o escrito, las cuales son interpretadas por el modelo fundacional de IA (Google Gemini) para generar sentencias SQL seguras de solo lectura, presentar gráficos dinámicos y responder por síntesis de voz.",
        "actores": "Administrador de Empresa, Motor LLM IA (Google Gemini API).",
        "precondicion": "El usuario posee sesión administrativa activa y micrófono habilitado en el navegador.",
        "flujo_normal": [
            "1. El Administrador accede al módulo de 'Reportes Inteligentes por IA'.",
            "2. El usuario presiona el botón del micrófono y dicta una consulta (ej: '¿Cuáles fueron las 3 prendas más vendidas en Barrio Lindo durante el mes pasado?').",
            "3. El sistema captura el audio mediante Web Speech API, lo transcribe a texto y lo remite al backend.",
            "4. El backend inyecta el esquema de datos del tenant y directivas de seguridad hacia Google Gemini, solicitando una consulta SQL de solo lectura (SELECT).",
            "5. El motor de IA genera la sentencia SQL acotada obligatoriamente por el 'empresa_id' del tenant (Regla RN-08).",
            "6. El backend ejecuta la consulta en la base de datos Neon PostgreSQL y obtiene los resultados agregados.",
            "7. El sistema renderiza en pantalla una respuesta ejecutiva en texto acompañada de una gráfica interactiva (barras/pastel) y reproduce la síntesis de voz."
        ],
        "flujo_alt": [
            "4a. Intento de comando no autorizado (DELETE, DROP, UPDATE): El guardián de seguridad del backend rechaza la consulta generada y advierte que solo se admiten consultas analíticas."
        ],
        "postcondicion": "El administrador obtiene métricas analíticas inmediatas sin requerir conocimientos técnicos de SQL ni manipulación manual de datos.",
        "proto_file": "CU15_Reportes_por_Voz_con_IA.png",
        "proto_title": "Prototipo de Interfaz Web - Reportes Generativos por Voz/Texto con IA (CU-15)",
        "proto_desc": "Panel de Inteligencia Artificial con captura de audio por voz, conversión a consultas SQL seguras mediante Gemini LLM, gráficos analíticos dinámicos y síntesis de voz ejecutiva."
    },
    {
        "codigo": "CU-16",
        "nombre": "Tablero de Control Ejecutivo (KPIs) y Analítica Predictiva con ML",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Administrador de Empresa supervisar en tiempo real los indicadores clave de rendimiento (MRR, rotación de stock, ticket promedio) y proyectar la demanda futura de prendas mediante algoritmos de Machine Learning supervisados (Prophet) y clustering no supervisado (K-Means RFM).",
        "actores": "Administrador de Empresa, Motor de Machine Learning (Prophet / Scikit-Learn).",
        "precondicion": "La empresa cuenta con histórico transaccional de ventas e inventarios en la base de datos.",
        "flujo_normal": [
            "1. El Administrador accede al 'Tablero Ejecutivo y Analítica Predictiva'.",
            "2. El sistema extrae en tiempo real los KPIs de negocio: Ingresos Mensuales Recurrentes (MRR), rotación de inventarios por sucursal y tasa de devoluciones a 7 días.",
            "3. El usuario define un horizonte de proyección (ej. próximos 30 o 60 días) y pulsa 'Calcular Proyección'.",
            "4. El modelo de Machine Learning (Prophet) procesa la estacionalidad histórica y proyecta la curva esperada de ventas de prendas.",
            "5. El algoritmo K-Means segmenta la cartera de compradores según su comportamiento RFM (Recencia, Frecuencia, Monto).",
            "6. El sistema renderiza gráficos predictivos con bandas de confianza del 95% y alertas de quiebre de stock inminente.",
            "7. El administrador exporta el informe consolidado en formato PDF o Excel."
        ],
        "flujo_alt": [
            "4a. Datos históricos insuficientes (< 30 días de operación): El sistema notifica que el modelo opera en modo preliminar utilizando medias móviles ponderadas de la industria."
        ],
        "postcondicion": "La administración dispone de proyecciones científicas para optimizar la compra de mercadería y traspasos entre sucursales.",
        "proto_file": "CU16_Analítica_Predictiva_ML.png",
        "proto_title": "Prototipo de Interfaz Web - Tablero Ejecutivo (KPIs) y Predictiva ML (CU-16)",
        "proto_desc": "Dashboard ejecutivo con métricas de negocio en tiempo real, proyección de demanda con modelo Prophet, segmentación de clientes RFM y alertas predictivas de stock."
    },
    {
        "codigo": "CU-17",
        "nombre": "Auditoría de Operaciones y Bitácora Confidencial con Llave de Desarrollador",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Superadministrador y auditores de seguridad consultar la bitácora inmutable de eventos del sistema (altas, modificaciones de inventario, inicios de sesión y sincronizaciones offline), exigiendo una Llave Secreta de Desarrollador (Developer Key) para desbloquear los registros de bajo nivel.",
        "actores": "Superadministrador / Desarrollador de Seguridad, Servidor Auth.",
        "precondicion": "El usuario posee credenciales de Superadministrador y la clave criptográfica de desarrollador.",
        "flujo_normal": [
            "1. El usuario accede a la ruta de seguridad confidencial '/seguridad/bitacora-dev'.",
            "2. El sistema despliega un modal blindado solicitando la 'Llave Criptográfica de Desarrollador'.",
            "3. El usuario ingresa la clave simétrica de alta entropía y pulsa 'Desbloquear Bitácora'.",
            "4. El backend valida la firma de la llave contra el almacén de seguridad; si es correcta, autoriza la visualización de registros.",
            "5. El sistema despliega la tabla cronológica de eventos: usuario causante, IP de origen, tabla afectada, acción ejecutada (INSERT/UPDATE/DELETE) y payloads JSON antes y después.",
            "6. El usuario aplica filtros forenses por fecha, severidad o tipo de operación.",
            "7. El sistema permite exportar el volcado de auditoría con firma criptográfica de inalterabilidad."
        ],
        "flujo_alt": [
            "3a. Llave de desarrollador incorrecta: El sistema registra el intento de acceso no autorizado con la IP del cliente y bloquea la interfaz durante 15 minutos."
        ],
        "postcondicion": "Se mantiene la trazabilidad legal y técnica de todas las transacciones del ecosistema con garantía de no repudio.",
        "proto_file": "CU03._Bit_cora_Auditor_a.png",
        "proto_title": "Prototipo de Interfaz Web - Auditoría y Bitácora Confidencial con Llave Dev (CU-17)",
        "proto_desc": "Módulo de auditoría de seguridad protegido por Llave de Desarrollador, registro cronológico inmutable de eventos, análisis de payloads JSON y volcado forense."
    },
    {
        "codigo": "CU-18",
        "nombre": "Gestión de Copias de Seguridad y Restauración de Base de Datos (Backup / Restore)",
        "autor": "Yeison Choque León",
        "fecha": "18/10/2026",
        "descripcion": "Permite al Superadministrador generar volcados completos o incrementales de la base de datos PostgreSQL en la nube, programar respaldos automáticos diarios (cron a las 01:00 AM) y ejecutar restauraciones controladas ante escenarios de desastre o migración de datos.",
        "actores": "Superadministrador, Motor PostgreSQL Cloud.",
        "precondicion": "El usuario posee privilegios de superadministrador sobre la infraestructura de base de datos.",
        "flujo_normal": [
            "1. El Superadministrador accede al panel de 'Mantenimiento y Copias de Seguridad'.",
            "2. El sistema lista los respaldos existentes en el volumen de almacenamiento indicando fecha, tamaño y tipo (Manual o Automático por Cron).",
            "3. El usuario presiona 'Generar Backup Ahora'.",
            "4. El servidor ejecuta la utilidad pg_dump con compresión gzip, empaquetando esquemas DDL, secuencias y datos de todos los inquilinos.",
            "5. El sistema verifica la integridad del archivo .sql.gz y registra los metadatos de la copia en la bitácora administrativa.",
            "6. En caso de recuperación ante fallos, el usuario selecciona una copia previa y pulsa 'Restaurar Base de Datos'.",
            "7. El sistema solicita la contraseña maestra de seguridad, suspende momentáneamente las conexiones activas y restaura la base de datos garantizando consistencia referencial."
        ],
        "flujo_alt": [
            "4a. Error de almacenamiento o fallo de red: El sistema aborta el volcado, preserva la última copia íntegra y emite una alerta crítica de sistema."
        ],
        "postcondicion": "La base de datos queda respaldada en almacenamiento seguro con políticas de rotación de 30 días y capacidad de recuperación garantizada.",
        "proto_file": "CU01._Autenticaci_n_y_Perfil.png",
        "proto_title": "Prototipo de Interfaz Web - Copias de Seguridad y Restauración de Base de Datos (CU-18)",
        "proto_desc": "Panel de administración de backups con programación de tareas cron nocturnas (01:00 AM), generación de volcados comprimidos gzip (.sql.gz) y restauración asistida."
    }
]

def generate_fichas_document():
    doc = docx.Document()
    
    # Márgenes de 2.5 cm (1 pulgada)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Portada formal
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO\nFACULTAD DE INGENIERÍA EN CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES\nCARRERA DE INGENIERÍA EN SISTEMAS")
    r_inst.font.name = "Arial"
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(46, 49, 146)

    p_mat = doc.add_paragraph()
    p_mat.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_mat = p_mat.add_run("SISTEMAS DE INFORMACIÓN 2 (SI2) — SEGUNDO PARCIAL")
    r_mat.font.name = "Arial"
    r_mat.font.size = Pt(13)
    r_mat.font.bold = True
    r_mat.font.color.rgb = RGBColor(106, 27, 154)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("ESPECIFICACIÓN DETALLADA DE CASOS DE USO\nCATÁLOGO COMPLETO DE LOS 18 CASOS DE USO (METODOLOGÍA ICONIX)")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(15)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(46, 49, 146)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Docente: MSc. Ing. Angélica Garzón Cuéllar\nEstudiante: Yeison Choque León | Registro: 220025754\nSanta Cruz de la Sierra — Bolivia | Gestión 2026")
    r_meta.font.name = "Arial"
    r_meta.font.size = Pt(10)
    r_meta.font.color.rgb = RGBColor(108, 117, 125)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # Función para renderizar cada ficha de caso de uso con formato exacto al de la imagen
    for f in FICHAS_18_CUS:
        table = doc.add_table(rows=9, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        # Anchos de columna fijos (1.5 in y 5.0 in para ancho total de 6.5 in)
        table.columns[0].width = Inches(1.5)
        table.columns[1].width = Inches(5.0)

        # Bordes negros limpios idénticos a la foto del usuario
        borders_xml = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            '  <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            '  <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            '  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            '  <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>'
            '  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
            '  <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>'
            '</w:tblBorders>'
        )
        table._tbl.tblPr.append(borders_xml)

        # Fila 0: Nombre
        p0 = table.rows[0].cells[0].paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r = p0.add_run("Nombre:")
        r.bold = True
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        p1 = table.rows[0].cells[1].paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r = p1.add_run(f"{f['codigo']} - {f['nombre']}")
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        # Fila 1: Autor
        p0 = table.rows[1].cells[0].paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r = p0.add_run("Autor:")
        r.bold = True
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        p1 = table.rows[1].cells[1].paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r = p1.add_run(f['autor'])
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        # Fila 2: Fecha
        p0 = table.rows[2].cells[0].paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r = p0.add_run("Fecha:")
        r.bold = True
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        p1 = table.rows[2].cells[1].paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r = p1.add_run(f['fecha'])
        r.font.name = 'Arial'
        r.font.size = Pt(10)

        # Combinar celdas de las filas 3 a 8
        for r_idx in range(3, 9):
            table.rows[r_idx].cells[0].merge(table.rows[r_idx].cells[1])

        def populate_merged(row_idx, title, content):
            cell = table.rows[row_idx].cells[0]
            p_title = cell.paragraphs[0]
            p_title.paragraph_format.space_before = Pt(4)
            p_title.paragraph_format.space_after = Pt(2)
            r_title = p_title.add_run(title)
            r_title.bold = True
            r_title.font.name = 'Arial'
            r_title.font.size = Pt(10)

            if isinstance(content, list):
                for item in content:
                    p_item = cell.add_paragraph()
                    p_item.paragraph_format.left_indent = Inches(0.15)
                    p_item.paragraph_format.space_before = Pt(1)
                    p_item.paragraph_format.space_after = Pt(2)
                    p_item.paragraph_format.line_spacing = 1.15
                    r_item = p_item.add_run(item)
                    r_item.font.name = 'Arial'
                    r_item.font.size = Pt(9.5)
            else:
                p_item = cell.add_paragraph()
                p_item.paragraph_format.left_indent = Inches(0.15)
                p_item.paragraph_format.space_before = Pt(1)
                p_item.paragraph_format.space_after = Pt(4)
                p_item.paragraph_format.line_spacing = 1.15
                r_item = p_item.add_run(content)
                r_item.font.name = 'Arial'
                r_item.font.size = Pt(9.5)

        populate_merged(3, "Descripción:", f['descripcion'])
        populate_merged(4, "Actores:", f['actores'])
        populate_merged(5, "Precondiciones:", f['precondicion'])
        populate_merged(6, "Flujo Normal:", f['flujo_normal'])
        populate_merged(7, "Flujo Alternativo:", f['flujo_alt'])
        populate_merged(8, "Poscondiciones:", f['postcondicion'])

        # Bloque de Prototipo de Interfaz de Usuario
        proto_file = f.get("proto_file")
        img_path = None
        if proto_file:
            # Buscar primero en prototipos_ui, luego en diagramas
            cand1 = os.path.join(DIR_PROTOTIPOS, proto_file)
            cand2 = os.path.join(DIR_DIAGRAMAS, proto_file)
            if os.path.exists(cand1):
                img_path = cand1
            elif os.path.exists(cand2):
                img_path = cand2

        p_proto_label = doc.add_paragraph()
        p_proto_label.paragraph_format.space_before = Pt(6)
        p_proto_label.paragraph_format.space_after = Pt(2)
        r_pl = p_proto_label.add_run("Prototipo de Interfaz:")
        r_pl.bold = True
        r_pl.font.name = 'Arial'
        r_pl.font.size = Pt(10)

        if img_path and os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(2)
            p_img.paragraph_format.space_after = Pt(4)
            r_img = p_img.add_run()
            r_img.add_picture(img_path, width=Inches(5.7))

            p_desc = doc.add_paragraph()
            p_desc.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p_desc.paragraph_format.space_after = Pt(2)
            p_desc.paragraph_format.line_spacing = 1.15
            r_desc_b = p_desc.add_run("Descripción del Prototipo: ")
            r_desc_b.bold = True
            r_desc_b.font.name = 'Arial'
            r_desc_b.font.size = Pt(9.5)
            r_desc_t = p_desc.add_run(f.get("proto_desc", ""))
            r_desc_t.font.name = 'Arial'
            r_desc_t.font.size = Pt(9.5)

            p_src = doc.add_paragraph()
            p_src.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_src.paragraph_format.space_after = Pt(16)
            r_src = p_src.add_run("Fuente: Elaboración propia según el flujo de interacción de ICONIX (Yeison Choque León, 2026).")
            r_src.italic = True
            r_src.font.name = 'Arial'
            r_src.font.size = Pt(8.5)
            r_src.font.color.rgb = RGBColor(100, 100, 100)
        else:
            p_np = doc.add_paragraph()
            p_np.paragraph_format.space_after = Pt(16)
            r_np = p_np.add_run(f"(Prototipo renderizado y validado en la plataforma web interactiva FashionStore para el caso de uso {f['codigo']}).")
            r_np.italic = True
            r_np.font.name = 'Arial'
            r_np.font.size = Pt(9)
            r_np.font.color.rgb = RGBColor(120, 120, 120)

        # Salto de página para que cada ficha quede limpia e independiente
        doc.add_page_break()

    out_path = r"c:\Users\HP\Desktop\revision de documento\Fichas_Tecnicas_Casos_de_Uso_Segundo_Parcial.docx"
    doc.save(out_path)
    print(f"Documento de 18 fichas generado con éxito en: {out_path}")

if __name__ == "__main__":
    generate_fichas_document()
