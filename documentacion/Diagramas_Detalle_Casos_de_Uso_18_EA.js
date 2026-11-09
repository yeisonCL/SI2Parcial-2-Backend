//!INC Local Scripts.EAConstants-JScript
/*
 * ==============================================================================
 * PROYECTO: FashionStore SaaS (E-commerce Multitienda de Moda)
 * MODULO: Diagramas de Detalle / Especificación de Casos de Uso (18 CUs Oficiales)
 * CÁTEDRA: Sistemas de Información II - MSc. Ing. Angélica Garzón Cuéllar
 * 
 * FORMATO OFICIAL:
 *   - Actor a la izquierda conectado con asociación sólida al caso de uso base.
 *   - Óvalo principal centrado.
 *   - Subcasos a la derecha vinculados con conectores de dependencia «include» o «extend».
 * ==============================================================================
 */

function crearElemento(pkg, diag, nombre, tipo, left, top, width, height) {
    var elem = pkg.Elements.AddNew(nombre, tipo);
    elem.Update();
    var right = left + width;
    var bottom = top - height;
    var coords = "l=" + left + ";r=" + right + ";t=" + top + ";b=" + bottom + ";";
    var diagObj = diag.DiagramObjects.AddNew(coords, "");
    diagObj.ElementID = elem.ElementID;
    diagObj.Update();
    return elem;
}

function conectarSubcaso(origen, destino, estereotipo) {
    var con = origen.Connectors.AddNew("", "Dependency");
    con.SupplierID = destino.ElementID;
    con.Stereotype = estereotipo;
    con.Direction = "Source -> Destination";
    con.Update();
    origen.Connectors.Refresh();
    return con;
}

function conectarActor(actor, cuPrincipal) {
    var con = actor.Connectors.AddNew("", "Association");
    con.SupplierID = cuPrincipal.ElementID;
    con.Direction = "Unspecified";
    con.Update();
    actor.Connectors.Refresh();
    return con;
}

function main() {
    Repository.EnsureOutputVisible("Script");
    Repository.WriteOutput("Script", "==========================================================", 0);
    Repository.WriteOutput("Script", "=== GENERANDO LOS 18 DIAGRAMAS DE DETALLE DE CASOS DE USO ==", 0);
    Repository.WriteOutput("Script", "==========================================================", 0);

    var currentPackage = Repository.GetTreeSelectedPackage();
    if (currentPackage == null) {
        Session.Prompt("Por favor seleccione un Paquete en el Project Browser antes de ejecutar.", 0);
        return;
    }

    var rootDetalle = currentPackage.Packages.AddNew("Diagramas Detalle Casos de Uso (18 CUs)", "Package");
    rootDetalle.Update();

    // ----------------------------------------------------
    // CU01: CU01. Registrar Empresa y Contratar Suscripción SaaS (Stripe)
    // ----------------------------------------------------
    var pkg_CU01 = rootDetalle.Packages.AddNew("CU01 - Detalle", "Package");
    pkg_CU01.Update();
    var diag_CU01 = pkg_CU01.Diagrams.AddNew("Detalle CU01", "Use Case");
    diag_CU01.Update();

    var act_CU01 = crearElemento(pkg_CU01, diag_CU01, "Administrador de Empresa", "Actor", 80, -220, 60, 90);
    var main_CU01 = crearElemento(pkg_CU01, diag_CU01, "CU01. Registrar Empresa y Contratar Suscripción SaaS (Stripe)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU01, main_CU01);
    var sub_CU01_0 = crearElemento(pkg_CU01, diag_CU01, "Ingresar datos de empresa Razón Social NIT y Subdominio", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU01, sub_CU01_0, "include");
    var sub_CU01_1 = crearElemento(pkg_CU01, diag_CU01, "Seleccionar plan comercial SaaS Básico Profesional o Enterprise", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU01, sub_CU01_1, "include");
    var sub_CU01_2 = crearElemento(pkg_CU01, diag_CU01, "Procesar cobro recurrente con Stripe Elements en pasarela", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU01, sub_CU01_2, "include");
    var sub_CU01_3 = crearElemento(pkg_CU01, diag_CU01, "Activar Tenant y aprovisionar credenciales de bienvenida", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU01, sub_CU01_3, "include");
    var sub_CU01_4 = crearElemento(pkg_CU01, diag_CU01, "Rechazar registro por tarjeta denegada o fondos insuficientes", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU01, sub_CU01_4, "extend");

    diag_CU01.Update();
    try { Repository.ReloadDiagram(diag_CU01.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU01 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU02: CU02. Autenticación y Control de Acceso Multitenant (JWT)
    // ----------------------------------------------------
    var pkg_CU02 = rootDetalle.Packages.AddNew("CU02 - Detalle", "Package");
    pkg_CU02.Update();
    var diag_CU02 = pkg_CU02.Diagrams.AddNew("Detalle CU02", "Use Case");
    diag_CU02.Update();

    var act_CU02 = crearElemento(pkg_CU02, diag_CU02, "Usuario / Empleado", "Actor", 80, -220, 60, 90);
    var main_CU02 = crearElemento(pkg_CU02, diag_CU02, "CU02. Autenticación y Control de Acceso Multitenant (JWT)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU02, main_CU02);
    var sub_CU02_0 = crearElemento(pkg_CU02, diag_CU02, "Validar credenciales correo y contraseña cifrada con bcrypt", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU02, sub_CU02_0, "include");
    var sub_CU02_1 = crearElemento(pkg_CU02, diag_CU02, "Generar token JWT con tenant_id y permisos RBAC", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU02, sub_CU02_1, "include");
    var sub_CU02_2 = crearElemento(pkg_CU02, diag_CU02, "Filtrar vistas, botones e inputs según rol y sucursal activa", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU02, sub_CU02_2, "include");
    var sub_CU02_3 = crearElemento(pkg_CU02, diag_CU02, "Bloquear acceso tras superar 5 intentos fallidos continuos", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU02, sub_CU02_3, "extend");

    diag_CU02.Update();
    try { Repository.ReloadDiagram(diag_CU02.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU02 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU03: CU03. Administrar Sucursales y Puntos de Caja por Empresa
    // ----------------------------------------------------
    var pkg_CU03 = rootDetalle.Packages.AddNew("CU03 - Detalle", "Package");
    pkg_CU03.Update();
    var diag_CU03 = pkg_CU03.Diagrams.AddNew("Detalle CU03", "Use Case");
    diag_CU03.Update();

    var act_CU03 = crearElemento(pkg_CU03, diag_CU03, "Administrador de Empresa", "Actor", 80, -220, 60, 90);
    var main_CU03 = crearElemento(pkg_CU03, diag_CU03, "CU03. Administrar Sucursales y Puntos de Caja por Empresa", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU03, main_CU03);
    var sub_CU03_0 = crearElemento(pkg_CU03, diag_CU03, "Registrar nueva sucursal con dirección geolocalizada y teléfono", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU03, sub_CU03_0, "include");
    var sub_CU03_1 = crearElemento(pkg_CU03, diag_CU03, "Habilitar terminales de caja POS y asignar personal cajero de turno", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU03, sub_CU03_1, "include");
    var sub_CU03_2 = crearElemento(pkg_CU03, diag_CU03, "Verificar cuota de sucursales según plan SaaS contratado", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU03, sub_CU03_2, "include");
    var sub_CU03_3 = crearElemento(pkg_CU03, diag_CU03, "Bloquear creación de sucursal por límite de cuota alcanzado", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU03, sub_CU03_3, "extend");

    diag_CU03.Update();
    try { Repository.ReloadDiagram(diag_CU03.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU03 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU04: CU04. Administrar Catálogo, Tallas, Colores y Temporadas
    // ----------------------------------------------------
    var pkg_CU04 = rootDetalle.Packages.AddNew("CU04 - Detalle", "Package");
    pkg_CU04.Update();
    var diag_CU04 = pkg_CU04.Diagrams.AddNew("Detalle CU04", "Use Case");
    diag_CU04.Update();

    var act_CU04 = crearElemento(pkg_CU04, diag_CU04, "Administrador de Empresa", "Actor", 80, -220, 60, 90);
    var main_CU04 = crearElemento(pkg_CU04, diag_CU04, "CU04. Administrar Catálogo Tallas, Colores y Temporadas", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU04, main_CU04);
    var sub_CU04_0 = crearElemento(pkg_CU04, diag_CU04, "Registrar prenda precio base y variantes cromáticas y de talla", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU04, sub_CU04_0, "include");
    var sub_CU04_1 = crearElemento(pkg_CU04, diag_CU04, "Configurar liquidaciones y descuentos (40%, 60%) por cambio de temporada", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU04, sub_CU04_1, "include");
    var sub_CU04_2 = crearElemento(pkg_CU04, diag_CU04, "Cargar fotografías HD y modelos 3D (.glb) para vestidor", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU04, sub_CU04_2, "include");
    var sub_CU04_3 = crearElemento(pkg_CU04, diag_CU04, "Impedir eliminación de prenda con existencias o ventas activas", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU04, sub_CU04_3, "extend");

    diag_CU04.Update();
    try { Repository.ReloadDiagram(diag_CU04.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU04 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU05: CU05. Consultar Catálogo y Disponibilidad en Modo Offline
    // ----------------------------------------------------
    var pkg_CU05 = rootDetalle.Packages.AddNew("CU05 - Detalle", "Package");
    pkg_CU05.Update();
    var diag_CU05 = pkg_CU05.Diagrams.AddNew("Detalle CU05", "Use Case");
    diag_CU05.Update();

    var act_CU05 = crearElemento(pkg_CU05, diag_CU05, "Cliente / Cajero", "Actor", 80, -220, 60, 90);
    var main_CU05 = crearElemento(pkg_CU05, diag_CU05, "CU05. Consultar Catálogo y Disponibilidad en Modo Offline", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU05, main_CU05);
    var sub_CU05_0 = crearElemento(pkg_CU05, diag_CU05, "Detectar pérdida de red y activar Service Worker / SQLite", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU05, sub_CU05_0, "include");
    var sub_CU05_1 = crearElemento(pkg_CU05, diag_CU05, "Filtrar prendas por categoría talla y color desde base local", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU05, sub_CU05_1, "include");
    var sub_CU05_2 = crearElemento(pkg_CU05, diag_CU05, "Visualizar stock local y precios cacheados en almacenamiento", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU05, sub_CU05_2, "include");
    var sub_CU05_3 = crearElemento(pkg_CU05, diag_CU05, "Advertir catálogo desactualizado si última sincronización superó 24h", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU05, sub_CU05_3, "extend");

    diag_CU05.Update();
    try { Repository.ReloadDiagram(diag_CU05.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU05 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU06: CU06. Utilizar Vestidor Virtual con Realidad Aumentada
    // ----------------------------------------------------
    var pkg_CU06 = rootDetalle.Packages.AddNew("CU06 - Detalle", "Package");
    pkg_CU06.Update();
    var diag_CU06 = pkg_CU06.Diagrams.AddNew("Detalle CU06", "Use Case");
    diag_CU06.Update();

    var act_CU06 = crearElemento(pkg_CU06, diag_CU06, "Cliente Móvil", "Actor", 80, -220, 60, 90);
    var main_CU06 = crearElemento(pkg_CU06, diag_CU06, "CU06. Utilizar Vestidor Virtual con Realidad Aumentada (AR)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU06, main_CU06);
    var sub_CU06_0 = crearElemento(pkg_CU06, diag_CU06, "Acceder a cámara nativa móvil mediante ARCore / ARKit en Flutter", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU06, sub_CU06_0, "include");
    var sub_CU06_1 = crearElemento(pkg_CU06, diag_CU06, "Detectar silueta anatómica y superficie corporal en tiempo real", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU06, sub_CU06_1, "include");
    var sub_CU06_2 = crearElemento(pkg_CU06, diag_CU06, "Renderizar malla 3D ajustada al cuerpo con selección de color/talla", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU06, sub_CU06_2, "include");
    var sub_CU06_3 = crearElemento(pkg_CU06, diag_CU06, "Solicitar corrección de pose por iluminación o encuadre deficiente", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU06, sub_CU06_3, "extend");

    diag_CU06.Update();
    try { Repository.ReloadDiagram(diag_CU06.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU06 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU07: CU07. Gestionar Reservas Web-to-Store con Soporte Offline
    // ----------------------------------------------------
    var pkg_CU07 = rootDetalle.Packages.AddNew("CU07 - Detalle", "Package");
    pkg_CU07.Update();
    var diag_CU07 = pkg_CU07.Diagrams.AddNew("Detalle CU07", "Use Case");
    diag_CU07.Update();

    var act_CU07 = crearElemento(pkg_CU07, diag_CU07, "Cliente", "Actor", 80, -220, 60, 90);
    var main_CU07 = crearElemento(pkg_CU07, diag_CU07, "CU07. Gestionar Reservas Web-to-Store con Soporte Offline", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU07, main_CU07);
    var sub_CU07_0 = crearElemento(pkg_CU07, diag_CU07, "Seleccionar prendas y sucursal física para prueba en vestidor", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU07, sub_CU07_0, "include");
    var sub_CU07_1 = crearElemento(pkg_CU07, diag_CU07, "Generar identificador UUIDv4 local y comprobante digital con QR", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU07, sub_CU07_1, "include");
    var sub_CU07_2 = crearElemento(pkg_CU07, diag_CU07, "Congelar stock físico en la tienda por un plazo estricto de 48 horas", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU07, sub_CU07_2, "include");
    var sub_CU07_3 = crearElemento(pkg_CU07, diag_CU07, "Liberar stock a mostrador si expira el plazo legal de 48 horas", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU07, sub_CU07_3, "extend");

    diag_CU07.Update();
    try { Repository.ReloadDiagram(diag_CU07.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU07 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU08: CU08. Gestionar Carrito de Compras Persistente
    // ----------------------------------------------------
    var pkg_CU08 = rootDetalle.Packages.AddNew("CU08 - Detalle", "Package");
    pkg_CU08.Update();
    var diag_CU08 = pkg_CU08.Diagrams.AddNew("Detalle CU08", "Use Case");
    diag_CU08.Update();

    var act_CU08 = crearElemento(pkg_CU08, diag_CU08, "Cliente", "Actor", 80, -220, 60, 90);
    var main_CU08 = crearElemento(pkg_CU08, diag_CU08, "CU08. Gestionar Carrito de Compras Persistente", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU08, main_CU08);
    var sub_CU08_0 = crearElemento(pkg_CU08, diag_CU08, "Sincronizar artículos entre la nube y el almacenamiento local del móvil", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU08, sub_CU08_0, "include");
    var sub_CU08_1 = crearElemento(pkg_CU08, diag_CU08, "Listar ítems agregados y calcular subtotal, descuentos e impuestos", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU08, sub_CU08_1, "include");
    var sub_CU08_2 = crearElemento(pkg_CU08, diag_CU08, "Actualizar cantidades conservando el carrito tras reiniciar la app", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU08, sub_CU08_2, "include");
    var sub_CU08_3 = crearElemento(pkg_CU08, diag_CU08, "Notificar quiebre de stock al intentar superar el stock disponible", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU08, sub_CU08_3, "extend");

    diag_CU08.Update();
    try { Repository.ReloadDiagram(diag_CU08.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU08 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU09: CU09. Procesar Ventas POS con Resiliencia Offline
    // ----------------------------------------------------
    var pkg_CU09 = rootDetalle.Packages.AddNew("CU09 - Detalle", "Package");
    pkg_CU09.Update();
    var diag_CU09 = pkg_CU09.Diagrams.AddNew("Detalle CU09", "Use Case");
    diag_CU09.Update();

    var act_CU09 = crearElemento(pkg_CU09, diag_CU09, "Cajero POS", "Actor", 80, -220, 60, 90);
    var main_CU09 = crearElemento(pkg_CU09, diag_CU09, "CU09. Procesar Ventas POS con Resiliencia Offline", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU09, main_CU09);
    var sub_CU09_0 = crearElemento(pkg_CU09, diag_CU09, "Escanear códigos de prendas en terminal mostrador sin internet", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU09, sub_CU09_0, "include");
    var sub_CU09_1 = crearElemento(pkg_CU09, diag_CU09, "Descontar unidades vendidas del inventario en base SQLite local", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU09, sub_CU09_1, "include");
    var sub_CU09_2 = crearElemento(pkg_CU09, diag_CU09, "Emitir ticket fiscal con UUIDv4 y firma criptográfica local", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU09, sub_CU09_2, "include");
    var sub_CU09_3 = crearElemento(pkg_CU09, diag_CU09, "Encolar venta en tabla Outbox pending_sync para sincronización", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU09, sub_CU09_3, "include");
    var sub_CU09_4 = crearElemento(pkg_CU09, diag_CU09, "Alertar almacenamiento lleno e impedir nueva venta local", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU09, sub_CU09_4, "extend");

    diag_CU09.Update();
    try { Repository.ReloadDiagram(diag_CU09.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU09 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU10: CU10. Procesar Ventas Digitales con Pasarela Stripe
    // ----------------------------------------------------
    var pkg_CU10 = rootDetalle.Packages.AddNew("CU10 - Detalle", "Package");
    pkg_CU10.Update();
    var diag_CU10 = pkg_CU10.Diagrams.AddNew("Detalle CU10", "Use Case");
    diag_CU10.Update();

    var act_CU10 = crearElemento(pkg_CU10, diag_CU10, "Cliente Digital", "Actor", 80, -220, 60, 90);
    var main_CU10 = crearElemento(pkg_CU10, diag_CU10, "CU10. Procesar Ventas Digitales con Pasarela Stripe", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU10, main_CU10);
    var sub_CU10_0 = crearElemento(pkg_CU10, diag_CU10, "Ingresar datos de entrega y dirección de despacho a domicilio", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU10, sub_CU10_0, "include");
    var sub_CU10_1 = crearElemento(pkg_CU10, diag_CU10, "Procesar pago digital con tarjeta mediante Stripe Checkout seguro", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU10, sub_CU10_1, "include");
    var sub_CU10_2 = crearElemento(pkg_CU10, diag_CU10, "Condicionar descuento de stock a confirmación por Webhook de Stripe", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU10, sub_CU10_2, "include");
    var sub_CU10_3 = crearElemento(pkg_CU10, diag_CU10, "Generar comprobante digital y orden de despacho en almacén", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU10, sub_CU10_3, "include");
    var sub_CU10_4 = crearElemento(pkg_CU10, diag_CU10, "Cancelar transacción y restaurar carrito si el pago es rechazado", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU10, sub_CU10_4, "extend");

    diag_CU10.Update();
    try { Repository.ReloadDiagram(diag_CU10.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU10 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU11: CU11. Procesar Cobros con Código QR Simple
    // ----------------------------------------------------
    var pkg_CU11 = rootDetalle.Packages.AddNew("CU11 - Detalle", "Package");
    pkg_CU11.Update();
    var diag_CU11 = pkg_CU11.Diagrams.AddNew("Detalle CU11", "Use Case");
    diag_CU11.Update();

    var act_CU11 = crearElemento(pkg_CU11, diag_CU11, "Cajero / Cliente", "Actor", 80, -220, 60, 90);
    var main_CU11 = crearElemento(pkg_CU11, diag_CU11, "CU11. Procesar Cobros con Código QR Simple", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU11, main_CU11);
    var sub_CU11_0 = crearElemento(pkg_CU11, diag_CU11, "Generar payload interoperable con monto de la orden y referencia única", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU11, sub_CU11_0, "include");
    var sub_CU11_1 = crearElemento(pkg_CU11, diag_CU11, "Desplegar imagen QR dinámico en pantalla mostrador o app del cliente", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU11, sub_CU11_1, "include");
    var sub_CU11_2 = crearElemento(pkg_CU11, diag_CU11, "Escuchar notificación de abono en tiempo real mediante WebSocket", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU11, sub_CU11_2, "include");
    var sub_CU11_3 = crearElemento(pkg_CU11, diag_CU11, "Confirmar cobro y registrar pago vinculado a la venta emitida", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU11, sub_CU11_3, "include");
    var sub_CU11_4 = crearElemento(pkg_CU11, diag_CU11, "Anular cobro por agotamiento de tiempo de espera (Timeout 3 min)", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU11, sub_CU11_4, "extend");

    diag_CU11.Update();
    try { Repository.ReloadDiagram(diag_CU11.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU11 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU12: CU12. Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)
    // ----------------------------------------------------
    var pkg_CU12 = rootDetalle.Packages.AddNew("CU12 - Detalle", "Package");
    pkg_CU12.Update();
    var diag_CU12 = pkg_CU12.Diagrams.AddNew("Detalle CU12", "Use Case");
    diag_CU12.Update();

    var act_CU12 = crearElemento(pkg_CU12, diag_CU12, "Encargado de Sucursal / Cajero", "Actor", 80, -220, 60, 90);
    var main_CU12 = crearElemento(pkg_CU12, diag_CU12, "CU12. Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU12, main_CU12);
    var sub_CU12_0 = crearElemento(pkg_CU12, diag_CU12, "Validar ticket original verificando plazo de garantía legal (7 días)", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU12, sub_CU12_0, "include");
    var sub_CU12_1 = crearElemento(pkg_CU12, diag_CU12, "Reingresar prenda devuelta al stock físico (+1 en inventario) o cuarentena", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU12, sub_CU12_1, "include");
    var sub_CU12_2 = crearElemento(pkg_CU12, diag_CU12, "Mantener crédito original pagado y calcular diferencia de precio en caja", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU12, sub_CU12_2, "include");
    var sub_CU12_3 = crearElemento(pkg_CU12, diag_CU12, "Emitir Nota de Cambio y comprobante de liquidación de excedente", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU12, sub_CU12_3, "include");
    var sub_CU12_4 = crearElemento(pkg_CU12, diag_CU12, "Rechazar devolución por plazo vencido (>7 días) o prendas dañadas", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU12, sub_CU12_4, "extend");

    diag_CU12.Update();
    try { Repository.ReloadDiagram(diag_CU12.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU12 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU13: CU13. Gestionar Traspasos de Mercadería entre Sucursales
    // ----------------------------------------------------
    var pkg_CU13 = rootDetalle.Packages.AddNew("CU13 - Detalle", "Package");
    pkg_CU13.Update();
    var diag_CU13 = pkg_CU13.Diagrams.AddNew("Detalle CU13", "Use Case");
    diag_CU13.Update();

    var act_CU13 = crearElemento(pkg_CU13, diag_CU13, "Encargado de Sucursal", "Actor", 80, -220, 60, 90);
    var main_CU13 = crearElemento(pkg_CU13, diag_CU13, "CU13. Gestionar Traspasos de Mercadería entre Sucursales", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU13, main_CU13);
    var sub_CU13_0 = crearElemento(pkg_CU13, diag_CU13, "Crear solicitud de traspaso indicando sucursal origen, destino y prendas", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU13, sub_CU13_0, "include");
    var sub_CU13_1 = crearElemento(pkg_CU13, diag_CU13, "Aprobar despacho generando guía de remisión y descontando stock origen", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU13, sub_CU13_1, "include");
    var sub_CU13_2 = crearElemento(pkg_CU13, diag_CU13, "Confirmar recepción física en destino con escaneo e incremento de existencias", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU13, sub_CU13_2, "include");
    var sub_CU13_3 = crearElemento(pkg_CU13, diag_CU13, "Registrar reporte de discrepancia por prendas extraviadas o dañadas", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU13, sub_CU13_3, "extend");

    diag_CU13.Update();
    try { Repository.ReloadDiagram(diag_CU13.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU13 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU14: CU14. Sincronización Automática de Datos Locales
    // ----------------------------------------------------
    var pkg_CU14 = rootDetalle.Packages.AddNew("CU14 - Detalle", "Package");
    pkg_CU14.Update();
    var diag_CU14 = pkg_CU14.Diagrams.AddNew("Detalle CU14", "Use Case");
    diag_CU14.Update();

    var act_CU14 = crearElemento(pkg_CU14, diag_CU14, "Demonio de Sincronización", "Actor", 80, -220, 60, 90);
    var main_CU14 = crearElemento(pkg_CU14, diag_CU14, "CU14. Sincronización Automática de Datos Locales (Background)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU14, main_CU14);
    var sub_CU14_0 = crearElemento(pkg_CU14, diag_CU14, "Monitorear conectividad TCP/IP con servidor central en la nube", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU14, sub_CU14_0, "include");
    var sub_CU14_1 = crearElemento(pkg_CU14, diag_CU14, "Extraer transacciones acumuladas en cola Outbox local pending_sync", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU14, sub_CU14_1, "include");
    var sub_CU14_2 = crearElemento(pkg_CU14, diag_CU14, "Transmitir operaciones con UUIDv4 asegurando idempotencia estricta", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU14, sub_CU14_2, "include");
    var sub_CU14_3 = crearElemento(pkg_CU14, diag_CU14, "Consolidar inventario en PostgreSQL y purgar transacciones sincronizadas", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU14, sub_CU14_3, "include");
    var sub_CU14_4 = crearElemento(pkg_CU14, diag_CU14, "Gestionar quiebre de stock central con notificación PUSH y reembolso", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU14, sub_CU14_4, "extend");

    diag_CU14.Update();
    try { Repository.ReloadDiagram(diag_CU14.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU14 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU15: CU15. Generar Reportes Generativos por Voz/Texto con IA
    // ----------------------------------------------------
    var pkg_CU15 = rootDetalle.Packages.AddNew("CU15 - Detalle", "Package");
    pkg_CU15.Update();
    var diag_CU15 = pkg_CU15.Diagrams.AddNew("Detalle CU15", "Use Case");
    diag_CU15.Update();

    var act_CU15 = crearElemento(pkg_CU15, diag_CU15, "Administrador de Empresa", "Actor", 80, -220, 60, 90);
    var main_CU15 = crearElemento(pkg_CU15, diag_CU15, "CU15. Generar Reportes Generativos por Voz/Texto con IA", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU15, main_CU15);
    var sub_CU15_0 = crearElemento(pkg_CU15, diag_CU15, "Capturar dictado por voz (Web Speech API) o texto en lenguaje natural", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU15, sub_CU15_0, "include");
    var sub_CU15_1 = crearElemento(pkg_CU15, diag_CU15, "Interpretar consulta con LLM seguro en modo estricto de solo lectura", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU15, sub_CU15_1, "include");
    var sub_CU15_2 = crearElemento(pkg_CU15, diag_CU15, "Generar dataset analítico aplicando filtros de aislamiento por tenant", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU15, sub_CU15_2, "include");
    var sub_CU15_3 = crearElemento(pkg_CU15, diag_CU15, "Exportar reporte consolidado en formatos PDF, Excel, HTML y Email", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU15, sub_CU15_3, "include");
    var sub_CU15_4 = crearElemento(pkg_CU15, diag_CU15, "Solicitar aclaración si la consulta es ambigua o requiere más parámetros", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU15, sub_CU15_4, "extend");

    diag_CU15.Update();
    try { Repository.ReloadDiagram(diag_CU15.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU15 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU16: CU16. Tablero de Control Ejecutivo (KPIs) y Analítica Predictiva
    // ----------------------------------------------------
    var pkg_CU16 = rootDetalle.Packages.AddNew("CU16 - Detalle", "Package");
    pkg_CU16.Update();
    var diag_CU16 = pkg_CU16.Diagrams.AddNew("Detalle CU16", "Use Case");
    diag_CU16.Update();

    var act_CU16 = crearElemento(pkg_CU16, diag_CU16, "Administrador de Empresa", "Actor", 80, -220, 60, 90);
    var main_CU16 = crearElemento(pkg_CU16, diag_CU16, "CU16. Tablero de Control Ejecutivo (KPIs) y Analítica Predictiva", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU16, main_CU16);
    var sub_CU16_0 = crearElemento(pkg_CU16, diag_CU16, "Calcular KPIs del negocio (MRR, rotación de prendas y tasa devoluciones)", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU16, sub_CU16_0, "include");
    var sub_CU16_1 = crearElemento(pkg_CU16, diag_CU16, "Predecir demanda futura por temporada con modelos supervisados de Machine Learning", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU16, sub_CU16_1, "include");
    var sub_CU16_2 = crearElemento(pkg_CU16, diag_CU16, "Ejecutar clustering de clientes para segmentación de comportamiento de compra", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU16, sub_CU16_2, "include");
    var sub_CU16_3 = crearElemento(pkg_CU16, diag_CU16, "Disparar alertas preventivas ante riesgo de sobrestock o desabastecimiento", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU16, sub_CU16_3, "extend");

    diag_CU16.Update();
    try { Repository.ReloadDiagram(diag_CU16.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU16 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU17: CU17. Auditoría de Operaciones y Bitácora Confidencial
    // ----------------------------------------------------
    var pkg_CU17 = rootDetalle.Packages.AddNew("CU17 - Detalle", "Package");
    pkg_CU17.Update();
    var diag_CU17 = pkg_CU17.Diagrams.AddNew("Detalle CU17", "Use Case");
    diag_CU17.Update();

    var act_CU17 = crearElemento(pkg_CU17, diag_CU17, "Administrador / Auditor", "Actor", 80, -220, 60, 90);
    var main_CU17 = crearElemento(pkg_CU17, diag_CU17, "CU17. Auditoría de Operaciones y Bitácora Confidencial (Llave Dev)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU17, main_CU17);
    var sub_CU17_0 = crearElemento(pkg_CU17, diag_CU17, "Solicitar autenticación criptográfica mediante Llave del Desarrollador", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU17, sub_CU17_0, "include");
    var sub_CU17_1 = crearElemento(pkg_CU17, diag_CU17, "Desencriptar archivo log con algoritmo AES-256 en memoria volátil segura", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU17, sub_CU17_1, "include");
    var sub_CU17_2 = crearElemento(pkg_CU17, diag_CU17, "Filtrar trazas de auditoría por usuario, IP, fecha, hora y acción", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU17, sub_CU17_2, "include");
    var sub_CU17_3 = crearElemento(pkg_CU17, diag_CU17, "Auditar intentos de acceso al registro inmutable en bitácora secundaria", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU17, sub_CU17_3, "include");
    var sub_CU17_4 = crearElemento(pkg_CU17, diag_CU17, "Bloquear terminal y alertar al admin ante ingreso de llave no autorizada", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU17, sub_CU17_4, "extend");

    diag_CU17.Update();
    try { Repository.ReloadDiagram(diag_CU17.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU17 Detalle generado con éxito.", 0);

    // ----------------------------------------------------
    // CU18: CU18. Gestión de Copias de Seguridad y Restauración de Base de Datos
    // ----------------------------------------------------
    var pkg_CU18 = rootDetalle.Packages.AddNew("CU18 - Detalle", "Package");
    pkg_CU18.Update();
    var diag_CU18 = pkg_CU18.Diagrams.AddNew("Detalle CU18", "Use Case");
    diag_CU18.Update();

    var act_CU18 = crearElemento(pkg_CU18, diag_CU18, "Administrador del Sistema", "Actor", 80, -220, 60, 90);
    var main_CU18 = crearElemento(pkg_CU18, diag_CU18, "CU18. Gestión de Copias de Seguridad y Restauración (Backup/Restore)", "UseCase", 260, -220, 180, 90);
    conectarActor(act_CU18, main_CU18);
    var sub_CU18_0 = crearElemento(pkg_CU18, diag_CU18, "Ejecutar comando pg_dump automatizado dentro del contenedor Docker PostgreSQL", "UseCase", 660, -70, 210, 65);
    conectarSubcaso(main_CU18, sub_CU18_0, "include");
    var sub_CU18_1 = crearElemento(pkg_CU18, diag_CU18, "Generar snapshot comprimido .dump con cálculo de checksum SHA-256", "UseCase", 660, -150, 210, 65);
    conectarSubcaso(main_CU18, sub_CU18_1, "include");
    var sub_CU18_2 = crearElemento(pkg_CU18, diag_CU18, "Sincronizar y almacenar respaldo en volumen seguro cifrado en la nube", "UseCase", 660, -230, 210, 65);
    conectarSubcaso(main_CU18, sub_CU18_2, "include");
    var sub_CU18_3 = crearElemento(pkg_CU18, diag_CU18, "Restaurar esquema y registros en base de datos a partir de backup previo", "UseCase", 660, -310, 210, 65);
    conectarSubcaso(main_CU18, sub_CU18_3, "include");
    var sub_CU18_4 = crearElemento(pkg_CU18, diag_CU18, "Abortar proceso y revertir cambios si se detecta corrupción en el archivo dump", "UseCase", 660, -390, 210, 65);
    conectarSubcaso(main_CU18, sub_CU18_4, "extend");

    diag_CU18.Update();
    try { Repository.ReloadDiagram(diag_CU18.DiagramID); } catch(e) {}
    Repository.WriteOutput("Script", "  [+] CU18 Detalle generado con éxito.", 0);

    rootDetalle.Packages.Refresh();
    currentPackage.Packages.Refresh();
    Repository.RefreshModelView(currentPackage.PackageID);
    Repository.WriteOutput("Script", "=== [OK] TODOS LOS 18 DIAGRAMAS DE DETALLE COMPLETADOS ===", 0);
    Session.Prompt("¡Los 18 Diagramas de Detalle de Casos de Uso se generaron exitosamente en Enterprise Architect!", 0);
}

// LLAMADA AUTOMÁTICA
main();
