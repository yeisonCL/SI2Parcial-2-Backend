//!INC Local Scripts.EAConstants-JScript
/*
 * ==============================================================================
 * PROYECTO: FashionStore SaaS (E-commerce Multitienda de Moda)
 * MODULO: Modelo Conceptual / Dominio Simplificado (Base de Datos Real)
 * CATEDRA: Sistemas de Informacion II - MSc. Ing. Angelica Garzon Cuellar
 * REGLA DE CATEDRA (Diapositiva Examen):
 *   "Es un diagrama simple con solo los nombres, relaciones y multiplicidad"
 *   Ejemplo: [Venta] 1..* --------- realiza --------- 1 [User/Cliente]
 * ==============================================================================
 */

function crearClaseSimple(pkg, diag, nombre, left, top, width, height) {
    var elem = pkg.Elements.AddNew(nombre, "Class");
    elem.Update();
    
    var right = left + width;
    var bottom = top - height;
    var coords = "l=" + left + ";r=" + right + ";t=" + top + ";b=" + bottom + ";";
    var diagObj = diag.DiagramObjects.AddNew(coords, "");
    diagObj.ElementID = elem.ElementID;
    diagObj.Update();
    return elem;
}

function crearAsociacionSimple(elemSrc, elemDst, nombreVerbo, cardSrc, cardDst) {
    var con = elemSrc.Connectors.AddNew(nombreVerbo, "Association");
    con.SupplierID = elemDst.ElementID;
    con.Direction = "Unspecified";
    
    // Multiplicidades (Cardinalidades)
    con.ClientEnd.Cardinality = cardSrc;
    con.SupplierEnd.Cardinality = cardDst;
    con.ClientEnd.Update();
    con.SupplierEnd.Update();
    
    con.Update();
    elemSrc.Connectors.Refresh();
    return con;
}

function main() {
    Repository.EnsureOutputVisible("Script");
    Repository.WriteOutput("Script", "==========================================================", 0);
    Repository.WriteOutput("Script", "=== GENERANDO MODELO CONCEPTUAL / DOMINIO SIMPLIFICADO ====", 0);
    Repository.WriteOutput("Script", "=== REGLA: SOLO NOMBRES, RELACIONES Y MULTIPLICIDAD =======", 0);
    Repository.WriteOutput("Script", "==========================================================", 0);

    var currentPackage = Repository.GetTreeSelectedPackage();
    if (currentPackage == null) {
        Session.Prompt("Por favor seleccione un Paquete en el Project Browser antes de ejecutar.", 0);
        return;
    }

    var pkgDominio = currentPackage.Packages.AddNew("Modelo de Dominio Simplificado (Parcial 2)", "Package");
    pkgDominio.Update();

    var diag = pkgDominio.Diagrams.AddNew("Diagrama de Dominio - Clases y Multiplicidades", "Logical");
    diag.Update();

    var elems = {};
    
    // 1. Modulo SaaS & Seguridad
    elems["Plan_Suscripcion"] = crearClaseSimple(pkgDominio, diag, "Plan_Suscripcion", 60, -80, 150, 50);
    elems["Suscripcion_Empresa"] = crearClaseSimple(pkgDominio, diag, "Suscripcion_Empresa", 290, -80, 160, 50);
    elems["Empresa"] = crearClaseSimple(pkgDominio, diag, "Empresa", 530, -80, 140, 50);
    elems["Usuario"] = crearClaseSimple(pkgDominio, diag, "Usuario", 750, -80, 130, 50);
    elems["Rol"] = crearClaseSimple(pkgDominio, diag, "Rol", 960, -80, 120, 50);
    elems["Bitacora_Auditoria"] = crearClaseSimple(pkgDominio, diag, "Bitacora_Auditoria", 750, -200, 150, 50);

    // 2. Personas y Actores
    elems["Persona"] = crearClaseSimple(pkgDominio, diag, "Persona", 530, -220, 140, 50);
    elems["Empleado"] = crearClaseSimple(pkgDominio, diag, "Empleado", 370, -340, 130, 50);
    elems["Cliente"] = crearClaseSimple(pkgDominio, diag, "Cliente", 710, -340, 130, 50);

    // 3. Sucursales, Cajas e Inventarios
    elems["Sucursal"] = crearClaseSimple(pkgDominio, diag, "Sucursal", 140, -340, 140, 50);
    elems["Caja_POS"] = crearClaseSimple(pkgDominio, diag, "Caja_POS", 140, -480, 130, 50);
    elems["Inventario_Sucursal"] = crearClaseSimple(pkgDominio, diag, "Inventario_Sucursal", 140, -620, 160, 50);
    elems["Traspaso"] = crearClaseSimple(pkgDominio, diag, "Traspaso", 30, -760, 130, 50);
    elems["Detalle_Traspaso"] = crearClaseSimple(pkgDominio, diag, "Detalle_Traspaso", 30, -900, 140, 50);

    // 4. Omnicanalidad y Reservas Web-to-Store
    elems["Carrito_Compra"] = crearClaseSimple(pkgDominio, diag, "Carrito_Compra", 930, -340, 140, 50);
    elems["Detalle_Carrito"] = crearClaseSimple(pkgDominio, diag, "Detalle_Carrito", 930, -480, 140, 50);
    elems["Reserva"] = crearClaseSimple(pkgDominio, diag, "Reserva", 750, -480, 130, 50);
    elems["Detalle_Reserva"] = crearClaseSimple(pkgDominio, diag, "Detalle_Reserva", 750, -620, 140, 50);

    // 5. Catalogo de Moda y Variantes
    elems["Categoria"] = crearClaseSimple(pkgDominio, diag, "Categoria", 330, -620, 130, 50);
    elems["Temporada"] = crearClaseSimple(pkgDominio, diag, "Temporada", 490, -620, 130, 50);
    elems["Proveedor"] = crearClaseSimple(pkgDominio, diag, "Proveedor", 330, -760, 130, 50);
    elems["Ropa"] = crearClaseSimple(pkgDominio, diag, "Ropa", 490, -760, 130, 50);
    elems["Talla"] = crearClaseSimple(pkgDominio, diag, "Talla", 330, -900, 120, 50);
    elems["Color"] = crearClaseSimple(pkgDominio, diag, "Color", 650, -900, 120, 50);
    elems["Variante_Prenda"] = crearClaseSimple(pkgDominio, diag, "Variante_Prenda", 490, -900, 140, 50);

    // 6. Ventas POS, Facturacion, Pagos y Devoluciones
    elems["Venta"] = crearClaseSimple(pkgDominio, diag, "Venta", 530, -480, 130, 50);
    elems["Tipo_Venta"] = crearClaseSimple(pkgDominio, diag, "Tipo_Venta", 370, -480, 130, 50);
    elems["Metodo_Pago"] = crearClaseSimple(pkgDominio, diag, "Metodo_Pago", 370, -220, 130, 50);
    elems["Detalle_Venta"] = crearClaseSimple(pkgDominio, diag, "Detalle_Venta", 650, -760, 140, 50);
    elems["Pago"] = crearClaseSimple(pkgDominio, diag, "Pago", 230, -220, 120, 50);
    elems["Factura"] = crearClaseSimple(pkgDominio, diag, "Factura", 930, -620, 120, 50);
    elems["Devolucion"] = crearClaseSimple(pkgDominio, diag, "Devolucion", 750, -760, 130, 50);

    // Relaciones Asociativas con Verbos y Multiplicidades
    crearAsociacionSimple(elems["Plan_Suscripcion"], elems["Suscripcion_Empresa"], "define", "1", "0..*");
    crearAsociacionSimple(elems["Empresa"], elems["Suscripcion_Empresa"], "contrata", "1", "0..*");
    crearAsociacionSimple(elems["Empresa"], elems["Sucursal"], "posee", "1", "1..*");
    crearAsociacionSimple(elems["Empresa"], elems["Usuario"], "administra", "1", "1..*");
    crearAsociacionSimple(elems["Rol"], elems["Usuario"], "otorga", "1", "1..*");
    crearAsociacionSimple(elems["Usuario"], elems["Bitacora_Auditoria"], "registra", "1", "0..*");
    crearAsociacionSimple(elems["Persona"], elems["Usuario"], "asigna", "1", "0..1");
    crearAsociacionSimple(elems["Persona"], elems["Cliente"], "especializa", "1", "0..1");
    crearAsociacionSimple(elems["Persona"], elems["Empleado"], "especializa", "1", "0..1");
    crearAsociacionSimple(elems["Sucursal"], elems["Empleado"], "asigna", "1", "1..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Caja_POS"], "habilita", "1", "1..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Inventario_Sucursal"], "almacena", "1", "0..*");
    crearAsociacionSimple(elems["Variante_Prenda"], elems["Inventario_Sucursal"], "controla", "1", "0..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Traspaso"], "envia", "1", "0..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Traspaso"], "recibe", "1", "0..*");
    crearAsociacionSimple(elems["Traspaso"], elems["Detalle_Traspaso"], "enumera", "1", "1..*");
    crearAsociacionSimple(elems["Variante_Prenda"], elems["Detalle_Traspaso"], "transfiere", "1", "0..*");
    crearAsociacionSimple(elems["Categoria"], elems["Ropa"], "clasifica", "1", "1..*");
    crearAsociacionSimple(elems["Temporada"], elems["Ropa"], "agrupa", "1", "0..*");
    crearAsociacionSimple(elems["Proveedor"], elems["Ropa"], "suministra", "1", "0..*");
    crearAsociacionSimple(elems["Ropa"], elems["Variante_Prenda"], "compone", "1", "1..*");
    crearAsociacionSimple(elems["Talla"], elems["Variante_Prenda"], "especifica", "1", "1..*");
    crearAsociacionSimple(elems["Color"], elems["Variante_Prenda"], "matiza", "1", "1..*");
    crearAsociacionSimple(elems["Cliente"], elems["Carrito_Compra"], "mantiene", "1", "0..1");
    crearAsociacionSimple(elems["Carrito_Compra"], elems["Detalle_Carrito"], "contiene", "1", "1..*");
    crearAsociacionSimple(elems["Variante_Prenda"], elems["Detalle_Carrito"], "incluye", "1", "0..*");
    crearAsociacionSimple(elems["Cliente"], elems["Reserva"], "reserva", "1", "0..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Reserva"], "recepciona", "1", "0..*");
    crearAsociacionSimple(elems["Reserva"], elems["Detalle_Reserva"], "detalla", "1", "1..*");
    crearAsociacionSimple(elems["Variante_Prenda"], elems["Detalle_Reserva"], "aparta", "1", "0..*");
    
    // [Venta] 1..* --------- realiza --------- 1 [Cliente/User] (Exacto a la diapositiva)
    crearAsociacionSimple(elems["Venta"], elems["Cliente"], "realiza", "1..*", "1");
    crearAsociacionSimple(elems["Empleado"], elems["Venta"], "atiende", "1", "0..*");
    crearAsociacionSimple(elems["Sucursal"], elems["Venta"], "radica", "1", "1..*");
    crearAsociacionSimple(elems["Tipo_Venta"], elems["Venta"], "categoriza", "1", "1..*");
    crearAsociacionSimple(elems["Metodo_Pago"], elems["Venta"], "cancela", "1", "1..*");
    crearAsociacionSimple(elems["Venta"], elems["Detalle_Venta"], "desglosa", "1", "1..*");
    crearAsociacionSimple(elems["Variante_Prenda"], elems["Detalle_Venta"], "factura", "1", "0..*");
    crearAsociacionSimple(elems["Venta"], elems["Pago"], "liquida", "1", "1..*");
    crearAsociacionSimple(elems["Metodo_Pago"], elems["Pago"], "procesa", "1", "1..*");
    crearAsociacionSimple(elems["Venta"], elems["Factura"], "emite", "1", "0..1");
    crearAsociacionSimple(elems["Venta"], elems["Devolucion"], "origina", "1", "0..*");

    diag.Update();
    try {
        Repository.ReloadDiagram(diag.DiagramID);
    } catch(e) {}
    
    currentPackage.Packages.Refresh();
    Repository.RefreshModelView(currentPackage.PackageID);
    Repository.WriteOutput("Script", "=== [OK] MODELO CONCEPTUAL GENERADO EXITOSAMENTE ===", 0);
    Session.Prompt("¡El Modelo de Dominio Simplificado (solo nombres, relaciones y multiplicidades) ha sido generado con exito en Enterprise Architect!", 0);
}

// LLAMADA AUTOMATICA
main();
