//!INC Local Scripts.EAConstants-JScript
/*
 * ==============================================================================
 * PROYECTO: FashionStore Multitenant SaaS (SI2 - Parcial 2)
 * MODULO: DIAGRAMAS DE ROBUSTEZ Y COMUNICACION BCE - 18 CASOS DE USO OFICIALES
 * REGLAS ARQUITECTONICAS IMPLEMENTADAS:
 *   - Iconos circulares nativos de Robustez BCE (Type='Object' con estereotipos boundary/control/entity).
 *   - Topologia en estrella: Cero conexion directa Entidad <-> Entidad.
 *   - Flechas de retorno apuntando estrictamente a la izquierda (<-) por debajo de la linea (offsetY < 0).
 *   - Flechas de avance hacia la derecha (->) por encima de la linea (offsetY > 0).
 *   - Actor centrado con nombre visible debajo (ancho 140px para visualizacion completa de etiqueta).
 *   - Conectores Collaboration vinculados a Association base (SourceIsAggregate).
 *   - NOMBRES REALES DE FUNCIONES DEL BACKEND (FastAPI routers y modelos SQLAlchemy de tienda_backend).
 *   - Codificacion cromatica de mensajes por flujo funcional (BGR):
 *       C_NEGRO: 0        (Consultas / Lecturas)
 *       C_AZUL:  16711680 (Registros / Actualizaciones / Formularios)
 *       C_ROJO:  255      (Operaciones criticas / Inserciones BD)
 *       C_VERDE: 32768    (Confirmaciones, respuestas y exitos)
 *       C_OLIVA: 32896    (Operaciones secundarias / filtros / validaciones)
 * ==============================================================================
 */

var C_NEGRO = 0;          // 0x000000 - Consultas generales y lecturas
var C_AZUL  = 16711680;   // 0xFF0000 - Acciones de registro / actualizacion
var C_ROJO  = 255;        // 0x0000FF - Operaciones criticas / Inserciones BD
var C_VERDE = 32768;      // 0x008000 - Confirmaciones, respuestas y exitos
var C_OLIVA = 32896;      // 0x008080 - Operaciones secundarias / filtros

function main() {
    Repository.EnsureOutputVisible("Script");
    Repository.WriteOutput("Script", "=== GENERANDO TODOS LOS DIAGRAMAS DE ROBUSTEZ (18 CUs) ===", 0);

    var currentPackage = Repository.GetTreeSelectedPackage();
    if (currentPackage == null) {
        Session.Prompt("Por favor seleccione un Paquete en el Project Browser antes de ejecutar.", 0);
        return;
    }

    var rootPkg = currentPackage.Packages.AddNew("Diagramas de Robustez - 18 CUs Oficiales", "");
    rootPkg.Update();

    Repository.WriteOutput("Script", "[1/18] Generando ROB-CU01...", 0);
    generarROB_CU01(rootPkg);
    Repository.WriteOutput("Script", "[2/18] Generando ROB-CU02...", 0);
    generarROB_CU02(rootPkg);
    Repository.WriteOutput("Script", "[3/18] Generando ROB-CU03...", 0);
    generarROB_CU03(rootPkg);
    Repository.WriteOutput("Script", "[4/18] Generando ROB-CU04...", 0);
    generarROB_CU04(rootPkg);
    Repository.WriteOutput("Script", "[5/18] Generando ROB-CU05...", 0);
    generarROB_CU05(rootPkg);
    Repository.WriteOutput("Script", "[6/18] Generando ROB-CU06...", 0);
    generarROB_CU06(rootPkg);
    Repository.WriteOutput("Script", "[7/18] Generando ROB-CU07...", 0);
    generarROB_CU07(rootPkg);
    Repository.WriteOutput("Script", "[8/18] Generando ROB-CU08...", 0);
    generarROB_CU08(rootPkg);
    Repository.WriteOutput("Script", "[9/18] Generando ROB-CU09...", 0);
    generarROB_CU09(rootPkg);
    Repository.WriteOutput("Script", "[10/18] Generando ROB-CU10...", 0);
    generarROB_CU10(rootPkg);
    Repository.WriteOutput("Script", "[11/18] Generando ROB-CU11...", 0);
    generarROB_CU11(rootPkg);
    Repository.WriteOutput("Script", "[12/18] Generando ROB-CU12...", 0);
    generarROB_CU12(rootPkg);
    Repository.WriteOutput("Script", "[13/18] Generando ROB-CU13...", 0);
    generarROB_CU13(rootPkg);
    Repository.WriteOutput("Script", "[14/18] Generando ROB-CU14...", 0);
    generarROB_CU14(rootPkg);
    Repository.WriteOutput("Script", "[15/18] Generando ROB-CU15...", 0);
    generarROB_CU15(rootPkg);
    Repository.WriteOutput("Script", "[16/18] Generando ROB-CU16...", 0);
    generarROB_CU16(rootPkg);
    Repository.WriteOutput("Script", "[17/18] Generando ROB-CU17...", 0);
    generarROB_CU17(rootPkg);
    Repository.WriteOutput("Script", "[18/18] Generando ROB-CU18...", 0);
    generarROB_CU18(rootPkg);

    rootPkg.Packages.Refresh();
    currentPackage.Packages.Refresh();
    Repository.RefreshModelView(currentPackage.PackageID);

    Repository.WriteOutput("Script", "=== [OK] LOS 18 DIAGRAMAS DE ROBUSTEZ FUERON GENERADOS EXITOSAMENTE ===", 0);
    Session.Prompt("¡Los 18 Diagramas de Robustez con flechas y funciones reales fueron generados con éxito!", 0);
}

/* ============================================================================
 * 1. ROB-CU01: Registrar Empresa y Contratar Suscripción SaaS
 * ============================================================================ */
function generarROB_CU01(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU01 - Registrar Empresa y Contratar Suscripción SaaS", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU01 - Registrar Empresa y Contratar Suscripción SaaS", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU01 - Registrar Empresa y Contratar Suscripción SaaS", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Administrador Inquilino", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : RegistroEmpresaComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : SuscripcionesRouter", "control");

    var e1 = crearObjetoBCE(pkg, "PlanSuscripcion", "entity");
    var e2 = crearObjetoBCE(pkg, "Empresa", "entity");
    var e3 = crearObjetoBCE(pkg, "SuscripcionEmpresa", "entity");
    var e4 = crearObjetoBCE(pkg, "Usuario", "entity");
    var e5 = crearObjetoBCE(pkg, "HistorialCambioPlan", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -240, -345);
    colocar(diag, e2, 1680, 1785, -440, -545);
    colocar(diag, e3, 1680, 1785, -640, -745);
    colocar(diag, e4, 1680, 1785, -840, -945);
    colocar(diag, e5, 1680, 1785, -1040, -1145);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_PlanSuscripcion = crearAsociacion(ctrl, e1, diag);
    var a_Empresa = crearAsociacion(ctrl, e2, diag);
    var a_SuscripcionEmpresa = crearAsociacion(ctrl, e3, diag);
    var a_Usuario = crearAsociacion(ctrl, e4, diag);
    var a_HistorialCambioPlan = crearAsociacion(ctrl, e5, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "registrarEmpresa()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "10", "confirmarPagoStripe(token)", false, 12, 35, C_ROJO);
    crearMsg(act, bnd, diag, a1, "3.1", "listaPlanes = planes", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "14", "snackBar.open('Empresa registrada con \u00e9xito')", true, 17, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "listar_planes(activos=True, db=db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "registrar_empresa_publica(req, db)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "10.1", "crear_intento_pago(pago_in, db)", false, 13, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return planes", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "9", "return IntentoPagoResponse(client_secret)", true, 11, -25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "13", "return EmpresaPublicaResponse(tenant_id, subdominio)", true, 16, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_PlanSuscripcion, "2", "db.query(PlanSuscripcion).filter_by(activo=True).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_Empresa, "5", "db.query(Empresa).filter(Empresa.nombre == req.nombre).first()", false, 7, 15, C_OLIVA);
    crearMsg(ctrl, e2, diag, a_Empresa, "6", "db.add(Empresa(nombre=req.nombre, schema_name=schema))", false, 8, 25, C_ROJO);
    crearMsg(ctrl, e4, diag, a_Usuario, "7", "db.add(Usuario(username=admin, email=email, rol='Superadmin'))", false, 9, 15, C_ROJO);
    crearMsg(ctrl, e3, diag, a_SuscripcionEmpresa, "11", "db.add(SuscripcionEmpresa(empresa_id, plan_id, estado='activa'))", false, 14, 15, C_ROJO);
    crearMsg(ctrl, e5, diag, a_HistorialCambioPlan, "12", "db.add(HistorialCambioPlan(empresa_id, plan_id, motivo='ALTA'))", false, 15, 15, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 2. ROB-CU02: Autenticación y Control de Acceso Multitenant (JWT)
 * ============================================================================ */
function generarROB_CU02(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU02 - Autenticación y Control de Acceso Multitenant (JWT)", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU02 - Autenticación y Control de Acceso Multitenant (JWT)", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU02 - Autenticación y Control de Acceso Multitenant (JWT)", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Usuario del Sistema", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : LoginComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : SeguridadRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Usuario", "entity");
    var e2 = crearObjetoBCE(pkg, "Empresa", "entity");
    var e3 = crearObjetoBCE(pkg, "Rol", "entity");
    var e4 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -340, -445);
    colocar(diag, e2, 1680, 1785, -540, -645);
    colocar(diag, e3, 1680, 1785, -740, -845);
    colocar(diag, e4, 1680, 1785, -940, -1045);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Usuario = crearAsociacion(ctrl, e1, diag);
    var a_Empresa = crearAsociacion(ctrl, e2, diag);
    var a_Rol = crearAsociacion(ctrl, e3, diag);
    var a_Bitacora = crearAsociacion(ctrl, e4, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "abrirLogin()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "3", "onSubmitLogin(email, password)", false, 4, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "8", "solicitarPermisosPerfil()", false, 10, 35, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "7", "authService.guardarToken(access_token)", true, 9, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "11", "router.navigate(['/dashboard'])", true, 14, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "3.1", "login(form_data, db)", false, 5, 15, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "obtener_perfil(current_user, db)", false, 11, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "6", "return TokenResponse(access_token, token_type='bearer')", true, 8, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "10", "return PerfilResponse(usuario, permisos, tenant_id)", true, 13, -25, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Usuario, "4", "db.query(Usuario).filter(Usuario.email == form_data.username).first()", false, 6, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Usuario, "4.1", "verify_password(form_data.password, user.password_hash)", false, 7, 25, C_OLIVA);
    crearMsg(ctrl, e2, diag, a_Empresa, "5", "db.query(Empresa).filter(Empresa.id == user.empresa_id).first()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_Empresa, "5.1", "crear_access_token(data={'sub': email, 'tenant_id': tid})", false, 8, 25, C_ROJO);
    crearMsg(ctrl, e3, diag, a_Rol, "9", "db.query(Rol).filter(Rol.id == user.rol_id).first()", false, 12, 15, C_NEGRO);
    crearMsg(ctrl, e4, diag, a_Bitacora, "9.1", "registrar_bitacora(db, 'LOGIN', 'usuarios', str(user.id), 'Inicio OK')", false, 12, 15, C_VERDE);

    finalizarDiag(diag);
}

/* ============================================================================
 * 3. ROB-CU03: Administrar Sucursales y Puntos de Caja por Empresa
 * ============================================================================ */
function generarROB_CU03(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU03 - Administrar Sucursales y Puntos de Caja por Empresa", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU03 - Administrar Sucursales y Puntos de Caja por Empresa", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU03 - Administrar Sucursales y Puntos de Caja por Empresa", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Administrador Empresa", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : SucursalComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : SucursalesRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Sucursal", "entity");
    var e2 = crearObjetoBCE(pkg, "Empresa", "entity");
    var e3 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -420, -525);
    colocar(diag, e2, 1680, 1785, -630, -735);
    colocar(diag, e3, 1680, 1785, -840, -945);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Sucursal = crearAsociacion(ctrl, e1, diag);
    var a_Empresa = crearAsociacion(ctrl, e2, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e3, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "abrirFormulario()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "6", "guardarSucursal()", false, 8, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "10", "eliminarSucursal(item)", false, 13, 45, C_OLIVA);
    crearMsg(act, bnd, diag, a1, "3.1", "sucursalesFiltradas = data", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "snackBar.open('Sucursal registrada con \u00e9xito', 'OK')", true, 12, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "13", "cargarSucursales()", true, 17, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "listar_sucursales(request, db, tenant_id)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "6.1", "crear_sucursal(sucursal_in, request, db, tenant_id)", false, 9, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "10.1", "eliminar_sucursal(sucursal_id, request, db)", false, 14, 35, C_OLIVA);
    crearMsg(bnd, ctrl, diag, a2, "3", "return query.filter(Sucursal.empresa_id == tenant_id).all()", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return nueva_sucursal", true, 11, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "12", "return None (HTTP 204 No Content)", true, 16, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Sucursal, "2", "db.query(Sucursal).options(joinedload(Sucursal.empresa)).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_Empresa, "7", "verificar_limite_sucursales(target_empresa_id, db)", false, 10, 15, C_OLIVA);
    crearMsg(ctrl, e1, diag, a_Sucursal, "8", "db.add(nueva_sucursal); db.flush()", false, 10, 25, C_ROJO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "8.2", "db.add(InventarioSucursal(sucursal_id, var.id, stock_fisico=0))", false, 11, 15, C_ROJO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "11", "db.query(InventarioSucursal).filter_by(sucursal_id=id).delete()", false, 15, 25, C_ROJO);
    crearMsg(ctrl, e1, diag, a_Sucursal, "11.1", "db.delete(sucursal); db.commit()", false, 15, 35, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 4. ROB-CU04: Administrar Catálogo, Tallas, Colores y Temporadas
 * ============================================================================ */
function generarROB_CU04(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU04 - Administrar Catálogo, Tallas, Colores y Temporadas", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU04 - Administrar Catálogo, Tallas, Colores y Temporadas", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU04 - Administrar Catálogo, Tallas, Colores y Temporadas", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Encargado de Cat\u00e1logo", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : RopaComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : CatalogoRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Ropa", "entity");
    var e2 = crearObjetoBCE(pkg, "VariantePrenda", "entity");
    var e3 = crearObjetoBCE(pkg, "Talla", "entity");
    var e4 = crearObjetoBCE(pkg, "Color", "entity");
    var e5 = crearObjetoBCE(pkg, "Temporada", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -240, -345);
    colocar(diag, e2, 1680, 1785, -440, -545);
    colocar(diag, e3, 1680, 1785, -640, -745);
    colocar(diag, e4, 1680, 1785, -840, -945);
    colocar(diag, e5, 1680, 1785, -1040, -1145);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Ropa = crearAsociacion(ctrl, e1, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e2, diag);
    var a_Talla = crearAsociacion(ctrl, e3, diag);
    var a_Color = crearAsociacion(ctrl, e4, diag);
    var a_Temporada = crearAsociacion(ctrl, e5, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "abrirModalCrearPrenda()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "7", "guardarPrenda()", false, 9, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "11", "agregarVariante(talla_id, color_id)", false, 14, 45, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "prendas = data", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "10", "snackBar.open('Prenda y matriz registradas')", true, 13, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "listar_prendas(db, tenant_id)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "crear_prenda(ropa_in, db, tenant_id)", false, 10, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "11.1", "agregar_variante(ropa_id, variante_in, db)", false, 15, 35, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "3", "return db.query(Ropa).filter(...).all()", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "9.1", "return nueva_prenda", true, 12, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "13", "return nueva_variante", true, 17, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Ropa, "2", "db.query(Ropa).filter(Ropa.empresa_id == tenant_id).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_Talla, "5", "db.query(Talla).filter(Talla.activo == True).all()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e5, diag, a_Temporada, "6", "db.query(Temporada).filter(Temporada.activo == True).all()", false, 8, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Ropa, "8", "db.add(nueva_ropa); db.commit()", false, 11, 25, C_ROJO);
    crearMsg(ctrl, e2, diag, a_VariantePrenda, "12", "db.add(VariantePrenda(ropa_id, talla_id, color_id))", false, 16, 15, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 5. ROB-CU05: Consultar Catálogo y Disponibilidad en Modo Offline
 * ============================================================================ */
function generarROB_CU05(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU05 - Consultar Catálogo y Disponibilidad en Modo Offline", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU05 - Consultar Catálogo y Disponibilidad en Modo Offline", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU05 - Consultar Catálogo y Disponibilidad en Modo Offline", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cliente / Vendedor POS", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : CatalogoPWAComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : CatalogoDisponibilidadRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Ropa", "entity");
    var e2 = crearObjetoBCE(pkg, "VariantePrenda", "entity");
    var e3 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -420, -525);
    colocar(diag, e2, 1680, 1785, -630, -735);
    colocar(diag, e3, 1680, 1785, -840, -945);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Ropa = crearAsociacion(ctrl, e1, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e2, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e3, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "filtrarPorCategoriaOTalla(cat, talla)", false, 5, 25, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "8", "verificarDisponibilidadOffline(prenda_id)", false, 10, 35, C_OLIVA);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarCatalogo(prendas)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "7", "indexedDB.guardarLotePrendas(items)", true, 9, -25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "10", "mostrarDisponibilidadLocal(stock_disponible)", true, 13, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "consultar_catalogo_con_disponibilidad(sucursal_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "obtener_disponibilidad_prenda(ropa_id, sucursal_id, db)", false, 6, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return respuesta_catalogo_disponible", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6", "return detalle_disponibilidad", true, 8, -25, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Ropa, "2", "db.query(Ropa).filter(Ropa.activo == True).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_VariantePrenda, "2.1", "db.query(VariantePrenda).filter_by(ropa_id=id).all()", false, 4, 25, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "5", "db.query(InventarioSucursal).filter_by(sucursal_id=sid).all()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "5.1", "_calcular_estado_stock(stock_fisico, stock_reservado)", false, 8, 25, C_OLIVA);

    finalizarDiag(diag);
}

/* ============================================================================
 * 6. ROB-CU06: Utilizar Vestidor Virtual con Realidad Aumentada (Móvil)
 * ============================================================================ */
function generarROB_CU06(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU06 - Utilizar Vestidor Virtual con Realidad Aumentada (Móvil)", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU06 - Utilizar Vestidor Virtual con Realidad Aumentada (Móvil)", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU06 - Utilizar Vestidor Virtual con Realidad Aumentada (Móvil)", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cliente M\u00f3vil", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : ARVestidorScreen", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : ARVestidorRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Ropa", "entity");
    var e2 = crearObjetoBCE(pkg, "VariantePrenda", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -520, -625);
    colocar(diag, e2, 1680, 1785, -740, -845);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Ropa = crearAsociacion(ctrl, e1, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e2, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "abrirVestidorAR(prenda_id)", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "apuntarCamaraYValidarPose()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "inicializarARCorePlugin()", true, 4, -15, C_AZUL);
    crearMsg(act, bnd, diag, a1, "7", "superponerPrenda3DEnCamara()", true, 9, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "obtener_metadatos_ar_prenda(ropa_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "validar_ajuste_corporal(request, db)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "3", "return MetadatosARResponse(modelo_3d_url, textura_url)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6", "return ValidarAjusteResponse(talla_sugerida, confianza)", true, 8, -25, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Ropa, "2", "db.query(Ropa).filter(Ropa.id == ropa_id).first()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_VariantePrenda, "5", "db.query(VariantePrenda).filter_by(ropa_id=ropa_id).all()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Ropa, "5.1", "_detectar_categoria_garment(ropa.categoria_nombre)", false, 7, 25, C_OLIVA);

    finalizarDiag(diag);
}

/* ============================================================================
 * 7. ROB-CU07: Gestionar Reservas Web-to-Store con Soporte Offline
 * ============================================================================ */
function generarROB_CU07(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU07 - Gestionar Reservas Web-to-Store con Soporte Offline", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU07 - Gestionar Reservas Web-to-Store con Soporte Offline", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU07 - Gestionar Reservas Web-to-Store con Soporte Offline", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cliente / Vendedor Tienda", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : CrearReservaDialogComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : ReservasRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Reserva", "entity");
    var e2 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e3 = crearObjetoBCE(pkg, "Sucursal", "entity");
    var e4 = crearObjetoBCE(pkg, "Usuario", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -340, -445);
    colocar(diag, e2, 1680, 1785, -540, -645);
    colocar(diag, e3, 1680, 1785, -740, -845);
    colocar(diag, e4, 1680, 1785, -940, -1045);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Reserva = crearAsociacion(ctrl, e1, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e2, diag);
    var a_Sucursal = crearAsociacion(ctrl, e3, diag);
    var a_Usuario = crearAsociacion(ctrl, e4, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "abrirModalReserva(ropa_id)", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "confirmarReserva(sucursal_id, variante_id)", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "10", "confirmarRetiroPresencial(reserva_id)", false, 12, 35, C_ROJO);
    crearMsg(act, bnd, diag, a1, "3.1", "sucursalesConStock = data", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "snackBar.open('Reserva confirmada. Vigencia 48h')", true, 11, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "13", "mostrarTicketRetiroExitoso()", true, 16, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "consultar_catalogo_con_disponibilidad(sucursal_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "crear_reserva(reserva_in, db, current_user)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "10.1", "confirmar_retiro(reserva_id, request, db)", false, 13, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return sucursales_disponibles", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return ReservaResponse(codigo, expira_en, estado='PENDIENTE')", true, 10, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "12", "return ReservaResponse(estado='COMPLETADA')", true, 15, -35, C_VERDE);
    crearMsg(ctrl, e2, diag, a_InventarioSucursal, "2", "db.query(InventarioSucursal).filter_by(sucursal_id=sid).first()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Reserva, "5", "db.add(Reserva(codigo=uuid4(), expira_en=now+48h))", false, 7, 15, C_ROJO);
    crearMsg(ctrl, e2, diag, a_InventarioSucursal, "6", "inv.stock_reservado += 1; db.commit()", false, 8, 25, C_ROJO);
    crearMsg(ctrl, e2, diag, a_InventarioSucursal, "11", "inv.stock_reservado -= 1; inv.stock_fisico -= 1", false, 14, 35, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 8. ROB-CU08: Gestionar Carrito de Compras Persistente
 * ============================================================================ */
function generarROB_CU08(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU08 - Gestionar Carrito de Compras Persistente", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU08 - Gestionar Carrito de Compras Persistente", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU08 - Gestionar Carrito de Compras Persistente", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cliente Registrado", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : CarritoComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : CarritoPersistenteRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Carrito", "entity");
    var e2 = crearObjetoBCE(pkg, "ItemCarrito", "entity");
    var e3 = crearObjetoBCE(pkg, "VariantePrenda", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -420, -525);
    colocar(diag, e2, 1680, 1785, -630, -735);
    colocar(diag, e3, 1680, 1785, -840, -945);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Carrito = crearAsociacion(ctrl, e1, diag);
    var a_ItemCarrito = crearAsociacion(ctrl, e2, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e3, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "agregarAlCarrito(variante_id, cantidad)", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "8", "eliminarItemCarrito(item_id)", false, 10, 35, C_OLIVA);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarCarrito(items, total)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "7", "localStorage.setItem('carrito_backup', json)", true, 9, -25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "11", "actualizarBadgeCarrito(total_items)", true, 14, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "obtener_carrito_persistente(cliente_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "agregar_item_persistente(item_in, db)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "eliminar_item_persistente(item_id, db)", false, 11, 35, C_OLIVA);
    crearMsg(bnd, ctrl, diag, a2, "3", "return _formatear_carrito(carrito)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6.1", "return CarritoResponse(items, total_calculado)", true, 8, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "10", "return CarritoResponse(items_actualizados)", true, 13, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Carrito, "2", "db.query(Carrito).filter(Carrito.cliente_id == cid).first()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_VariantePrenda, "5", "db.query(VariantePrenda).filter_by(id=vid).first()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_ItemCarrito, "6", "db.add(ItemCarrito(carrito_id, variante_id, cantidad)); db.commit()", false, 8, 25, C_ROJO);
    crearMsg(ctrl, e2, diag, a_ItemCarrito, "9", "db.query(ItemCarrito).filter_by(id=item_id).delete()", false, 12, 15, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 9. ROB-CU09: Procesar Ventas POS con Resiliencia Offline
 * ============================================================================ */
function generarROB_CU09(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU09 - Procesar Ventas POS con Resiliencia Offline", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU09 - Procesar Ventas POS con Resiliencia Offline", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU09 - Procesar Ventas POS con Resiliencia Offline", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cajero / Vendedor POS", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : CrearVentaComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : VentasRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Venta", "entity");
    var e2 = crearObjetoBCE(pkg, "DetalleVenta", "entity");
    var e3 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e4 = crearObjetoBCE(pkg, "Cliente", "entity");
    var e5 = crearObjetoBCE(pkg, "Usuario", "entity");
    var e6 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -180, -285);
    colocar(diag, e2, 1680, 1785, -360, -465);
    colocar(diag, e3, 1680, 1785, -540, -645);
    colocar(diag, e4, 1680, 1785, -720, -825);
    colocar(diag, e5, 1680, 1785, -900, -1005);
    colocar(diag, e6, 1680, 1785, -1080, -1185);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Venta = crearAsociacion(ctrl, e1, diag);
    var a_DetalleVenta = crearAsociacion(ctrl, e2, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e3, diag);
    var a_Cliente = crearAsociacion(ctrl, e4, diag);
    var a_Usuario = crearAsociacion(ctrl, e5, diag);
    var a_Bitacora = crearAsociacion(ctrl, e6, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "escanearCodigoBarras(sku)", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "cobrarVentaEfectivo(monto, cliente_id)", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "11", "sincronizarVentasOffline()", false, 13, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "agregarItemGridVenta(item)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "8", "imprimirTicketPOS(numero_factura)", true, 10, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "14", "snackBar.open('Lote offline sincronizado')", true, 17, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "procesar_venta_pos(venta_in, request, db)", false, 6, 15, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "11.1", "sincronizar_lote_ventas_offline(lote, db)", false, 14, 25, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "return VentaResponse(id, codigo, total, estado='COMPLETADA')", true, 9, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "13", "return SincronizacionResponse(procesadas, errores)", true, 16, -25, C_VERDE);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "2", "db.query(InventarioSucursal).filter_by(sucursal_id=sid).first()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Venta, "5", "_ejecutar_venta_pos_core(db, venta_datos, sid, uid)", false, 7, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_Venta, "6", "db.add(Venta(tipo='POS', total=total, estado='PAGADA'))", false, 8, 25, C_ROJO);
    crearMsg(ctrl, e2, diag, a_DetalleVenta, "6.1", "db.add(DetalleVenta(venta_id, variante_id, cantidad, precio))", false, 8, 15, C_ROJO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "7", "inv.stock_fisico -= cantidad; db.commit()", false, 9, 25, C_ROJO);
    crearMsg(ctrl, e6, diag, a_Bitacora, "12", "registrar_bitacora(db, 'VENTA_POS', 'ventas', str(venta.id))", false, 15, 15, C_VERDE);

    finalizarDiag(diag);
}

/* ============================================================================
 * 10. ROB-CU10: Procesar Ventas Digitales con Pasarela Stripe
 * ============================================================================ */
function generarROB_CU10(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU10 - Procesar Ventas Digitales con Pasarela Stripe", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU10 - Procesar Ventas Digitales con Pasarela Stripe", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU10 - Procesar Ventas Digitales con Pasarela Stripe", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Comprador Online", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : PasarelaStripeComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : StripePagosRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Venta", "entity");
    var e2 = crearObjetoBCE(pkg, "DetalleVenta", "entity");
    var e3 = crearObjetoBCE(pkg, "TransaccionPago", "entity");
    var e4 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e5 = crearObjetoBCE(pkg, "Empresa", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -240, -345);
    colocar(diag, e2, 1680, 1785, -440, -545);
    colocar(diag, e3, 1680, 1785, -640, -745);
    colocar(diag, e4, 1680, 1785, -840, -945);
    colocar(diag, e5, 1680, 1785, -1040, -1145);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Venta = crearAsociacion(ctrl, e1, diag);
    var a_DetalleVenta = crearAsociacion(ctrl, e2, diag);
    var a_TransaccionPago = crearAsociacion(ctrl, e3, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e4, diag);
    var a_Empresa = crearAsociacion(ctrl, e5, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "iniciarCheckout()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "ingresarDatosTarjetaYConfirmar()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "stripe.elements().create('card')", true, 4, -15, C_AZUL);
    crearMsg(act, bnd, diag, a1, "9", "router.navigate(['/pedido-confirmado'])", true, 12, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "obtener_configuracion_stripe(empresa_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "crear_intento_pago(pago_in, db)", false, 6, 25, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "7", "confirmar_pago_stripe(request, db)", false, 10, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return StripeConfigResponse(publishable_key)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6", "return IntentoPagoResponse(client_secret, payment_intent_id)", true, 9, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return VentaResponse(id, estado='PAGADO_STRIPE')", true, 11, -35, C_VERDE);
    crearMsg(ctrl, e5, diag, a_Empresa, "2", "db.query(Empresa).filter_by(id=empresa_id).first()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_TransaccionPago, "5", "db.add(TransaccionPago(monto, metodo='STRIPE', estado='PENDING'))", false, 7, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_Venta, "7.1", "db.add(Venta(tipo='ECOMMERCE', estado='PAGADA'))", false, 10, 25, C_ROJO);
    crearMsg(ctrl, e4, diag, a_InventarioSucursal, "7.2", "inv.stock_fisico -= detalle.cantidad; db.commit()", false, 11, 15, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 11. ROB-CU11: Procesar Cobros con Código QR Simple
 * ============================================================================ */
function generarROB_CU11(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU11 - Procesar Cobros con Código QR Simple", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU11 - Procesar Cobros con Código QR Simple", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU11 - Procesar Cobros con Código QR Simple", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Cliente / Cajero POS", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : CobroQrComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : CobroQRRouter", "control");

    var e1 = crearObjetoBCE(pkg, "CobroQR", "entity");
    var e2 = crearObjetoBCE(pkg, "Venta", "entity");
    var e3 = crearObjetoBCE(pkg, "Sucursal", "entity");
    var e4 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -340, -445);
    colocar(diag, e2, 1680, 1785, -540, -645);
    colocar(diag, e3, 1680, 1785, -740, -845);
    colocar(diag, e4, 1680, 1785, -940, -1045);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_CobroQR = crearAsociacion(ctrl, e1, diag);
    var a_Venta = crearAsociacion(ctrl, e2, diag);
    var a_Sucursal = crearAsociacion(ctrl, e3, diag);
    var a_Bitacora = crearAsociacion(ctrl, e4, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "generarCobroQR(monto, concepto)", false, 1, 15, C_AZUL);
    crearMsg(act, bnd, diag, a1, "6", "simularPagoAppBancaria(qr_id)", false, 8, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarImagenQR(qr_base64)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "8", "snackBar.open('Cobro QR Confirmado')", true, 11, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "generar_qr_simple(solicitud, db)", false, 2, 15, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "4", "consultar_estado_qr(cobro_id, db)", false, 5, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "6.1", "simular_pago_bancario_qr(cobro_id, db)", false, 9, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return CobroQRResponse(id, qr_base64, estado='PENDIENTE')", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "5", "return EstadoQRResponse(estado='PENDIENTE')", true, 7, -25, C_OLIVA);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "return CobroQRResponse(estado='PAGADO', venta_id)", true, 10, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_CobroQR, "2", "db.add(CobroQR(monto, estado='GENERADO', alias='FASHIONSTORE'))", false, 3, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_CobroQR, "2.1", "_generar_imagen_qr_base64(datos_bancarios)", false, 4, 25, C_AZUL);
    crearMsg(ctrl, e2, diag, a_Venta, "7", "cobro.estado = 'PAGADO'; db.add(Venta(tipo='QR', total=monto))", false, 10, 15, C_ROJO);
    crearMsg(ctrl, e4, diag, a_Bitacora, "7.2", "registrar_bitacora(db, 'PAGO_QR_OK', 'cobros_qr', str(cobro.id))", false, 10, 25, C_VERDE);

    finalizarDiag(diag);
}

/* ============================================================================
 * 12. ROB-CU12: Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)
 * ============================================================================ */
function generarROB_CU12(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU12 - Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU12 - Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU12 - Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Encargado de Tienda / Cliente", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : GestionDevolucionesComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : DevolucionesRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Devolucion", "entity");
    var e2 = crearObjetoBCE(pkg, "Venta", "entity");
    var e3 = crearObjetoBCE(pkg, "DetalleVenta", "entity");
    var e4 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e5 = crearObjetoBCE(pkg, "VariantePrenda", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -240, -345);
    colocar(diag, e2, 1680, 1785, -440, -545);
    colocar(diag, e3, 1680, 1785, -640, -745);
    colocar(diag, e4, 1680, 1785, -840, -945);
    colocar(diag, e5, 1680, 1785, -1040, -1145);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Devolucion = crearAsociacion(ctrl, e1, diag);
    var a_Venta = crearAsociacion(ctrl, e2, diag);
    var a_DetalleVenta = crearAsociacion(ctrl, e3, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e4, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e5, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "buscarVenta(numero_factura)", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "solicitarCambioTalla(detalle_id, nueva_talla_id)", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "9", "aprobarDevolucionYProcesar()", false, 11, 35, C_ROJO);
    crearMsg(act, bnd, diag, a1, "3.1", "mostrarDetalleVentaYGarantia(dias_transcurridos)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "8", "snackBar.open('Devoluci\u00f3n autorizada')", true, 10, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "12", "imprimirComprobanteCambio()", true, 15, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "verificar_elegibilidad(venta_id, db)", false, 2, 15, C_OLIVA);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "solicitar_devolucion(devolucion_in, db)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "9.1", "procesar_cambio_talla(devolucion_id, cambio_in, db)", false, 12, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return ElegibilidadResponse(elegible=True, dias_transcurridos)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "return DevolucionResponse(id, estado='SOLICITADO')", true, 9, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "11", "return DevolucionResponse(estado='COMPLETADO', stock_ok=True)", true, 14, -35, C_VERDE);
    crearMsg(ctrl, e2, diag, a_Venta, "2", "_calcular_horas_transcurridas(venta.fecha_venta)", false, 3, 15, C_OLIVA);
    crearMsg(ctrl, e1, diag, a_Devolucion, "5", "db.add(Devolucion(venta_id, motivo, estado='PENDIENTE'))", false, 7, 15, C_ROJO);
    crearMsg(ctrl, e4, diag, a_InventarioSucursal, "10", "inv_orig.stock_fisico += 1; inv_dest.stock_fisico -= 1", false, 13, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_Devolucion, "10.1", "devolucion.estado = 'APROBADA'; db.commit()", false, 13, 25, C_ROJO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 13. ROB-CU13: Gestionar Traspasos de Mercadería entre Sucursales
 * ============================================================================ */
function generarROB_CU13(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU13 - Gestionar Traspasos de Mercadería entre Sucursales", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU13 - Gestionar Traspasos de Mercadería entre Sucursales", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU13 - Gestionar Traspasos de Mercadería entre Sucursales", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Encargado de Almac\u00e9n", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : TraspasoComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : TraspasosRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Traspaso", "entity");
    var e2 = crearObjetoBCE(pkg, "DetalleTraspaso", "entity");
    var e3 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e4 = crearObjetoBCE(pkg, "Sucursal", "entity");
    var e5 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -240, -345);
    colocar(diag, e2, 1680, 1785, -440, -545);
    colocar(diag, e3, 1680, 1785, -640, -745);
    colocar(diag, e4, 1680, 1785, -840, -945);
    colocar(diag, e5, 1680, 1785, -1040, -1145);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Traspaso = crearAsociacion(ctrl, e1, diag);
    var a_DetalleTraspaso = crearAsociacion(ctrl, e2, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e3, diag);
    var a_Sucursal = crearAsociacion(ctrl, e4, diag);
    var a_Bitacora = crearAsociacion(ctrl, e5, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "abrirModalTraspaso()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "6", "solicitarTraspaso(origen_id, destino_id, items)", false, 8, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "10", "confirmarRecepcion(traspaso_id)", false, 13, 45, C_ROJO);
    crearMsg(act, bnd, diag, a1, "3.1", "traspasosFiltrados = data", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "snackBar.open('Traspaso en tr\u00e1nsito')", true, 12, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "13", "snackBar.open('Mercader\u00eda recepcionada en destino')", true, 17, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "_listar_traspasos_impl(empresa_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "6.1", "_crear_traspaso_impl(traspaso_in, db)", false, 9, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "10.1", "_confirmar_recepcion_impl(traspaso_id, db)", false, 14, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return lista_traspasos", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return TraspasoResponse(estado='EN_TRANSITO')", true, 11, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "12", "return TraspasoResponse(estado='RECEPCIONADO')", true, 16, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Traspaso, "2", "db.query(Traspaso).filter(Traspaso.empresa_id == eid).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Traspaso, "7", "db.add(Traspaso(origen_id, destino_id, estado='SOLICITADO'))", false, 10, 15, C_ROJO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "7.1", "inv_origen.stock_fisico -= cant; db.commit()", false, 10, 25, C_ROJO);
    crearMsg(ctrl, e3, diag, a_InventarioSucursal, "11", "inv_destino.stock_fisico += cant; traspaso.estado = 'RECEPCIONADO'", false, 15, 15, C_ROJO);
    crearMsg(ctrl, e5, diag, a_Bitacora, "11.1", "registrar_bitacora(db, 'TRASPASO_OK', 'traspasos', str(id))", false, 15, 25, C_VERDE);

    finalizarDiag(diag);
}

/* ============================================================================
 * 14. ROB-CU14: Sincronización Automática de Datos Offline a Online
 * ============================================================================ */
function generarROB_CU14(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU14 - Sincronización Automática de Datos Offline a Online", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU14 - Sincronización Automática de Datos Offline a Online", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU14 - Sincronización Automática de Datos Offline a Online", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Vendedor Offline / Sistema", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : OfflineSyncService", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : InventarioLocalRouter", "control");

    var e1 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e2 = crearObjetoBCE(pkg, "Venta", "entity");
    var e3 = crearObjetoBCE(pkg, "VariantePrenda", "entity");
    var e4 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -340, -445);
    colocar(diag, e2, 1680, 1785, -540, -645);
    colocar(diag, e3, 1680, 1785, -740, -845);
    colocar(diag, e4, 1680, 1785, -940, -1045);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_InventarioSucursal = crearAsociacion(ctrl, e1, diag);
    var a_Venta = crearAsociacion(ctrl, e2, diag);
    var a_VariantePrenda = crearAsociacion(ctrl, e3, diag);
    var a_Bitacora = crearAsociacion(ctrl, e4, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "window.addEventListener('online')", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "sincronizarColaOffline()", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "notificarConexionRestaurada()", true, 4, -15, C_AZUL);
    crearMsg(act, bnd, diag, a1, "8", "indexedDB.limpiarColaSincronizada()", true, 10, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "11", "snackBar.open('Sincronizaci\u00f3n finalizada')", true, 14, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "sincronizar_lote_ventas_offline(lote, db)", false, 6, 15, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "6", "_obtener_inventario_sucursal_impl(sucursal_id, db)", false, 8, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "5.1", "return SincronizacionResponse(exitosos, errores)", true, 7, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "return InventarioActualizadoResponse(items)", true, 9, -25, C_VERDE);
    crearMsg(ctrl, e1, diag, a_InventarioSucursal, "4.2", "_ejecutar_venta_pos_core(db, v, sid, uid)", false, 6, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_InventarioSucursal, "5", "inv.stock_fisico -= v.cantidad; db.commit()", false, 7, 25, C_ROJO);
    crearMsg(ctrl, e1, diag, a_InventarioSucursal, "9", "db.query(InventarioSucursal).filter_by(sucursal_id=sid).all()", false, 11, 15, C_NEGRO);
    crearMsg(ctrl, e4, diag, a_Bitacora, "10", "registrar_bitacora(db, 'SYNC_OFFLINE', 'inventario', str(sid))", false, 12, 15, C_VERDE);

    finalizarDiag(diag);
}

/* ============================================================================
 * 15. ROB-CU15: Generar Reportes Generativos por Voz y PLN (Gemini AI)
 * ============================================================================ */
function generarROB_CU15(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU15 - Generar Reportes Generativos por Voz y PLN (Gemini AI)", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU15 - Generar Reportes Generativos por Voz y PLN (Gemini AI)", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU15 - Generar Reportes Generativos por Voz y PLN (Gemini AI)", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Gerente de Tienda", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : ReportesVozComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : ReportesVozRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Venta", "entity");
    var e2 = crearObjetoBCE(pkg, "DetalleVenta", "entity");
    var e3 = crearObjetoBCE(pkg, "Ropa", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -420, -525);
    colocar(diag, e2, 1680, 1785, -630, -735);
    colocar(diag, e3, 1680, 1785, -840, -945);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Venta = crearAsociacion(ctrl, e1, diag);
    var a_DetalleVenta = crearAsociacion(ctrl, e2, diag);
    var a_Ropa = crearAsociacion(ctrl, e3, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "iniciarGrabacionMicrofono()", false, 1, 15, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3", "detenerGrabacionYEnviarAudio()", false, 4, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "7", "exportarReportePDF()", false, 9, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "6.1", "renderizarGraficosReporteGenerado(datos)", true, 8, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "descargarArchivoBlob(pdf)", true, 12, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "3.1", "procesar_audio_blob(audio_file, db)", false, 5, 15, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "procesar_comando_voz_texto(comando, db)", false, 10, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "6", "return ReporteGeneradoResponse(texto, metricas, sql)", true, 7, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return DocumentoPDFResponse(pdf_base64)", true, 11, -25, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Venta, "4", "_intentar_clasificacion_gemini(texto, prompt_contexto)", false, 6, 15, C_ROJO);
    crearMsg(ctrl, e1, diag, a_Venta, "5", "db.query(Venta).filter(Venta.empresa_id == eid).all()", false, 6, 25, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_DetalleVenta, "5.1", "db.query(DetalleVenta).join(Ropa).filter(...).all()", false, 7, 15, C_NEGRO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 16. ROB-CU16: Tablero de Control Ejecutivo (KPIs y Alertas Stock)
 * ============================================================================ */
function generarROB_CU16(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU16 - Tablero de Control Ejecutivo (KPIs y Alertas Stock)", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU16 - Tablero de Control Ejecutivo (KPIs y Alertas Stock)", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU16 - Tablero de Control Ejecutivo (KPIs y Alertas Stock)", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Director Ejecutivo / Due\u00f1o", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : DashboardComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : IAAlertasRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Venta", "entity");
    var e2 = crearObjetoBCE(pkg, "InventarioSucursal", "entity");
    var e3 = crearObjetoBCE(pkg, "Ropa", "entity");
    var e4 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -340, -445);
    colocar(diag, e2, 1680, 1785, -540, -645);
    colocar(diag, e3, 1680, 1785, -740, -845);
    colocar(diag, e4, 1680, 1785, -940, -1045);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Venta = crearAsociacion(ctrl, e1, diag);
    var a_InventarioSucursal = crearAsociacion(ctrl, e2, diag);
    var a_Ropa = crearAsociacion(ctrl, e3, diag);
    var a_Bitacora = crearAsociacion(ctrl, e4, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "filtrarPorRangoFechas(fecha_inicio, fecha_fin)", false, 5, 25, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "7", "clickGenerarOrdenReposicion(variante_id)", false, 9, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarTarjetasKPI(metricas)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "6.1", "actualizarGraficosVentas(tendencias)", true, 8, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "snackBar.open('Orden de reposici\u00f3n sugerida')", true, 12, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "_dashboard_impl(tenant_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "_obtener_alertas_calculadas(tenant_id, db)", false, 6, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "_sugerencias_compra_impl(tenant_id, db)", false, 10, 35, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "3", "return DashboardResponse(total_ventas, ticket_prom)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6", "return AlertasStockResponse(alertas_quiebre)", true, 7, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return SugerenciasResponse(ordenes_sugeridas)", true, 11, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Venta, "2", "db.query(Venta).filter(Venta.empresa_id == tenant_id).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_InventarioSucursal, "5", "db.query(InventarioSucursal).filter(InventarioSucursal.stock_fisico <= 2).all()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e3, diag, a_Ropa, "5.1", "db.query(Ropa).filter(Ropa.id == r_id).first()", false, 7, 25, C_NEGRO);

    finalizarDiag(diag);
}

/* ============================================================================
 * 17. ROB-CU17: Auditoría del Sistema y Registro de Bitácora
 * ============================================================================ */
function generarROB_CU17(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU17 - Auditoría del Sistema y Registro de Bitácora", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU17 - Auditoría del Sistema y Registro de Bitácora", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU17 - Auditoría del Sistema y Registro de Bitácora", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Oficial de Seguridad / Auditor", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : BitacoraAuditoriaComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : BitacoraRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Bitacora", "entity");
    var e2 = crearObjetoBCE(pkg, "Usuario", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -520, -625);
    colocar(diag, e2, 1680, 1785, -740, -845);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Bitacora = crearAsociacion(ctrl, e1, diag);
    var a_Usuario = crearAsociacion(ctrl, e2, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "filtrarPorUsuarioYAccion(usuario_id, accion)", false, 5, 25, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "7", "solicitarDescargaLogCifrado()", false, 9, 35, C_AZUL);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarTablaAuditoria(eventos)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "9", "descargarArchivoBlob('auditoria_cifrada.log')", true, 12, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "listar_bitacora(skip, limit, request, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "obtener_bitacora_confidencial(usuario_id, db)", false, 6, 25, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "7.1", "descargar_log_cifrado(fecha_inicio, fecha_fin, db)", false, 10, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return BitacoraListResponse(items, total)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6", "return BitacoraConfidencialResponse(eventos_sensibles)", true, 8, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "return FileResponse('log_cifrado.bin')", true, 11, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Bitacora, "2", "db.query(Bitacora).order_by(Bitacora.id.desc()).all()", false, 3, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_Usuario, "5", "db.query(Usuario).filter(Usuario.id == usuario_id).first()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e1, diag, a_Bitacora, "8", "_verificar_llave_desarrollador(request)", false, 10, 15, C_OLIVA);

    finalizarDiag(diag);
}

/* ============================================================================
 * 18. ROB-CU18: Backup y Restauración de Base de Datos PostgreSQL
 * ============================================================================ */
function generarROB_CU18(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU18 - Backup y Restauración de Base de Datos PostgreSQL", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("ROB-CU18 - Backup y Restauración de Base de Datos PostgreSQL", "Communication");
    if (!diag.Update()) { diag = pkg.Diagrams.AddNew("ROB-CU18 - Backup y Restauración de Base de Datos PostgreSQL", "Analysis"); diag.Update(); }

    var act = pkg.Elements.AddNew("Superadmin de Sistema", "Actor"); act.Update();
    var bnd = crearObjetoBCE(pkg, "Page : DatabaseManagementComponent", "boundary");
    var ctrl = crearObjetoBCE(pkg, "Gestor : BackupRouter", "control");

    var e1 = crearObjetoBCE(pkg, "Usuario", "entity");
    var e2 = crearObjetoBCE(pkg, "Empresa", "entity");
    var e3 = crearObjetoBCE(pkg, "Bitacora", "entity");

    // Posicionamiento de elementos (Actor con 140px de ancho para etiqueta centrada)
    colocar(diag, act, 550, 690, -620, -740);
    colocar(diag, bnd, 950, 1040, -640, -740);
    colocar(diag, ctrl, 1320, 1410, -630, -730);

    colocar(diag, e1, 1680, 1785, -420, -525);
    colocar(diag, e2, 1680, 1785, -630, -735);
    colocar(diag, e3, 1680, 1785, -840, -945);

    // Asociacion 1: Actor <-> Boundary
    var a1 = crearAsociacion(act, bnd, diag);
    // Asociacion 2: Boundary <-> Control
    var a2 = crearAsociacion(bnd, ctrl, diag);
    // Asociaciones: Control <-> Entidades
    var a_Usuario = crearAsociacion(ctrl, e1, diag);
    var a_Empresa = crearAsociacion(ctrl, e2, diag);
    var a_Bitacora = crearAsociacion(ctrl, e3, diag);

    // Mensajes de Comunicacion BCE
    crearMsg(act, bnd, diag, a1, "1", "ngOnInit()", false, 1, 15, C_NEGRO);
    crearMsg(act, bnd, diag, a1, "4", "solicitarBackupManual(tenant_id, 'dump')", false, 5, 25, C_AZUL);
    crearMsg(act, bnd, diag, a1, "8", "subirArchivoYRestaurar(archivo_dump)", false, 10, 35, C_ROJO);
    crearMsg(act, bnd, diag, a1, "3.1", "renderizarListaBackups(backups)", true, 4, -15, C_VERDE);
    crearMsg(act, bnd, diag, a1, "7", "descargarArchivoDump('backup_tenant.dump')", true, 9, -25, C_VERDE);
    crearMsg(act, bnd, diag, a1, "11", "snackBar.open('Restauraci\u00f3n completada')", true, 14, -35, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "1.1", "listar_backups(tenant_id, db)", false, 2, 15, C_NEGRO);
    crearMsg(bnd, ctrl, diag, a2, "4.1", "generar_backup(tipo, tenant_id, db)", false, 6, 25, C_AZUL);
    crearMsg(bnd, ctrl, diag, a2, "8.1", "restaurar_backup(archivo, tenant_id, db)", false, 11, 35, C_ROJO);
    crearMsg(bnd, ctrl, diag, a2, "3", "return BackupsListResponse(archivos)", true, 3, -15, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "6.1", "return BackupGeneradoResponse(nombre, url)", true, 8, -25, C_VERDE);
    crearMsg(bnd, ctrl, diag, a2, "10.1", "return RestauracionResponse(schema, status='OK')", true, 13, -35, C_VERDE);
    crearMsg(ctrl, e1, diag, a_Usuario, "2", "db.query(Usuario).filter_by(id=uid, es_superadmin=True).first()", false, 2, 15, C_OLIVA);
    crearMsg(ctrl, e2, diag, a_Empresa, "5", "db.query(Empresa).filter_by(id=tenant_id).first()", false, 7, 15, C_NEGRO);
    crearMsg(ctrl, e2, diag, a_Empresa, "5.1", "_generar_dump_sql(schema_name, db_name)", false, 7, 25, C_ROJO);
    crearMsg(ctrl, e3, diag, a_Bitacora, "9", "registrar_bitacora(db, 'RESTORE_POSTGRES_OK', 'schemas', schema)", false, 12, 15, C_VERDE);

    finalizarDiag(diag);
}

// ============================================================================
// UTILIDADES COMUNES (TOPOLOGIA BCE, ORIENTACION DE FLECHAS Y COLORES BGR)
// ============================================================================
function crearObjetoBCE(pkg, nombre, estereotipo) {
    var obj = pkg.Elements.AddNew(nombre, "Object");
    obj.Stereotype = estereotipo;
    obj.Update();
    return obj;
}

function colocar(diag, elem, l, r, t, b) {
    var coords = "l=" + l + ";r=" + r + ";t=" + t + ";b=" + b + ";";
    var diagObj = diag.DiagramObjects.AddNew(coords, "");
    diagObj.ElementID = elem.ElementID;
    diagObj.Update();
    return diagObj;
}

function crearAsociacion(src, dst, diag) {
    var assoc = src.Connectors.AddNew("", "Association");
    assoc.SupplierID = dst.ElementID;
    assoc.Direction = "Unspecified";
    assoc.Update();

    var dlink = diag.DiagramLinks.AddNew("", "");
    dlink.ConnectorID = assoc.ConnectorID;
    dlink.Style = "Mode=1;Color=-1;LWidth=0;";
    dlink.Update();

    return assoc.ConnectorID;
}

function crearMsg(elemA, elemB, diag, assocId, seqStr, label, esRetorno, seqInt, offsetY, color) {
    // Si es retorno, la flecha viaja de elemB a elemA (de derecha a izquierda <-)
    // Si no es retorno, viaja de elemA a elemB (de izquierda a derecha ->)
    var fromElem = esRetorno ? elemB : elemA;
    var toElem   = esRetorno ? elemA : elemB;

    var msg = fromElem.Connectors.AddNew(label, "Collaboration");
    msg.SupplierID = toElem.ElementID;
    msg.Direction = "Source -> Destination";
    msg.DiagramID = diag.DiagramID;
    msg.Update();

    var msgId = msg.ConnectorID;

    // Escapar comillas simples para la consulta SQL
    var safeLabel = label.replace(/'/g, "''");
    var safeSeq = seqStr.replace(/'/g, "''");

    var sql = "UPDATE t_connector SET " +
              "SourceIsAggregate = " + assocId + ", " +
              "SeqNo = " + seqInt + ", " +
              "PDATA1 = '" + (esRetorno ? "Return" : "Synchronous") + "', " +
              "PDATA3 = '" + (esRetorno ? "Return" : "Call") + "', " +
              "PDATA4 = '" + safeSeq + "', " +
              "PDATA5 = 'SX=0;SY=" + offsetY + ";EX=0;EY=0;', " +
              "HeadStyle = 1, " +
              "RouteStyle = 3 " +
              "WHERE Connector_ID = " + msgId;
    try { Repository.Execute(sql); } catch(e) {}

    var dlink = diag.DiagramLinks.AddNew("", "");
    dlink.ConnectorID = msgId;
    dlink.Geometry = "SX=0;SY=" + offsetY + ";EX=0;EY=0;EDGE=2;";
    dlink.Style = "Mode=1;Color=" + color + ";LWidth=0;";
    dlink.Update();

    return msgId;
}

function finalizarDiag(diag) {
    diag.DiagramLinks.Refresh();
    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

main();
