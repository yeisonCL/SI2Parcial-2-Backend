//!INC Local Scripts.EAConstants-JScript
/*
 * ==============================================================================
 * PROYECTO: FashionStore SaaS (E-commerce Multitienda de Moda)
 * MODULO: Diagrama de Clases UML de Diseno (Modelo con Atributos y Metodos)
 * CATEDRA: Sistemas de Informacion II - MSc. Ing. Angelica Garzon Cuellar
 * REGLA DE CATEDRA: Modelo de dominio con atributos y metodos (visibilidad - / +)
 * ==============================================================================
 */

function crearClaseCompleta(pkg, diag, nombre, attrs, meths, left, top, width, height) {
    var elem = pkg.Elements.AddNew(nombre, 'Class');
    elem.Update();

    // Atributos privados (-)
    for (var i = 0; i < attrs.length; i++) {
        var raw = attrs[i].replace('- ', '');
        var parts = raw.split(':');
        var attrName = parts[0].trim();
        var attrType = parts.length > 1 ? parts[1].trim() : 'string';
        var a = elem.Attributes.AddNew(attrName, attrType);
        a.Visibility = 'Private';
        a.Update();
    }
    elem.Attributes.Refresh();

    // Metodos publicos (+)
    for (var j = 0; j < meths.length; j++) {
        var rawM = meths[j].replace('+ ', '');
        var mName = rawM.split('(')[0].trim();
        var retType = 'void';
        if (rawM.indexOf(':') !== -1) {
            retType = rawM.split(':')[1].trim();
        }
        var m = elem.Methods.AddNew(mName, retType);
        m.Visibility = 'Public';
        m.Update();
    }
    elem.Methods.Refresh();

    var right = left + width;
    var bottom = top - height;
    var coords = 'l=' + left + ';r=' + right + ';t=' + top + ';b=' + bottom + ';';
    var diagObj = diag.DiagramObjects.AddNew(coords, '');
    diagObj.ElementID = elem.ElementID;
    diagObj.Update();
    return elem;
}

function crearAsociacion(elemSrc, elemDst, verbo, cardSrc, cardDst) {
    var con = elemSrc.Connectors.AddNew(verbo, 'Association');
    con.SupplierID = elemDst.ElementID;
    con.Direction = 'Unspecified';
    con.ClientEnd.Cardinality = cardSrc;
    con.SupplierEnd.Cardinality = cardDst;
    con.ClientEnd.Update();
    con.SupplierEnd.Update();
    con.Update();
    elemSrc.Connectors.Refresh();
    return con;
}

function main() {
    Repository.EnsureOutputVisible('Script');
    Repository.WriteOutput('Script', '==========================================================', 0);
    Repository.WriteOutput('Script', '=== GENERANDO DIAGRAMA DE CLASES (ATRIBUTOS Y METODOS) ===', 0);
    Repository.WriteOutput('Script', '==========================================================', 0);

    var currentPackage = Repository.GetTreeSelectedPackage();
    if (currentPackage == null) {
        Session.Prompt('Por favor seleccione un Paquete en el Project Browser antes de ejecutar.', 0);
        return;
    }

    var pkgClases = currentPackage.Packages.AddNew('Diagrama de Clases (Diseno)', 'Package');
    pkgClases.Update();

    var diag = pkgClases.Diagrams.AddNew('Diagrama de Clases - FashionStore SaaS', 'Logical');
    diag.Update();

    var elems = {};
    elems["Empresa"] = crearClaseCompleta(pkgClases, diag, "Empresa", ['- id_empresa: string', '- razon_social: string', '- nit: string', '- subdominio: string', '- estado: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void', '+ validarSubdominio(): boolean'], 580, -80, 180, 160);
    elems["Plan_Suscripcion"] = crearClaseCompleta(pkgClases, diag, "Plan_Suscripcion", ['- id_plan: int', '- nombre: string', '- precio_mensual: decimal', '- max_sucursales: int', '- max_usuarios: int'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 80, -80, 190, 160);
    elems["Suscripcion_Empresa"] = crearClaseCompleta(pkgClases, diag, "Suscripcion_Empresa", ['- id_suscripcion: int', '- stripe_customer_id: string', '- stripe_sub_id: string', '- fecha_inicio: date', '- fecha_vencimiento: date', '- estado: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void', '+ verificarVigencia(): boolean'], 320, -80, 210, 180);
    elems["Usuario"] = crearClaseCompleta(pkgClases, diag, "Usuario", ['- id_usuario: string', '- username: string', '- password_hash: string', '- email: string', '- activo: boolean', '- tenant_id: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void', '+ autenticar(): boolean'], 820, -80, 180, 180);
    elems["Rol"] = crearClaseCompleta(pkgClases, diag, "Rol", ['- id_rol: int', '- nombre: string', '- descripcion: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 1050, -80, 160, 140);
    elems["Bitacora_Auditoria"] = crearClaseCompleta(pkgClases, diag, "Bitacora_Auditoria", ['- id_bitacora: int', '- accion: string', '- tabla_afectada: string', '- ip_origen: string', '- fecha_hora: datetime'], ['+ create(): void', '+ get(): void', '+ registrarEvento(): void'], 1050, -270, 190, 160);
    elems["Persona"] = crearClaseCompleta(pkgClases, diag, "Persona", ['- ci: string', '- nombre: string', '- apellidos: string', '- correo: string', '- telefono: string', '- direccion: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 580, -290, 180, 170);
    elems["Cliente"] = crearClaseCompleta(pkgClases, diag, "Cliente", ['- preferencia_talla: string', '- preferencia_estilo: string', '- fecha_registro: date'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ consultarHistorial(): list'], 800, -320, 190, 150);
    elems["Empleado"] = crearClaseCompleta(pkgClases, diag, "Empleado", ['- cargo: string', '- fecha_contrato: date', '- activo: boolean'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 370, -320, 170, 150);
    elems["Sucursal"] = crearClaseCompleta(pkgClases, diag, "Sucursal", ['- id_sucursal: string', '- nombre: string', '- direccion: string', '- ciudad: string', '- telefono: string', '- es_casa_matriz: boolean'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ consultarStock(): int'], 140, -320, 180, 170);
    elems["Caja_POS"] = crearClaseCompleta(pkgClases, diag, "Caja_POS", ['- id_caja: string', '- numero_caja: string', '- estado: string', '- monto_apertura: decimal'], ['+ create(): void', '+ get(): void', '+ aperturarCaja(): void', '+ cerrarTurno(): void'], 140, -540, 180, 150);
    elems["Inventario_Sucursal"] = crearClaseCompleta(pkgClases, diag, "Inventario_Sucursal", ['- id_inventario: string', '- stock_fisico: int', '- stock_reservado: int', '- stock_disponible: int', '- stock_minimo: int'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ reservarStock(n: int): void', '+ liberarStock(n: int): void'], 140, -740, 200, 170);
    elems["Traspaso"] = crearClaseCompleta(pkgClases, diag, "Traspaso", ['- id_traspaso: string', '- fecha_solicitud: datetime', '- fecha_recepcion: datetime', '- estado: string', '- codigo_guia_qr: string'], ['+ create(): void', '+ get(): void', '+ despachar(): void', '+ confirmarRecepcion(): void'], 20, -960, 190, 170);
    elems["Detalle_Traspaso"] = crearClaseCompleta(pkgClases, diag, "Detalle_Traspaso", ['- id_detalle: string', '- cantidad: int', '- verificado: boolean'], ['+ create(): void', '+ get(): void', '+ update(): void'], 20, -1180, 190, 140);
    elems["Categoria"] = crearClaseCompleta(pkgClases, diag, "Categoria", ['- id_categoria: int', '- nombre: string', '- descripcion: string'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 380, -740, 160, 140);
    elems["Temporada"] = crearClaseCompleta(pkgClases, diag, "Temporada", ['- id_temporada: int', '- nombre: string', '- fecha_inicio: date', '- fecha_fin: date'], ['+ create(): void', '+ get(): void', '+ update(): void'], 570, -740, 170, 150);
    elems["Proveedor"] = crearClaseCompleta(pkgClases, diag, "Proveedor", ['- id_proveedor: int', '- razon_social: string', '- nit: string', '- telefono: string'], ['+ create(): void', '+ get(): void', '+ update(): void'], 380, -930, 170, 150);
    elems["Ropa"] = crearClaseCompleta(pkgClases, diag, "Ropa", ['- id_ropa: string', '- nombre: string', '- descripcion: string', '- precio_unitario: decimal', '- precio_mayorista: decimal', '- modelo_3d_url: string', '- en_oferta: boolean'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void', '+ aplicarDescuento(): void'], 570, -930, 200, 190);
    elems["Talla"] = crearClaseCompleta(pkgClases, diag, "Talla", ['- id_talla: int', '- talla: string', '- orden: int'], ['+ create(): void', '+ get(): void'], 380, -1150, 150, 130);
    elems["Color"] = crearClaseCompleta(pkgClases, diag, "Color", ['- id_color: int', '- nombre: string', '- codigo_hex: string'], ['+ create(): void', '+ get(): void'], 770, -1150, 160, 140);
    elems["Variante_Prenda"] = crearClaseCompleta(pkgClases, diag, "Variante_Prenda", ['- id_variante: string', '- sku: string', '- codigo_barras: string', '- precio_ajustado: decimal', '- activo: boolean'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ consultarStockTotal(): int'], 560, -1150, 190, 170);
    elems["Carrito_Compra"] = crearClaseCompleta(pkgClases, diag, "Carrito_Compra", ['- id_carrito: string', '- fecha_actualizacion: datetime'], ['+ create(): void', '+ get(): void', '+ agregarItem(): void', '+ vaciar(): void'], 1040, -480, 190, 150);
    elems["Detalle_Carrito"] = crearClaseCompleta(pkgClases, diag, "Detalle_Carrito", ['- id_detalle: string', '- cantidad: int', '- precio_unitario: decimal'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 1040, -670, 190, 140);
    elems["Reserva"] = crearClaseCompleta(pkgClases, diag, "Reserva", ['- id_reserva: string', '- codigo_reserva: string', '- fecha_reserva: datetime', '- fecha_vencimiento: datetime', '- estado: string'], ['+ create(): void', '+ get(): void', '+ congelarStock(): void', '+ expirarReserva(): void'], 800, -520, 190, 170);
    elems["Detalle_Reserva"] = crearClaseCompleta(pkgClases, diag, "Detalle_Reserva", ['- id_detalle: string', '- cantidad: int', '- precio_unitario: decimal'], ['+ create(): void', '+ get(): void', '+ delete(): void'], 800, -730, 190, 140);
    elems["Tipo_Venta"] = crearClaseCompleta(pkgClases, diag, "Tipo_Venta", ['- id_tipo_venta: int', '- nombre: string'], ['+ create(): void', '+ get(): void'], 370, -540, 160, 130);
    elems["Metodo_Pago"] = crearClaseCompleta(pkgClases, diag, "Metodo_Pago", ['- id_metodo_pago: int', '- nombre: string'], ['+ create(): void', '+ get(): void'], 370, -180, 160, 130);
    elems["Venta"] = crearClaseCompleta(pkgClases, diag, "Venta", ['- id_venta: string', '- numero_ticket: string', '- total_venta: decimal', '- origen_canal: string', '- uuid_offline: string', '- estado: string', '- fecha_venta: datetime'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ calcularTotal(): decimal', '+ emitirTicket(): void'], 570, -520, 200, 190);
    elems["Detalle_Venta"] = crearClaseCompleta(pkgClases, diag, "Detalle_Venta", ['- id_detalle: string', '- cantidad: int', '- precio_unitario: decimal', '- subtotal: decimal'], ['+ create(): void', '+ get(): void', '+ update(): void', '+ delete(): void'], 800, -920, 190, 160);
    elems["Pago"] = crearClaseCompleta(pkgClases, diag, "Pago", ['- id_pago: string', '- monto: decimal', '- referencia_ext: string', '- estado: string', '- fecha_pago: datetime'], ['+ create(): void', '+ get(): void', '+ procesarTransaccion(): boolean'], 160, -180, 180, 160);
    elems["Factura"] = crearClaseCompleta(pkgClases, diag, "Factura", ['- id_factura: string', '- nro_factura: string', '- nro_autorizacion: string', '- nit_cliente: string', '- codigo_control: string', '- total: decimal'], ['+ create(): void', '+ get(): void', '+ generarQR(): void'], 1020, -860, 190, 170);
    elems["Devolucion"] = crearClaseCompleta(pkgClases, diag, "Devolucion", ['- id_devolucion: string', '- motivo: string', '- estado: string', '- monto_diferencia: decimal', '- fecha_solicitud: datetime'], ['+ create(): void', '+ get(): void', '+ reingresarAlmacen(): void', '+ liquidarDiferencia(): void'], 800, -1130, 200, 170);

    // Relaciones Asociativas con Verbos y Multiplicidades
    crearAsociacion(elems["Plan_Suscripcion"], elems["Suscripcion_Empresa"], "define", "1", "0..*");
    crearAsociacion(elems["Empresa"], elems["Suscripcion_Empresa"], "contrata", "1", "0..*");
    crearAsociacion(elems["Empresa"], elems["Sucursal"], "posee", "1", "1..*");
    crearAsociacion(elems["Empresa"], elems["Usuario"], "administra", "1", "1..*");
    crearAsociacion(elems["Rol"], elems["Usuario"], "otorga", "1", "1..*");
    crearAsociacion(elems["Usuario"], elems["Bitacora_Auditoria"], "registra", "1", "0..*");
    crearAsociacion(elems["Persona"], elems["Usuario"], "asigna", "1", "0..1");
    crearAsociacion(elems["Persona"], elems["Cliente"], "especializa", "1", "0..1");
    crearAsociacion(elems["Persona"], elems["Empleado"], "especializa", "1", "0..1");
    crearAsociacion(elems["Sucursal"], elems["Empleado"], "asigna", "1", "1..*");
    crearAsociacion(elems["Sucursal"], elems["Caja_POS"], "habilita", "1", "1..*");
    crearAsociacion(elems["Sucursal"], elems["Inventario_Sucursal"], "almacena", "1", "0..*");
    crearAsociacion(elems["Variante_Prenda"], elems["Inventario_Sucursal"], "controla", "1", "0..*");
    crearAsociacion(elems["Sucursal"], elems["Traspaso"], "envia", "1", "0..*");
    crearAsociacion(elems["Sucursal"], elems["Traspaso"], "recibe", "1", "0..*");
    crearAsociacion(elems["Traspaso"], elems["Detalle_Traspaso"], "enumera", "1", "1..*");
    crearAsociacion(elems["Variante_Prenda"], elems["Detalle_Traspaso"], "transfiere", "1", "0..*");
    crearAsociacion(elems["Categoria"], elems["Ropa"], "clasifica", "1", "1..*");
    crearAsociacion(elems["Temporada"], elems["Ropa"], "agrupa", "1", "0..*");
    crearAsociacion(elems["Proveedor"], elems["Ropa"], "suministra", "1", "0..*");
    crearAsociacion(elems["Ropa"], elems["Variante_Prenda"], "compone", "1", "1..*");
    crearAsociacion(elems["Talla"], elems["Variante_Prenda"], "especifica", "1", "1..*");
    crearAsociacion(elems["Color"], elems["Variante_Prenda"], "matiza", "1", "1..*");
    crearAsociacion(elems["Cliente"], elems["Carrito_Compra"], "mantiene", "1", "0..1");
    crearAsociacion(elems["Carrito_Compra"], elems["Detalle_Carrito"], "contiene", "1", "1..*");
    crearAsociacion(elems["Variante_Prenda"], elems["Detalle_Carrito"], "incluye", "1", "0..*");
    crearAsociacion(elems["Cliente"], elems["Reserva"], "reserva", "1", "0..*");
    crearAsociacion(elems["Sucursal"], elems["Reserva"], "recepciona", "1", "0..*");
    crearAsociacion(elems["Reserva"], elems["Detalle_Reserva"], "detalla", "1", "1..*");
    crearAsociacion(elems["Variante_Prenda"], elems["Detalle_Reserva"], "aparta", "1", "0..*");
    crearAsociacion(elems["Venta"], elems["Cliente"], "realiza", "1..*", "1");
    crearAsociacion(elems["Empleado"], elems["Venta"], "atiende", "1", "0..*");
    crearAsociacion(elems["Sucursal"], elems["Venta"], "radica", "1", "1..*");
    crearAsociacion(elems["Tipo_Venta"], elems["Venta"], "categoriza", "1", "1..*");
    crearAsociacion(elems["Metodo_Pago"], elems["Venta"], "cancela", "1", "1..*");
    crearAsociacion(elems["Venta"], elems["Detalle_Venta"], "desglosa", "1", "1..*");
    crearAsociacion(elems["Variante_Prenda"], elems["Detalle_Venta"], "factura", "1", "0..*");
    crearAsociacion(elems["Venta"], elems["Pago"], "liquida", "1", "1..*");
    crearAsociacion(elems["Metodo_Pago"], elems["Pago"], "procesa", "1", "1..*");
    crearAsociacion(elems["Venta"], elems["Factura"], "emite", "1", "0..1");
    crearAsociacion(elems["Venta"], elems["Devolucion"], "origina", "1", "0..*");

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
    currentPackage.Packages.Refresh();
    Repository.RefreshModelView(currentPackage.PackageID);
    Repository.WriteOutput('Script', '=== [OK] DIAGRAMA DE CLASES GENERADO EXITOSAMENTE ===', 0);
    Session.Prompt('¡El Diagrama de Clases con Atributos y Metodos ha sido generado con exito en Enterprise Architect!', 0);
}

main();