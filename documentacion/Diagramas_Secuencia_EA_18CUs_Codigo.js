//!INC Local Scripts.EAConstants-JScript
/*
 * ==============================================================================
 * PROYECTO: FashionStore Multitenant SaaS (SI2 - Parcial 2)
 * MODULO: DIAGRAMAS DE SECUENCIA UML 2.5 - 18 CASOS DE USO OFICIALES
 * REGLAS ARQUITECTÓNICAS IMPLEMENTADAS:
 *   - Exactamente UNA SOLA Interfaz (Boundary) por Caso de Uso (idéntica a Robustez).
 *   - Exactamente UN SOLO Controlador (Control) por Caso de Uso (idéntico a Robustez).
 *   - Entidades de Base de Datos idénticas a Robustez (1 a 6 entidades).
 *   - Flujo bidireccional 'Va y Viene': Cada llamada síncrona posee su mensaje de retorno.
 *   - Regla de Fragmentos Combinados:
 *       * Fragmentos ALT y OPT inician horizontalmente DESDE LA CLASE INTERFAZ (Boundary).
 *       * Fragmentos LOOP inician estrictamente DESDE LA CLASE CONTROLADOR (Control).
 *   - NOMBRES 100% REALES DE FUNCIONES (FastAPI routers, SQLAlchemy y Angular).
 * ==============================================================================
 */

function main() {
    Repository.EnsureOutputVisible("Script");
    Repository.ClearOutput("Script");
    Repository.WriteOutput("Script", "=== GENERANDO TODOS LOS DIAGRAMAS DE SECUENCIA (18 CUs) ===", 0);

    var currentPackage = Repository.GetTreeSelectedPackage();
    if (currentPackage == null) {
        try {
            var selItem = Repository.GetTreeSelectedItem();
            if (selItem != null && selItem.PackageID) {
                currentPackage = Repository.GetPackageByID(selItem.PackageID);
            }
        } catch(e) {}
    }
    if (currentPackage == null) {
        try {
            for (var m = 0; m < Repository.Models.Count; m++) {
                var model = Repository.Models.GetAt(m);
                for (var p = 0; p < model.Packages.Count; p++) {
                    var pkg = model.Packages.GetAt(p);
                    if (pkg.Name == "PARCIAL2" || pkg.Name.indexOf("PARCIAL") != -1) {
                        currentPackage = pkg;
                        break;
                    }
                }
                if (currentPackage != null) break;
            }
            if (currentPackage == null && Repository.Models.Count > 0 && Repository.Models.GetAt(0).Packages.Count > 0) {
                currentPackage = Repository.Models.GetAt(0).Packages.GetAt(0);
            }
        } catch(e) {}
    }
    if (currentPackage == null) {
        Session.Prompt("Por favor seleccione un Paquete en el Project Browser antes de ejecutar.", 0);
        Repository.WriteOutput("Script", "[ERROR] No se pudo determinar el paquete destino. Seleccione uno en el Project Browser.", 0);
        return;
    }

    Repository.WriteOutput("Script", "Paquete destino seleccionado: " + currentPackage.Name, 0);
    var rootPkg = currentPackage.Packages.AddNew("Diagramas de Secuencia - 18 CUs Oficiales", "");
    rootPkg.Update();

    Repository.WriteOutput("Script", "[1/18] Generando SEQ-CU01...", 0);
    generarSEQ_CU01(rootPkg);
    Repository.WriteOutput("Script", "[2/18] Generando SEQ-CU02...", 0);
    generarSEQ_CU02(rootPkg);
    Repository.WriteOutput("Script", "[3/18] Generando SEQ-CU03...", 0);
    generarSEQ_CU03(rootPkg);
    Repository.WriteOutput("Script", "[4/18] Generando SEQ-CU04...", 0);
    generarSEQ_CU04(rootPkg);
    Repository.WriteOutput("Script", "[5/18] Generando SEQ-CU05...", 0);
    generarSEQ_CU05(rootPkg);
    Repository.WriteOutput("Script", "[6/18] Generando SEQ-CU06...", 0);
    generarSEQ_CU06(rootPkg);
    Repository.WriteOutput("Script", "[7/18] Generando SEQ-CU07...", 0);
    generarSEQ_CU07(rootPkg);
    Repository.WriteOutput("Script", "[8/18] Generando SEQ-CU08...", 0);
    generarSEQ_CU08(rootPkg);
    Repository.WriteOutput("Script", "[9/18] Generando SEQ-CU09...", 0);
    generarSEQ_CU09(rootPkg);
    Repository.WriteOutput("Script", "[10/18] Generando SEQ-CU10...", 0);
    generarSEQ_CU10(rootPkg);
    Repository.WriteOutput("Script", "[11/18] Generando SEQ-CU11...", 0);
    generarSEQ_CU11(rootPkg);
    Repository.WriteOutput("Script", "[12/18] Generando SEQ-CU12...", 0);
    generarSEQ_CU12(rootPkg);
    Repository.WriteOutput("Script", "[13/18] Generando SEQ-CU13...", 0);
    generarSEQ_CU13(rootPkg);
    Repository.WriteOutput("Script", "[14/18] Generando SEQ-CU14...", 0);
    generarSEQ_CU14(rootPkg);
    Repository.WriteOutput("Script", "[15/18] Generando SEQ-CU15...", 0);
    generarSEQ_CU15(rootPkg);
    Repository.WriteOutput("Script", "[16/18] Generando SEQ-CU16...", 0);
    generarSEQ_CU16(rootPkg);
    Repository.WriteOutput("Script", "[17/18] Generando SEQ-CU17...", 0);
    generarSEQ_CU17(rootPkg);
    Repository.WriteOutput("Script", "[18/18] Generando SEQ-CU18...", 0);
    generarSEQ_CU18(rootPkg);

    rootPkg.Packages.Refresh();
    currentPackage.Packages.Refresh();
    Repository.RefreshModelView(currentPackage.PackageID);
    Repository.WriteOutput("Script", "=== [OK] TODOS LOS 18 DIAGRAMAS DE SECUENCIA GENERADOS CON EXITO ===", 0);
    Session.Prompt("Los 18 Diagramas de Secuencia han sido generados exitosamente con sus flujos alt/loop completos!", 0);
}

function crearLifelineBCE(pkg, nombre, estereotipo) {
    var elem = pkg.Elements.AddNew(nombre, "Sequence");
    elem.Stereotype = estereotipo;
    elem.Update();
    return elem;
}

function posicionar(diagram, elem, l, r, t, b) {
    var coords = "l=" + l + ";r=" + r + ";t=" + t + ";b=" + b + ";";
    var dObj = diagram.DiagramObjects.AddNew(coords, "");
    dObj.ElementID = elem.ElementID;
    dObj.Update();
    return dObj;
}

function msg(diag, emisor, receptor, seqNo, texto, esRetorno) {
    try {
        var con = emisor.Connectors.AddNew(texto, "Sequence");
        con.SupplierID = receptor.ElementID;
        con.Direction = "Source -> Destination";
        con.SequenceNo = seqNo;
        if (esRetorno) {
            con.Stereotype = "return";
            con.SubType = "Return";
            con.StyleEx = "LF_synch=0;LF_isReturn=1;";
        } else {
            con.SubType = "SynchCall";
            con.StyleEx = "LF_synch=1;";
        }
        con.Update();
        emisor.Connectors.Refresh();
        return con;
    } catch(e) { return null; }
}

function crearFragmento(pkg, diag, nombre, subtipo, l, r, t, b) {
    try {
        var frag = pkg.Elements.AddNew(nombre, "InteractionFragment");
        frag.Subtype = subtipo; // 0=alt, 1=opt, 3=loop
        frag.Stereotype = (subtipo == 0) ? "alt" : ((subtipo == 3) ? "loop" : "opt");
        frag.Update();
        var coords = "l=" + l + ";r=" + r + ";t=" + t + ";b=" + b + ";";
        var dObj = diag.DiagramObjects.AddNew(coords, "");
        dObj.ElementID = frag.ElementID;
        dObj.Update();
        return frag;
    } catch(e) { return null; }
}

function crearNota(pkg, diag, texto, l, r, t, b) {
    try {
        var note = pkg.Elements.AddNew("", "Text");
        note.Notes = "<b>" + texto + "</b>";
        note.Update();
        var coords = "l=" + l + ";r=" + r + ";t=" + t + ";b=" + b + ";";
        var dObj = diag.DiagramObjects.AddNew(coords, "");
        dObj.ElementID = note.ElementID;
        dObj.Update();
        return note;
    } catch(e) { return null; }
}

/* ============================================================================
 * SEQ-CU01: 1. Registrar Empresa y Contratar Suscripción SaaS
 * ============================================================================ */
function generarSEQ_CU01(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU01 - Secuencia Registrar Empresa y Contratar Suscripció", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU01: Registrar Empresa y Contratar Suscripción Saa", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Administrador Inquilino", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":RegistroEmpresaComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":SuscripcionesRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":PlanSuscripcion (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Empresa (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":SuscripcionEmpresa (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":HistorialCambioPlan (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Planes Activos', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: listar_planes(activos=True, db=db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(PlanSuscripcion).filter_by(activo=True).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: lista_planes_db", true);
    msg(diag, ctrl, bnd, s++, "1.4: return planes", true);
    msg(diag, bnd, act, s++, "1.5: listaPlanes = planes", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nRegistrar Empresa y Pago', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: registrarEmpresa()", false);
    msg(diag, bnd, act, s++, "2.1: renderizarFormularioRegistro()", true);
    msg(diag, act, bnd, s++, "3: submitFormulario(empresa_in, admin_in, plan_id)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [datos v\u00e1lidos y pago autorizado]', 0, 240, 1920, -460, -870);
    msg(diag, bnd, ctrl, s++, "3.1: registrar_empresa_publica(req, db)", false);
    msg(diag, ctrl, ent1, s++, "3.2: db.query(Empresa).filter(Empresa.nombre == req.nombre).first()", false);
    msg(diag, ent1, ctrl, s++, "3.3: [nombre_disponible = True]", true);
    msg(diag, ctrl, ent1, s++, "3.4: db.add(Empresa(nombre=req.nombre, schema_name=schema))", false);
    msg(diag, ent1, ctrl, s++, "3.5: [empresa_creada (+tenant_id)]", true);
    msg(diag, ctrl, ent3, s++, "3.6: db.add(Usuario(username=admin, email=email, rol=\'Superadmin\'))", false);
    msg(diag, ent3, ctrl, s++, "3.7: [usuario_admin_creado]", true);
    msg(diag, ctrl, bnd, s++, "3.8: return IntentoPagoResponse(client_secret)", true);
    msg(diag, bnd, act, s++, "3.9: stripe.confirmCardPayment(client_secret)", false);
    msg(diag, act, bnd, s++, "3.10: confirmarPagoStripe(token)", false);
    msg(diag, bnd, ctrl, s++, "3.11: crear_intento_pago(pago_in, db)", false);
    msg(diag, ctrl, ent2, s++, "3.12: db.add(SuscripcionEmpresa(empresa_id, plan_id, estado=\'activa\'))", false);
    msg(diag, ent2, ctrl, s++, "3.13: [suscripcion_activa_ok]", true);
    msg(diag, ctrl, ent4, s++, "3.14: db.add(HistorialCambioPlan(empresa_id, plan_id, motivo=\'ALTA\'))", false);
    msg(diag, ent4, ctrl, s++, "3.15: [historial_registrado]", true);
    msg(diag, ctrl, bnd, s++, "3.16: return EmpresaPublicaResponse(tenant_id, subdominio)", true);
    msg(diag, bnd, act, s++, "3.17: snackBar.open(\'Empresa registrada con \u00e9xito\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "3.18: raise HTTPException(400, \'Nombre o dominio en uso\')", true);
    msg(diag, bnd, act, s++, "3.19: mostrarAlertaError(\'Nombre de empresa ya registrado\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU02: 2. Autenticación y Control de Acceso Multitenant (JWT)
 * ============================================================================ */
function generarSEQ_CU02(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU02 - Secuencia Autenticación y Control de Acceso Multit", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU02: Autenticación y Control de Acceso Multitenant", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Usuario del Sistema", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":LoginComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":SeguridadRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Empresa (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Rol (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nApertura de Login', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: abrirLogin()", false);
    msg(diag, bnd, act, s++, "1.1: renderizarFormularioLogin()", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nAutenticaci\u00f3n JWT', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: onSubmitLogin(email, password)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [credenciales v\u00e1lidas y tenant activo]', 0, 240, 1690, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: login(form_data, db)", false);
    msg(diag, ctrl, ent0, s++, "2.2: db.query(Usuario).filter(Usuario.email == form_data.username).first()", false);
    msg(diag, ent0, ctrl, s++, "2.3: [user_db_found]", true);
    msg(diag, ctrl, ent0, s++, "2.4: verify_password(form_data.password, user.password_hash)", false);
    msg(diag, ent0, ctrl, s++, "2.5: [password_valid = True]", true);
    msg(diag, ctrl, ent1, s++, "2.6: db.query(Empresa).filter(Empresa.id == user.empresa_id).first()", false);
    msg(diag, ent1, ctrl, s++, "2.7: [empresa_activa = True]", true);
    msg(diag, ctrl, ent1, s++, "2.8: crear_access_token(data={\'sub\': email, \'tenant_id\': tid})", false);
    msg(diag, ent1, ctrl, s++, "2.9: [jwt_token_string]", true);
    msg(diag, ctrl, ent3, s++, "2.10: registrar_bitacora(db, \'LOGIN\', \'usuarios\', str(user.id), \'Inicio OK\')", false);
    msg(diag, ent3, ctrl, s++, "2.11: [bitacora_registrada]", true);
    msg(diag, ctrl, bnd, s++, "2.12: return TokenResponse(access_token, token_type=\'bearer\')", true);
    msg(diag, bnd, act, s++, "2.13: authService.guardarToken(access_token)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.14: raise HTTPException(401, \'Credenciales incorrectas\')", true);
    msg(diag, bnd, act, s++, "2.15: mostrarAlertaError(\'Usuario o contrase\u00f1a no v\u00e1lidos\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nCargar Perfil y Permisos', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: solicitarPermisosPerfil()", false);
    msg(diag, bnd, ctrl, s++, "3.1: obtener_perfil(current_user, db)", false);
    msg(diag, ctrl, ent2, s++, "3.2: db.query(Rol).filter(Rol.id == user.rol_id).first()", false);
    msg(diag, ent2, ctrl, s++, "3.3: [rol_y_permisos_db]", true);
    msg(diag, ctrl, bnd, s++, "3.4: return PerfilResponse(usuario, permisos, tenant_id)", true);
    msg(diag, bnd, act, s++, "3.5: router.navigate([\'/dashboard\'])", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU03: 3. Administrar Sucursales y Puntos de Caja por Empresa
 * ============================================================================ */
function generarSEQ_CU03(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU03 - Secuencia Administrar Sucursales y Puntos de Caja ", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU03: Administrar Sucursales y Puntos de Caja por E", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Administrador Empresa", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":SucursalComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":SucursalesRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Sucursal (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Empresa (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Sucursales', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: listar_sucursales(request, db, tenant_id)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Sucursal).options(joinedload(Sucursal.empresa)).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [sucursales_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return query.filter(Sucursal.empresa_id == tenant_id).all()", true);
    msg(diag, bnd, act, s++, "1.5: sucursalesFiltradas = data", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nCrear Sucursal', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: abrirFormulario()", false);
    msg(diag, bnd, act, s++, "2.1: renderizarModalSucursal()", true);
    msg(diag, act, bnd, s++, "3: guardarSucursal(sucursalForm.value)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [l\u00edmite de sucursales del plan no excedido]', 0, 240, 1460, -460, -870);
    msg(diag, bnd, ctrl, s++, "3.1: crear_sucursal(sucursal_in, request, db, tenant_id)", false);
    msg(diag, ctrl, ent1, s++, "3.2: verificar_limite_sucursales(target_empresa_id, db)", false);
    msg(diag, ent1, ctrl, s++, "3.3: [limite_valido = True]", true);
    msg(diag, ctrl, ent0, s++, "3.4: db.add(nueva_sucursal); db.flush()", false);
    msg(diag, ent0, ctrl, s++, "3.5: [nueva_sucursal (+id=12)]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada variante de prenda activa]', 3, 480, 1460, -550, -680);
    msg(diag, ctrl, ent2, s++, "3.6: db.add(InventarioSucursal(sucursal_id, var.id, stock_fisico=0))", false);
    msg(diag, ent2, ctrl, s++, "3.7: [stock_inicial_confirmado]", true);
    msg(diag, ctrl, bnd, s++, "3.8: return nueva_sucursal", true);
    msg(diag, bnd, act, s++, "3.9: snackBar.open(\'Sucursal registrada con \u00e9xito\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "3.10: raise HTTPException(400, \'L\u00edmite de sucursales alcanzado\')", true);
    msg(diag, bnd, act, s++, "3.11: snackBar.open(\'Error: Actualice su plan SaaS\', \'Cerrar\')", true);

    // --- FLUJO 4 ---
    crearNota(pkg, diag, 'FLUJO 4\nEliminar Sucursal', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "4: eliminarSucursal(item)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [usuario confirma eliminaci\u00f3n]', 0, 240, 1460, -1090, -1500);
    msg(diag, bnd, ctrl, s++, "4.1: eliminar_sucursal(sucursal_id, request, db)", false);
    msg(diag, ctrl, ent2, s++, "4.2: db.query(InventarioSucursal).filter_by(sucursal_id=id).delete()", false);
    msg(diag, ent2, ctrl, s++, "4.3: [inventario_limpiado]", true);
    msg(diag, ctrl, ent0, s++, "4.4: db.delete(sucursal); db.commit()", false);
    msg(diag, ent0, ctrl, s++, "4.5: [sucursal_eliminada]", true);
    msg(diag, ctrl, bnd, s++, "4.6: return None (HTTP 204 No Content)", true);
    msg(diag, bnd, act, s++, "4.7: cargarSucursales()", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, bnd, act, s++, "4.8: cerrarDialogo()", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU04: 4. Administrar Catálogo, Tallas, Colores y Temporadas
 * ============================================================================ */
function generarSEQ_CU04(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU04 - Secuencia Administrar Catálogo, Tallas, Colores y ", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU04: Administrar Catálogo, Tallas, Colores y Tempo", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Encargado de Cat\u00e1logo", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":RopaComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":CatalogoRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Ropa (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Talla (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Color (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":Temporada (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Prendas', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: listar_prendas(db, tenant_id)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Ropa).filter(Ropa.empresa_id == tenant_id).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [prendas_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return db.query(Ropa).filter(...).all()", true);
    msg(diag, bnd, act, s++, "1.5: prendas = data", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nRegistrar Prenda y Matriz', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: abrirModalCrearPrenda()", false);
    msg(diag, bnd, ctrl, s++, "2.1: obtener_catalogos_auxiliares(db)", false);
    msg(diag, ctrl, ent2, s++, "2.2: db.query(Talla).filter(Talla.activo == True).all()", false);
    msg(diag, ent2, ctrl, s++, "2.3: [tallas_db]", true);
    msg(diag, ctrl, ent4, s++, "2.4: db.query(Temporada).filter(Temporada.activo == True).all()", false);
    msg(diag, ent4, ctrl, s++, "2.5: [temporadas_db]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return CatalogosAuxiliares(tallas, temporadas)", true);
    msg(diag, bnd, act, s++, "2.7: renderizarFormularioConSelects()", true);
    msg(diag, act, bnd, s++, "3: guardarPrenda(ropa_in)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [datos de prenda y c\u00f3digos SKU v\u00e1lidos]', 0, 240, 1920, -460, -870);
    msg(diag, bnd, ctrl, s++, "3.1: crear_prenda(ropa_in, db, tenant_id)", false);
    msg(diag, ctrl, ent0, s++, "3.2: db.add(nueva_ropa); db.commit()", false);
    msg(diag, ent0, ctrl, s++, "3.3: [nueva_ropa (+ropa_id)]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada combinaci\u00f3n de talla y color]', 3, 480, 1920, -550, -680);
    msg(diag, ctrl, ent1, s++, "3.4: db.add(VariantePrenda(ropa_id, talla_id, color_id, sku))", false);
    msg(diag, ent1, ctrl, s++, "3.5: [variante_creada_ok]", true);
    msg(diag, ctrl, bnd, s++, "3.6: return nueva_prenda", true);
    msg(diag, bnd, act, s++, "3.7: snackBar.open(\'Prenda y matriz registradas\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "3.8: raise HTTPException(422, \'SKU ya existente o datos incompletos\')", true);
    msg(diag, bnd, act, s++, "3.9: mostrarError(\'SKU duplicado\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU05: 5. Consultar Catálogo y Disponibilidad en Modo Offline
 * ============================================================================ */
function generarSEQ_CU05(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU05 - Secuencia Consultar Catálogo y Disponibilidad en M", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU05: Consultar Catálogo y Disponibilidad en Modo O", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cliente / Vendedor POS", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":CatalogoPWAComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":CatalogoDisponibilidadRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Ropa (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nSincronizar Cat\u00e1logo Online', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: consultar_catalogo_con_disponibilidad(sucursal_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Ropa).filter(Ropa.activo == True).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [prendas_activas]", true);
    msg(diag, ctrl, ent1, s++, "1.4: db.query(VariantePrenda).filter_by(ropa_id=id).all()", false);
    msg(diag, ent1, ctrl, s++, "1.5: [variantes_activas]", true);
    msg(diag, ctrl, bnd, s++, "1.6: return respuesta_catalogo_disponible", true);
    msg(diag, bnd, act, s++, "1.7: indexedDB.guardarLotePrendas(items)", true);
    msg(diag, bnd, act, s++, "1.8: renderizarCatalogo(prendas)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nConsulta y Filtro Offline/Online', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: filtrarPorCategoriaOTalla(cat, talla)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [conexi\u00f3n activa a servidor central]', 0, 240, 1460, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: obtener_disponibilidad_prenda(ropa_id, sucursal_id, db)", false);
    msg(diag, ctrl, ent2, s++, "2.2: db.query(InventarioSucursal).filter_by(sucursal_id=sid).all()", false);
    msg(diag, ent2, ctrl, s++, "2.3: [stock_db]", true);
    msg(diag, ctrl, ent2, s++, "2.4: _calcular_estado_stock(stock_fisico, stock_reservado)", false);
    msg(diag, ent2, ctrl, s++, "2.5: [estado_stock = DISPONIBLE]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return detalle_disponibilidad", true);
    msg(diag, bnd, act, s++, "2.7: actualizarVistaStockEnVivo(detalle)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, bnd, act, s++, "2.8: verificarDisponibilidadOffline(prenda_id)", false);
    msg(diag, bnd, act, s++, "2.9: mostrarDisponibilidadLocal(indexedDB.stock_cached)", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU06: 6. Utilizar Vestidor Virtual con Realidad Aumentada (Móvil)
 * ============================================================================ */
function generarSEQ_CU06(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU06 - Secuencia Utilizar Vestidor Virtual con Realidad A", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU06: Utilizar Vestidor Virtual con Realidad Aument", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cliente M\u00f3vil", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":ARVestidorScreen", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":ARVestidorRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Ropa (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nCargar Activos 3D', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: abrirVestidorAR(prenda_id)", false);
    msg(diag, bnd, ctrl, s++, "1.1: obtener_metadatos_ar_prenda(ropa_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Ropa).filter(Ropa.id == ropa_id).first()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [ropa_data_3d]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return MetadatosARResponse(modelo_3d_url, textura_url)", true);
    msg(diag, bnd, act, s++, "1.5: inicializarARCorePlugin()", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nValidar Ajuste Corporal AR', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: apuntarCamaraYValidarPose()", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [pose detectada y confianza > 85%]', 0, 240, 1230, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: validar_ajuste_corporal(request, db)", false);
    msg(diag, ctrl, ent1, s++, "2.2: db.query(VariantePrenda).filter_by(ropa_id=ropa_id).all()", false);
    msg(diag, ent1, ctrl, s++, "2.3: [variantes_disponibles]", true);
    msg(diag, ctrl, ent0, s++, "2.4: _detectar_categoria_garment(ropa.categoria_nombre)", false);
    msg(diag, ent0, ctrl, s++, "2.5: [categoria_ok]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return ValidarAjusteResponse(talla_sugerida, confianza)", true);
    msg(diag, bnd, act, s++, "2.7: superponerPrenda3DEnCamara()", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.8: return ErrorAjusteResponse(\'Reajuste iluminaci\u00f3n\')", true);
    msg(diag, bnd, act, s++, "2.9: mostrarGuiaEnPantalla(\'P\u00f3ngase de pie frente al lente\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU07: 7. Gestionar Reservas Web-to-Store con Soporte Offline
 * ============================================================================ */
function generarSEQ_CU07(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU07 - Secuencia Gestionar Reservas Web-to-Store con Sopo", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU07: Gestionar Reservas Web-to-Store con Soporte O", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cliente / Vendedor Tienda", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":CrearReservaDialogComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":ReservasRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Reserva (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Sucursal (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nConsultar Tiendas con Stock', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: abrirModalReserva(ropa_id)", false);
    msg(diag, bnd, ctrl, s++, "1.1: consultar_catalogo_con_disponibilidad(sucursal_id, db)", false);
    msg(diag, ctrl, ent1, s++, "1.2: db.query(InventarioSucursal).filter_by(sucursal_id=sid).first()", false);
    msg(diag, ent1, ctrl, s++, "1.3: [stock_disponible > 0]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return sucursales_disponibles", true);
    msg(diag, bnd, act, s++, "1.5: sucursalesConStock = data", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nConfirmar Reserva (Web-to-Store)', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: confirmarReserva(sucursal_id, variante_id)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [stock disponible para reserva]', 0, 240, 1690, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: crear_reserva(reserva_in, db, current_user)", false);
    msg(diag, ctrl, ent0, s++, "2.2: db.add(Reserva(codigo=uuid4(), expira_en=now+48h))", false);
    msg(diag, ent0, ctrl, s++, "2.3: [reserva_registrada (+id, +codigo)]", true);
    msg(diag, ctrl, ent1, s++, "2.4: inv.stock_reservado += 1; db.commit()", false);
    msg(diag, ent1, ctrl, s++, "2.5: [stock_bloqueado_ok]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return ReservaResponse(codigo, expira_en, estado=\'PENDIENTE\')", true);
    msg(diag, bnd, act, s++, "2.7: snackBar.open(\'Reserva confirmada. Vigencia 48h\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.8: raise HTTPException(400, \'Prenda sin stock para reserva\')", true);
    msg(diag, bnd, act, s++, "2.9: mostrarError(\'No se pudo reservar la prenda\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nRetiro Presencial en Tienda', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: confirmarRetiroPresencial(reserva_id)", false);
    msg(diag, bnd, ctrl, s++, "3.1: confirmar_retiro(reserva_id, request, db)", false);
    msg(diag, ctrl, ent1, s++, "3.2: inv.stock_reservado -= 1; inv.stock_fisico -= 1", false);
    msg(diag, ent1, ctrl, s++, "3.3: [stock_actualizado_ok]", true);
    msg(diag, ctrl, bnd, s++, "3.4: return ReservaResponse(estado=\'COMPLETADA\')", true);
    msg(diag, bnd, act, s++, "3.5: mostrarTicketRetiroExitoso()", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU08: 8. Gestionar Carrito de Compras Persistente
 * ============================================================================ */
function generarSEQ_CU08(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU08 - Secuencia Gestionar Carrito de Compras Persistente", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU08: Gestionar Carrito de Compras Persistente", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cliente Registrado", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":CarritoComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":CarritoPersistenteRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Carrito (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":ItemCarrito (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nCargar Carrito', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: obtener_carrito_persistente(cliente_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Carrito).filter(Carrito.cliente_id == cid).first()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [carrito_data_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return _formatear_carrito(carrito)", true);
    msg(diag, bnd, act, s++, "1.5: renderizarCarrito(items, total)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nAgregar Prenda al Carrito', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: agregarAlCarrito(variante_id, cantidad)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [stock disponible para variante]', 0, 240, 1460, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: agregar_item_persistente(item_in, db)", false);
    msg(diag, ctrl, ent2, s++, "2.2: db.query(VariantePrenda).filter_by(id=vid).first()", false);
    msg(diag, ent2, ctrl, s++, "2.3: [variante_activa = True]", true);
    msg(diag, ctrl, ent1, s++, "2.4: db.add(ItemCarrito(carrito_id, variante_id, cantidad)); db.commit()", false);
    msg(diag, ent1, ctrl, s++, "2.5: [item_guardado_ok]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return CarritoResponse(items, total_calculado)", true);
    msg(diag, bnd, act, s++, "2.7: localStorage.setItem(\'carrito_backup\', json)", true);
    msg(diag, bnd, act, s++, "2.8: actualizarBadgeCarrito(total_items)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.9: raise HTTPException(400, \'Variante agotada\')", true);
    msg(diag, bnd, act, s++, "2.10: mostrarAlertaError(\'No hay existencias\')", true);

    // --- FLUJO 4 ---
    crearNota(pkg, diag, 'FLUJO 4\nEliminar Item del Carrito', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: eliminarItemCarrito(item_id)", false);
    msg(diag, bnd, ctrl, s++, "3.1: eliminar_item_persistente(item_id, db)", false);
    msg(diag, ctrl, ent1, s++, "3.2: db.query(ItemCarrito).filter_by(id=item_id).delete()", false);
    msg(diag, ent1, ctrl, s++, "3.3: [item_eliminado_ok]", true);
    msg(diag, ctrl, bnd, s++, "3.4: return CarritoResponse(items_actualizados)", true);
    msg(diag, bnd, act, s++, "3.5: renderizarCarrito(items_actualizados)", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU09: 9. Procesar Ventas POS con Resiliencia Offline
 * ============================================================================ */
function generarSEQ_CU09(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU09 - Secuencia Procesar Ventas POS con Resiliencia Offl", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU09: Procesar Ventas POS con Resiliencia Offline", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cajero / Vendedor POS", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":CrearVentaComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":VentasRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":DetalleVenta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Cliente (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");
    var ent5 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);
    posicionar(diag, ent5, 1890, 2000, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nEscaneo de Prenda en Caja', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: escanearCodigoBarras(sku)", false);
    msg(diag, bnd, ctrl, s++, "1.1: consultar_stock_rapido(sku, sucursal_id, db)", false);
    msg(diag, ctrl, ent2, s++, "1.2: db.query(InventarioSucursal).filter_by(sucursal_id=sid).first()", false);
    msg(diag, ent2, ctrl, s++, "1.3: [prenda_disponible]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return DetallePrendaEscaneada(variante, precio)", true);
    msg(diag, bnd, act, s++, "1.5: agregarItemGridVenta(item)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nCobro en Caja POS', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: cobrarVentaEfectivo(monto, cliente_id)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [stock disponible y pago en efectivo exacto/mayor]', 0, 240, 2150, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: procesar_venta_pos(venta_in, request, db)", false);
    msg(diag, ctrl, ent0, s++, "2.2: _ejecutar_venta_pos_core(db, venta_datos, sid, uid)", false);
    msg(diag, ctrl, ent0, s++, "2.3: db.add(Venta(tipo=\'POS\', total=total, estado=\'PAGADA\'))", false);
    msg(diag, ent0, ctrl, s++, "2.4: [venta_creada (+venta_id)]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada prenda en el ticket de venta]', 3, 480, 2150, -550, -680);
    msg(diag, ctrl, ent1, s++, "2.5: db.add(DetalleVenta(venta_id, variante_id, cantidad, precio))", false);
    msg(diag, ent1, ctrl, s++, "2.6: [detalle_insertado]", true);
    msg(diag, ctrl, ent2, s++, "2.7: inv.stock_fisico -= cantidad; db.commit()", false);
    msg(diag, ent2, ctrl, s++, "2.8: [stock_descontado_ok]", true);
    msg(diag, ctrl, ent5, s++, "2.9: registrar_bitacora(db, \'VENTA_POS\', \'ventas\', str(venta.id))", false);
    msg(diag, ent5, ctrl, s++, "2.10: [auditoria_registrada]", true);
    msg(diag, ctrl, bnd, s++, "2.11: return VentaResponse(id, codigo, total, estado=\'COMPLETADA\')", true);
    msg(diag, bnd, act, s++, "2.12: imprimirTicketPOS(numero_factura)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.13: raise HTTPException(400, \'Stock insuficiente en sucursal\')", true);
    msg(diag, bnd, act, s++, "2.14: snackBar.open(\'Venta rechazada: Stock agotado\', \'OK\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nSincronizaci\u00f3n Lote Offline', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: sincronizarVentasOffline()", false);
    msg(diag, bnd, ctrl, s++, "3.1: sincronizar_lote_ventas_offline(lote, db)", false);
    msg(diag, ctrl, bnd, s++, "3.2: return SincronizacionResponse(procesadas, errores)", true);
    msg(diag, bnd, act, s++, "3.3: snackBar.open(\'Lote offline sincronizado\', \'OK\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU10: 10. Procesar Ventas Digitales con Pasarela Stripe
 * ============================================================================ */
function generarSEQ_CU10(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU10 - Secuencia Procesar Ventas Digitales con Pasarela S", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU10: Procesar Ventas Digitales con Pasarela Stripe", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Comprador Online", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":PasarelaStripeComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":StripePagosRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":DetalleVenta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":TransaccionPago (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":Empresa (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nInicializar Pasarela Stripe', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: iniciarCheckout()", false);
    msg(diag, bnd, ctrl, s++, "1.1: obtener_configuracion_stripe(empresa_id, db)", false);
    msg(diag, ctrl, ent4, s++, "1.2: db.query(Empresa).filter_by(id=empresa_id).first()", false);
    msg(diag, ent4, ctrl, s++, "1.3: [stripe_keys_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return StripeConfigResponse(publishable_key)", true);
    msg(diag, bnd, act, s++, "1.5: stripe.elements().create(\'card\')", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nIntento de Pago y Confirmaci\u00f3n', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: ingresarDatosTarjetaYConfirmar()", false);
    msg(diag, bnd, ctrl, s++, "2.1: crear_intento_pago(pago_in, db)", false);
    msg(diag, ctrl, ent2, s++, "2.2: db.add(TransaccionPago(monto, metodo=\'STRIPE\', estado=\'PENDING\'))", false);
    msg(diag, ent2, ctrl, s++, "2.3: [transaccion_creada]", true);
    msg(diag, ctrl, bnd, s++, "2.4: return IntentoPagoResponse(client_secret, payment_intent_id)", true);
    msg(diag, bnd, act, s++, "2.5: stripe.confirmCardPayment(client_secret)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [cargo en tarjeta aprobado por Stripe]', 0, 240, 1920, -460, -870);
    msg(diag, act, bnd, s++, "2.6: notificarPagoStripeExitoso()", false);
    msg(diag, bnd, ctrl, s++, "2.7: confirmar_pago_stripe(request, db)", false);
    msg(diag, ctrl, ent0, s++, "2.8: db.add(Venta(tipo=\'ECOMMERCE\', estado=\'PAGADA\'))", false);
    msg(diag, ent0, ctrl, s++, "2.9: [venta_online_creada (+id)]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada prenda en el pedido online]', 3, 480, 1920, -550, -680);
    msg(diag, ctrl, ent1, s++, "2.10: db.add(DetalleVenta(venta_id, variante_id, cantidad, precio))", false);
    msg(diag, ent1, ctrl, s++, "2.11: [detalle_guardado]", true);
    msg(diag, ctrl, ent3, s++, "2.12: inv.stock_fisico -= detalle.cantidad; db.commit()", false);
    msg(diag, ent3, ctrl, s++, "2.13: [stock_actualizado]", true);
    msg(diag, ctrl, bnd, s++, "2.14: return VentaResponse(id, estado=\'PAGADO_STRIPE\')", true);
    msg(diag, bnd, act, s++, "2.15: router.navigate([\'/pedido-confirmado\'])", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, bnd, act, s++, "2.16: snackBar.open(\'Tarjeta declinada por banco\', \'Cerrar\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU11: 11. Procesar Cobros con Código QR Simple
 * ============================================================================ */
function generarSEQ_CU11(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU11 - Secuencia Procesar Cobros con Código QR Simple", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU11: Procesar Cobros con Código QR Simple", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Cliente / Cajero POS", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":CobroQrComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":CobroQRRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":CobroQR (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Sucursal (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nGenerar QR Interoperable', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: generarCobroQR(monto, concepto)", false);
    msg(diag, bnd, ctrl, s++, "1.1: generar_qr_simple(solicitud, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.add(CobroQR(monto, estado=\'GENERADO\', alias=\'FASHIONSTORE\'))", false);
    msg(diag, ent0, ctrl, s++, "1.3: [cobro_qr_creado (+id)]", true);
    msg(diag, ctrl, ent0, s++, "1.4: _generar_imagen_qr_base64(datos_bancarios)", false);
    msg(diag, ent0, ctrl, s++, "1.5: [imagen_qr_base64]", true);
    msg(diag, ctrl, bnd, s++, "1.6: return CobroQRResponse(id, qr_base64, estado=\'PENDIENTE\')", true);
    msg(diag, bnd, act, s++, "1.7: renderizarImagenQR(qr_base64)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nConciliaci\u00f3n y Pago QR', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: simularPagoAppBancaria(qr_id)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [notificaci\u00f3n de abono bancario exitoso]', 0, 240, 1690, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: simular_pago_bancario_qr(cobro_id, db)", false);
    msg(diag, ctrl, ent0, s++, "2.2: cobro.estado = \'PAGADO\'; db.flush()", false);
    msg(diag, ent0, ctrl, s++, "2.3: [cobro_conciliado]", true);
    msg(diag, ctrl, ent1, s++, "2.4: db.add(Venta(tipo=\'QR\', total=monto, estado=\'PAGADA\'))", false);
    msg(diag, ent1, ctrl, s++, "2.5: [venta_qr_registrada]", true);
    msg(diag, ctrl, ent3, s++, "2.6: registrar_bitacora(db, \'PAGO_QR_OK\', \'cobros_qr\', str(cobro.id))", false);
    msg(diag, ent3, ctrl, s++, "2.7: [auditoria_qr_guardada]", true);
    msg(diag, ctrl, bnd, s++, "2.8: return CobroQRResponse(estado=\'PAGADO\', venta_id)", true);
    msg(diag, bnd, act, s++, "2.9: snackBar.open(\'Cobro QR Confirmado\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, bnd, ctrl, s++, "2.10: consultar_estado_qr(cobro_id, db)", false);
    msg(diag, ctrl, bnd, s++, "2.11: return EstadoQRResponse(estado=\'PENDIENTE\')", true);
    msg(diag, bnd, act, s++, "2.12: mostrarEstadoEsperandoPago()", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU12: 12. Gestionar Devoluciones y Cambios de Talla (Garantía 7 Días)
 * ============================================================================ */
function generarSEQ_CU12(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU12 - Secuencia Gestionar Devoluciones y Cambios de Tall", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU12: Gestionar Devoluciones y Cambios de Talla (Ga", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Encargado de Tienda / Cliente", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":GestionDevolucionesComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":DevolucionesRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Devolucion (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":DetalleVenta (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nVerificar Garant\u00eda (<= 7 d\u00edas)', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: buscarVenta(numero_factura)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [compra dentro del plazo de 7 d\u00edas]', 0, 240, 1920, -260, -670);
    msg(diag, bnd, ctrl, s++, "1.1: verificar_elegibilidad(venta_id, db)", false);
    msg(diag, ctrl, ent1, s++, "1.2: _calcular_horas_transcurridas(venta.fecha_venta)", false);
    msg(diag, ent1, ctrl, s++, "1.3: [horas <= 168h (7 d\u00edas)]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return ElegibilidadResponse(elegible=True, dias_transcurridos)", true);
    msg(diag, bnd, act, s++, "1.5: mostrarDetalleVentaYGarantia(dias_transcurridos)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "1.6: return ElegibilidadResponse(elegible=False, motivo=\'Garant\u00eda vencida\')", true);
    msg(diag, bnd, act, s++, "1.7: snackBar.open(\'Garant\u00eda expirada (+7 d\u00edas)\', \'Cerrar\')", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nProcesar Cambio de Talla', 10, 130, -720, -790);
    msg(diag, act, bnd, s++, "2: solicitarCambioTalla(detalle_id, nueva_talla_id)", false);
    msg(diag, bnd, ctrl, s++, "2.1: solicitar_devolucion(devolucion_in, db)", false);
    msg(diag, ctrl, ent0, s++, "2.2: db.add(Devolucion(venta_id, motivo, estado=\'PENDIENTE\'))", false);
    msg(diag, ent0, ctrl, s++, "2.3: [devolucion_registrada (+id)]", true);
    msg(diag, ctrl, bnd, s++, "2.4: return DevolucionResponse(id, estado=\'SOLICITADO\')", true);
    msg(diag, bnd, act, s++, "2.5: snackBar.open(\'Devoluci\u00f3n autorizada\', \'OK\')", true);
    msg(diag, act, bnd, s++, "3: aprobarDevolucionYProcesar()", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [stock disponible en la nueva talla]', 0, 240, 1920, -890, -1300);
    msg(diag, bnd, ctrl, s++, "3.1: procesar_cambio_talla(devolucion_id, cambio_in, db)", false);
    msg(diag, ctrl, ent3, s++, "3.2: inv_orig.stock_fisico += 1; inv_dest.stock_fisico -= 1", false);
    msg(diag, ent3, ctrl, s++, "3.3: [stock_ajustado_ok]", true);
    msg(diag, ctrl, ent0, s++, "3.4: devolucion.estado = \'APROBADA\'; db.commit()", false);
    msg(diag, ent0, ctrl, s++, "3.5: [devolucion_completada]", true);
    msg(diag, ctrl, bnd, s++, "3.6: return DevolucionResponse(estado=\'COMPLETADO\', stock_ok=True)", true);
    msg(diag, bnd, act, s++, "3.7: imprimirComprobanteCambio()", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "3.8: raise HTTPException(400, \'Sin stock en la nueva talla solicitada\')", true);
    msg(diag, bnd, act, s++, "3.9: mostrarError(\'Stock no disponible para cambio\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU13: 13. Gestionar Traspasos de Mercadería entre Sucursales
 * ============================================================================ */
function generarSEQ_CU13(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU13 - Secuencia Gestionar Traspasos de Mercadería entre ", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU13: Gestionar Traspasos de Mercadería entre Sucur", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Encargado de Almac\u00e9n", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":TraspasoComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":TraspasosRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Traspaso (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":DetalleTraspaso (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Sucursal (DB)", "entity");
    var ent4 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);
    posicionar(diag, ent4, 1660, 1770, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Traspasos', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: _listar_traspasos_impl(empresa_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Traspaso).filter(Traspaso.empresa_id == eid).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [traspasos_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return lista_traspasos", true);
    msg(diag, bnd, act, s++, "1.5: traspasosFiltrados = data", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nSolicitar Traspaso', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: abrirModalTraspaso()", false);
    msg(diag, bnd, act, s++, "2.1: renderizarFormularioTraspaso()", true);
    msg(diag, act, bnd, s++, "3: solicitarTraspaso(origen_id, destino_id, items)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [stock disponible en sucursal de origen]', 0, 240, 1920, -460, -870);
    msg(diag, bnd, ctrl, s++, "3.1: _crear_traspaso_impl(traspaso_in, db)", false);
    msg(diag, ctrl, ent0, s++, "3.2: db.add(Traspaso(origen_id, destino_id, estado=\'SOLICITADO\'))", false);
    msg(diag, ent0, ctrl, s++, "3.3: [traspaso_creado (+id)]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada variante a transferir]', 3, 480, 1920, -550, -680);
    msg(diag, ctrl, ent2, s++, "3.4: inv_origen.stock_fisico -= cant; db.commit()", false);
    msg(diag, ent2, ctrl, s++, "3.5: [stock_origen_descontado]", true);
    msg(diag, ctrl, bnd, s++, "3.6: return TraspasoResponse(estado=\'EN_TRANSITO\')", true);
    msg(diag, bnd, act, s++, "3.7: snackBar.open(\'Traspaso en tr\u00e1nsito\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "3.8: raise HTTPException(400, \'Stock de origen insuficiente\')", true);
    msg(diag, bnd, act, s++, "3.9: mostrarError(\'No hay existencias suficientes para traspaso\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nRecepcionar en Destino', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "4: confirmarRecepcion(traspaso_id)", false);
    msg(diag, bnd, ctrl, s++, "4.1: _confirmar_recepcion_impl(traspaso_id, db)", false);
    msg(diag, ctrl, ent2, s++, "4.2: inv_destino.stock_fisico += cant; traspaso.estado = \'RECEPCIONADO\'", false);
    msg(diag, ent2, ctrl, s++, "4.3: [stock_destino_incrementado]", true);
    msg(diag, ctrl, ent4, s++, "4.4: registrar_bitacora(db, \'TRASPASO_OK\', \'traspasos\', str(id))", false);
    msg(diag, ent4, ctrl, s++, "4.5: [auditoria_guardada]", true);
    msg(diag, ctrl, bnd, s++, "4.6: return TraspasoResponse(estado=\'RECEPCIONADO\')", true);
    msg(diag, bnd, act, s++, "4.7: snackBar.open(\'Mercader\u00eda recepcionada en destino\', \'OK\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU14: 14. Sincronización Automática de Datos Offline a Online
 * ============================================================================ */
function generarSEQ_CU14(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU14 - Secuencia Sincronización Automática de Datos Offli", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU14: Sincronización Automática de Datos Offline a ", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Vendedor Offline / Sistema", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":OfflineSyncService", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":InventarioLocalRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":VariantePrenda (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nDetecci\u00f3n de Conexi\u00f3n Online', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: window.addEventListener(\'online\')", false);
    msg(diag, bnd, act, s++, "1.1: notificarConexionRestaurada()", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nSincronizar Lote Acumulado', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: sincronizarColaOffline()", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [cola con transacciones pendientes]', 0, 240, 1690, -460, -870);
    msg(diag, bnd, ctrl, s++, "2.1: sincronizar_lote_ventas_offline(lote, db)", false);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada venta offline pendiente]', 3, 480, 1690, -550, -680);
    msg(diag, ctrl, ent0, s++, "2.2: _ejecutar_venta_pos_core(db, v, sid, uid)", false);
    msg(diag, ent0, ctrl, s++, "2.3: [venta_impactada_bd]", true);
    msg(diag, ctrl, ent0, s++, "2.4: inv.stock_fisico -= v.cantidad; db.commit()", false);
    msg(diag, ent0, ctrl, s++, "2.5: [stock_descontado_remoto]", true);
    msg(diag, ctrl, ent3, s++, "2.6: registrar_bitacora(db, \'SYNC_OFFLINE\', \'inventario\', str(sid))", false);
    msg(diag, ent3, ctrl, s++, "2.7: [log_sync_ok]", true);
    msg(diag, ctrl, bnd, s++, "2.8: return SincronizacionResponse(exitosos, errores)", true);
    msg(diag, bnd, act, s++, "2.9: indexedDB.limpiarColaSincronizada()", true);
    msg(diag, bnd, act, s++, "2.10: snackBar.open(\'Sincronizaci\u00f3n finalizada\', \'OK\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, bnd, act, s++, "2.11: notificarColaVacia()", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU15: 15. Generar Reportes Generativos por Voz y PLN (Gemini AI)
 * ============================================================================ */
function generarSEQ_CU15(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU15 - Secuencia Generar Reportes Generativos por Voz y P", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU15: Generar Reportes Generativos por Voz y PLN (G", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Gerente de Tienda", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":ReportesVozComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":ReportesVozRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":DetalleVenta (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Ropa (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nCaptura de Comando de Voz', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: iniciarGrabacionMicrofono()", false);
    msg(diag, bnd, act, s++, "1.1: grabarAudioBlob()", true);
    msg(diag, act, bnd, s++, "2: detenerGrabacionYEnviarAudio()", false);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nConsulta PLN con Gemini AI', 10, 130, -290, -360);
    msg(diag, bnd, ctrl, s++, "2.1: procesar_audio_blob(audio_file, db)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [intenci\u00f3n clasificada exitosamente]', 0, 240, 1460, -460, -870);
    msg(diag, ctrl, ent0, s++, "2.2: _intentar_clasificacion_gemini(texto, prompt_contexto)", false);
    msg(diag, ent0, ctrl, s++, "2.3: [intencion_sql_calculada]", true);
    msg(diag, ctrl, ent0, s++, "2.4: db.query(Venta).filter(Venta.empresa_id == eid).all()", false);
    msg(diag, ent0, ctrl, s++, "2.5: [ventas_db]", true);
    msg(diag, ctrl, ent1, s++, "2.6: db.query(DetalleVenta).join(Ropa).filter(...).all()", false);
    msg(diag, ent1, ctrl, s++, "2.7: [detalles_ropa_db]", true);
    msg(diag, ctrl, bnd, s++, "2.8: return ReporteGeneradoResponse(texto, metricas, sql)", true);
    msg(diag, bnd, act, s++, "2.9: renderizarGraficosReporteGenerado(datos)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.10: raise HTTPException(400, \'No se comprendi\u00f3 el comando\')", true);
    msg(diag, bnd, act, s++, "2.11: mostrarAlertaError(\'Comando de voz no reconocido\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nExportar PDF', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: exportarReportePDF()", false);
    msg(diag, bnd, ctrl, s++, "3.1: procesar_comando_voz_texto(comando, db)", false);
    msg(diag, ctrl, bnd, s++, "3.2: return DocumentoPDFResponse(pdf_base64)", true);
    msg(diag, bnd, act, s++, "3.3: descargarArchivoBlob(pdf)", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU16: 16. Tablero de Control Ejecutivo (KPIs y Alertas Stock)
 * ============================================================================ */
function generarSEQ_CU16(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU16 - Secuencia Tablero de Control Ejecutivo (KPIs y Ale", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU16: Tablero de Control Ejecutivo (KPIs y Alertas ", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Director Ejecutivo / Due\u00f1o", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":DashboardComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":IAAlertasRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Venta (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":InventarioSucursal (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Ropa (DB)", "entity");
    var ent3 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);
    posicionar(diag, ent3, 1430, 1540, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nCargar KPIs de Ventas', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: _dashboard_impl(tenant_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Venta).filter(Venta.empresa_id == tenant_id).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [ventas_totales_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return DashboardResponse(total_ventas, ticket_prom)", true);
    msg(diag, bnd, act, s++, "1.5: renderizarTarjetasKPI(metricas)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nAlertas de Quiebre de Stock', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: filtrarPorRangoFechas(fecha_inicio, fecha_fin)", false);
    msg(diag, bnd, ctrl, s++, "2.1: _obtener_alertas_calculadas(tenant_id, db)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [prendas con stock cr\u00edtico (<= 2 unidades)]', 0, 240, 1690, -460, -870);
    msg(diag, ctrl, ent1, s++, "2.2: db.query(InventarioSucursal).filter(InventarioSucursal.stock_fisico <= 2).all()", false);
    msg(diag, ent1, ctrl, s++, "2.3: [prendas_criticas_db]", true);

    // Fragmento LOOP (Inicia estrictamente desde el CONTROLADOR: ctrl en X=480)
    crearFragmento(pkg, diag, 'loop [para cada prenda en riesgo de quiebre]', 3, 480, 1690, -550, -680);
    msg(diag, ctrl, ent2, s++, "2.4: db.query(Ropa).filter(Ropa.id == r_id).first()", false);
    msg(diag, ent2, ctrl, s++, "2.5: [prenda_datos]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return AlertasStockResponse(alertas_quiebre)", true);
    msg(diag, bnd, act, s++, "2.7: actualizarGraficosVentas(tendencias)", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.8: return AlertasStockResponse([])", true);
    msg(diag, bnd, act, s++, "2.9: mostrarEstado(\'Inventario \u00f3ptimo en sucursales\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nGenerar Orden de Reposici\u00f3n', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: clickGenerarOrdenReposicion(variante_id)", false);
    msg(diag, bnd, ctrl, s++, "3.1: _sugerencias_compra_impl(tenant_id, db)", false);
    msg(diag, ctrl, bnd, s++, "3.2: return SugerenciasResponse(ordenes_sugeridas)", true);
    msg(diag, bnd, act, s++, "3.3: snackBar.open(\'Orden de reposici\u00f3n sugerida\', \'OK\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU17: 17. Auditoría del Sistema y Registro de Bitácora
 * ============================================================================ */
function generarSEQ_CU17(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU17 - Secuencia Auditoría del Sistema y Registro de Bitá", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU17: Auditoría del Sistema y Registro de Bitácora", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Oficial de Seguridad / Auditor", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":BitacoraAuditoriaComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":BitacoraRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Registros de Bit\u00e1cora', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: listar_bitacora(skip, limit, request, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Bitacora).order_by(Bitacora.id.desc()).all()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [bitacora_registros_db]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return BitacoraListResponse(items, total)", true);
    msg(diag, bnd, act, s++, "1.5: renderizarTablaAuditoria(eventos)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nDescarga de Log Cifrado', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: solicitarDescargaLogCifrado()", false);
    msg(diag, bnd, ctrl, s++, "2.1: descargar_log_cifrado(fecha_inicio, fecha_fin, db)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [llave de desarrollador v\u00e1lida (Header X-Dev-Key)]', 0, 240, 1230, -460, -870);
    msg(diag, ctrl, ent0, s++, "2.2: _verificar_llave_desarrollador(request)", false);
    msg(diag, ent0, ctrl, s++, "2.3: [llave_autorizada = True]", true);
    msg(diag, ctrl, bnd, s++, "2.4: return FileResponse(\'log_cifrado.bin\')", true);
    msg(diag, bnd, act, s++, "2.5: descargarArchivoBlob(\'auditoria_cifrada.log\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.6: raise HTTPException(403, \'Llave de desarrollador no autorizada\')", true);
    msg(diag, bnd, act, s++, "2.7: snackBar.open(\'Acceso denegado: Firma inv\u00e1lida\', \'Cerrar\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

/* ============================================================================
 * SEQ-CU18: 18. Backup y Restauración de Base de Datos PostgreSQL
 * ============================================================================ */
function generarSEQ_CU18(parentPkg) {
    var pkg = parentPkg.Packages.AddNew("CU18 - Secuencia Backup y Restauración de Base de Datos P", "");
    pkg.Update();

    var diag = pkg.Diagrams.AddNew("SEQ-CU18: Backup y Restauración de Base de Datos Postgr", "Sequence");
    diag.Update();

    var act = pkg.Elements.AddNew("Superadmin de Sistema", "Actor"); act.Update();
    var bnd = crearLifelineBCE(pkg, ":DatabaseManagementComponent", "boundary");
    var ctrl = crearLifelineBCE(pkg, ":BackupRouter", "control");
    var ent0 = crearLifelineBCE(pkg, ":Usuario (DB)", "entity");
    var ent1 = crearLifelineBCE(pkg, ":Empresa (DB)", "entity");
    var ent2 = crearLifelineBCE(pkg, ":Bitacora (DB)", "entity");

    // Posicionamiento de Lifelines en columnas
    posicionar(diag, act, 40, 140, -30, -1450);
    posicionar(diag, bnd, 260, 380, -30, -1450);
    posicionar(diag, ctrl, 500, 620, -30, -1450);
    posicionar(diag, ent0, 740, 850, -30, -1450);
    posicionar(diag, ent1, 970, 1080, -30, -1450);
    posicionar(diag, ent2, 1200, 1310, -30, -1450);

    var s = 1;

    // --- FLUJO 1 ---
    crearNota(pkg, diag, 'FLUJO 1\nListar Copias de Seguridad', 10, 130, -90, -160);
    msg(diag, act, bnd, s++, "1: ngOnInit()", false);
    msg(diag, bnd, ctrl, s++, "1.1: listar_backups(tenant_id, db)", false);
    msg(diag, ctrl, ent0, s++, "1.2: db.query(Usuario).filter_by(id=uid, es_superadmin=True).first()", false);
    msg(diag, ent0, ctrl, s++, "1.3: [superadmin_validado]", true);
    msg(diag, ctrl, bnd, s++, "1.4: return BackupsListResponse(archivos)", true);
    msg(diag, bnd, act, s++, "1.5: renderizarListaBackups(backups)", true);

    // --- FLUJO 2 ---
    crearNota(pkg, diag, 'FLUJO 2\nGeneraci\u00f3n de Dump Manual', 10, 130, -290, -360);
    msg(diag, act, bnd, s++, "2: solicitarBackupManual(tenant_id, \'dump\')", false);
    msg(diag, bnd, ctrl, s++, "2.1: generar_backup(tipo, tenant_id, db)", false);

    // Fragmento ALT (Inicia estrictamente desde la INTERFAZ: bnd en X=240)
    crearFragmento(pkg, diag, 'alt [superadmin autenticado y espacio disponible en disco]', 0, 240, 1460, -460, -870);
    msg(diag, ctrl, ent1, s++, "2.2: db.query(Empresa).filter_by(id=tenant_id).first()", false);
    msg(diag, ent1, ctrl, s++, "2.3: [tenant_db_found]", true);
    msg(diag, ctrl, ent1, s++, "2.4: _generar_dump_sql(schema_name, db_name)", false);
    msg(diag, ent1, ctrl, s++, "2.5: [dump_file_creado]", true);
    msg(diag, ctrl, bnd, s++, "2.6: return BackupGeneradoResponse(nombre, url)", true);
    msg(diag, bnd, act, s++, "2.7: descargarArchivoDump(\'backup_tenant.dump\')", true);

    // Rama Alternativa (Else / Error) del ALT
    msg(diag, ctrl, bnd, s++, "2.8: raise HTTPException(500, \'Error en pg_dump\')", true);
    msg(diag, bnd, act, s++, "2.9: mostrarError(\'No se pudo generar la copia\')", true);

    // --- FLUJO 3 ---
    crearNota(pkg, diag, 'FLUJO 3\nRestauraci\u00f3n de Esquema', 10, 130, -920, -990);
    msg(diag, act, bnd, s++, "3: subirArchivoYRestaurar(archivo_dump)", false);
    msg(diag, bnd, ctrl, s++, "3.1: restaurar_backup(archivo, tenant_id, db)", false);
    msg(diag, ctrl, ent2, s++, "3.2: registrar_bitacora(db, \'RESTORE_POSTGRES_OK\', \'schemas\', schema)", false);
    msg(diag, ent2, ctrl, s++, "3.3: [auditoria_restore_guardada]", true);
    msg(diag, ctrl, bnd, s++, "3.4: return RestauracionResponse(schema, status=\'OK\')", true);
    msg(diag, bnd, act, s++, "3.5: snackBar.open(\'Restauraci\u00f3n completada\', \'OK\')", true);

    diag.Update();
    try { Repository.ReloadDiagram(diag.DiagramID); } catch(e) {}
}

// Ejecucion automatica
main();
