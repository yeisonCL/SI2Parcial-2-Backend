# -*- coding: utf-8 -*-
"""
Script para generar el documento Word formal:
'Mapeo_Base_de_Datos_Segundo_Parcial_FashionStore.docx'
con formato académico profesional para Sistemas de Información 2 (UAGRM).
"""

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_document():
    doc = docx.Document()
    
    # Configurar márgenes estándar 2.5 cm (aproximadamente 1 pulgada)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Colores corporativos del proyecto
    COLOR_PRIMARY = RGBColor(46, 49, 146)    # Azul institucional #2E3192
    COLOR_SECONDARY = RGBColor(106, 27, 154) # Púrpura #6A1B9A
    COLOR_DARK = RGBColor(33, 37, 41)        # Gris oscuro texto #212529
    COLOR_MUTED = RGBColor(108, 117, 125)    # Gris secundario #6C757D
    
    HEX_HEADER = "2E3192"
    HEX_MODULE = "4A148C"
    HEX_ZEBRA = "F8F9FA"
    HEX_BORDER = "CCCCCC"

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    # =========================================================================
    # PORTADA / ENCABEZADO FORMAL
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO\nFACULTAD DE INGENIERÍA EN CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES\nCARRERA DE INGENIERÍA EN SISTEMAS")
    r_inst.font.name = "Calibri"
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True
    r_inst.font.color.rgb = COLOR_PRIMARY
    
    p_mat = doc.add_paragraph()
    p_mat.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_mat = p_mat.add_run("SISTEMAS DE INFORMACIÓN 2 (SI2) — SEGUNDO PARCIAL")
    r_mat.font.name = "Calibri"
    r_mat.font.size = Pt(13)
    r_mat.font.bold = True
    r_mat.font.color.rgb = COLOR_SECONDARY
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("DICCIONARIO DE DATOS Y MAPEO RELACIONAL EVOLUCIONADO\nFASHIONSTORE: PLATAFORMA OMNICANAL SAAS MULTITENANT")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(16)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Docente: MSc. Ing. Angélica Garzón Cuéllar\nEstudiante: Yeison Choque León | Registro: 220025754\nSanta Cruz de la Sierra — Bolivia | Gestión 2026")
    r_meta.font.name = "Calibri"
    r_meta.font.size = Pt(10)
    r_meta.font.color.rgb = COLOR_MUTED

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # =========================================================================
    # SECCIÓN 1: JUSTIFICACIÓN DE LA EVOLUCIÓN DEL MODELO DE DATOS
    # =========================================================================
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. JUSTIFICACIÓN DE LA EVOLUCIÓN DEL MODELO DE DATOS")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = COLOR_PRIMARY

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_intro = p_intro.add_run(
        "El presente documento técnico formaliza el paso del modelo de base de datos relacional del Primer Parcial "
        "(concebido originalmente bajo un enfoque monotienda tradicional) hacia el modelo de datos integral del Segundo Parcial, "
        "el cual da soporte a la arquitectura SaaS Multitenant (Multi-inquilino), omnicanalidad (Web PWA y Móvil Flutter), "
        "resiliencia en modo offline y a todas las políticas de negocio instruidas formalmente por la docente en cátedra."
    )
    r_intro.font.name = "Calibri"
    r_intro.font.size = Pt(11)

    p_intro2 = doc.add_paragraph()
    p_intro2.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_intro2 = p_intro2.add_run("Los factores determinantes que motivaron la incorporación y evolución de tablas son los siguientes:")
    r_intro2.font.name = "Calibri"
    r_intro2.font.size = Pt(11)

    cambios = [
        ("Descentralización del Stock (Inventario por Sucursal): ",
         "En el Primer Parcial el campo 'Stock' residía de forma atómica en 'Ropa_Talla_Color'. Esto impedía operar más de una tienda física. En el Segundo Parcial, al contar con múltiples sucursales (ej. Barrio Lindo, Ventura Mall), el stock físico se desacopla hacia la entidad 'Inventario_Sucursal', gestionando existencias físicas, unidades comprometidas ('Stock_Reservado') y unidades disponibles calculadas en tiempo real."),
        ("Arquitectura SaaS Multitenant (Aislamiento de Inquilinos): ",
         "Para comercializar la plataforma bajo el modelo Software as a Service (SaaS), se incorporan las entidades 'Empresa', 'Plan_Suscripcion' y 'Suscripcion_Empresa' con pasarela Stripe. Todas las tablas neurálgicas (Catálogo, Sucursales, Ventas, Reservas) incorporan la llave foránea 'ID_Empresa' para garantizar aislamiento lógico absoluto."),
        ("Gestión de Múltiples Sucursales y Puntos de Caja POS: ",
         "Se formalizan las entidades 'Sucursal' y 'Caja_POS', permitiendo que una misma empresa controle ventas en diferentes puntos geográficos, distinguiendo inventarios locales y cajas registradoras."),
        ("Reservas Web-to-Store con Congelamiento de Stock por 48 Horas: ",
         "La entidad 'Reserva_Cita' del 1er Parcial evoluciona hacia 'Reserva' omnicanal. Permite al cliente apartar prendas seleccionando una sucursal física de retiro, congelando el stock en dicha tienda por un lapso estricto de 48 horas."),
        ("Circuito Logístico de Traspasos Inter-Sucursales (CU-13): ",
         "Se crean las tablas 'Traspaso' y 'Detalle_Traspaso' para modelar el flujo de transferencia de mercadería entre tiendas bajo tres estados auditables: SOLICITADO, EN_TRÁNSITO y RECIBIDO."),
        ("Garantías, Devoluciones y Cambio de Prenda con Cobro de Diferencia (CU-12): ",
         "En estricto cumplimiento a la política explicada por la docente en cátedra, se crea la entidad 'Devolucion'. Permite la emisión de notas de cambio dentro del plazo de 7 días / 24 horas, reingresando la prenda devuelta al stock (+1 en almacén), calculando automáticamente la diferencia económica si la nueva prenda seleccionada posee mayor valor, y notificando al cliente vía PUSH para su liquidación digital antes del despacho."),
        ("Catálogo con Recursos 3D/AR y Precios Diferenciados: ",
         "Se añaden atributos para soportar el Vestidor Virtual con Realidad Aumentada ('Modelo_3D_URL' en formato .glb), precios al por menor vs al por mayor ('Precio_Mayorista') y políticas de liquidación por cambio de temporada ('En_Oferta' y 'Descuento_Porcentaje').")
    ]

    for titulo, desc in cambios:
        p_item = doc.add_paragraph(style='List Bullet')
        p_item.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r_t = p_item.add_run(titulo)
        r_t.font.name = "Calibri"
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = COLOR_PRIMARY
        r_d = p_item.add_run(desc)
        r_d.font.name = "Calibri"
        r_d.font.size = Pt(10.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # SECCIÓN 2: CUADRO COMPARATIVO SINTÉTICO (1ER PARCIAL VS 2DO PARCIAL)
    # =========================================================================
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. CUADRO COMPARATIVO DE EVOLUCIÓN ARQUITECTÓNICA")
    r_h2.font.name = "Calibri"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = COLOR_PRIMARY

    tbl_comp = doc.add_table(rows=1, cols=3)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_comp.autofit = False

    hdr_cells = tbl_comp.rows[0].cells
    hdr_titles = ["Criterio Arquitectónico", "Primer Parcial (Línea Base Monotienda)", "Segundo Parcial (FashionStore SaaS Omnicanal)"]
    hdr_widths = [Inches(1.8), Inches(2.3), Inches(2.7)]

    for idx, text in enumerate(hdr_titles):
        hdr_cells[idx].width = hdr_widths[idx]
        p = hdr_cells[idx].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(hdr_cells[idx], HEX_HEADER)
        set_cell_margins(hdr_cells[idx], 120, 120, 120, 120)

    filas_comp = [
        ("Control de Stock", "Global en 'Ropa_Talla_Color.Stock' (asumía una sola tienda física).", "Descentralizado en 'Inventario_Sucursal' con control de stock físico, reservado y disponible."),
        ("Multi-inquilino (SaaS)", "Inexistente (esquema rígido para un único cliente o comercio).", "Nativo con 'Empresa', 'Plan_Suscripcion' y suscripciones periódicas Stripe. Aislamiento por 'ID_Empresa'."),
        ("Sucursales Físicas", "No contemplaba puntos de venta distribuidos ni cajas registradoras.", "Modelado completo con 'Sucursal' y terminales 'Caja_POS' para ventas de mostrador."),
        ("Módulo de Reservas", "'Reserva_Cita' agendaba fecha/hora sin interacción con el inventario.", "'Reserva' Web-to-Store con sucursal asignada y congelamiento automático de stock por 48 horas."),
        ("Logística de Mercadería", "Sin soporte para redistribución entre tiendas.", "'Traspaso' y 'Detalle_Traspaso' con trazabilidad en 3 fases: Solicitado, En Tránsito y Recibido."),
        ("Garantías y Cambios", "Sin entidad ni flujo de devoluciones.", "'Devolucion' vinculada a la venta, reingreso a almacén (+1) y liquidación de excedentes de precio."),
        ("Ventas y Canales", "Entidad simple 'Pedido' sin distinción de canal ni soporte sin conexión.", "'Venta' omnicanal: POS con resiliencia offline ('UUID_Offline') y E-commerce con pasarela Stripe."),
        ("Probador Virtual", "Atributos puramente descriptivos.", "Soporte de Realidad Aumentada con modelos 3D interactivos ('Modelo_3D_URL' en formato .glb).")
    ]

    for c1, c2, c3 in filas_comp:
        row = tbl_comp.add_row()
        cells = row.cells
        for i, w in enumerate(hdr_widths):
            cells[i].width = w
            set_cell_margins(cells[i], 100, 100, 100, 100)
        
        # Col 1
        p0 = cells[0].paragraphs[0]
        r0 = p0.add_run(c1)
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.5)
        r0.font.bold = True
        r0.font.color.rgb = COLOR_DARK

        # Col 2
        p1 = cells[1].paragraphs[0]
        r1 = p1.add_run(c2)
        r1.font.name = "Calibri"
        r1.font.size = Pt(9)
        r1.font.color.rgb = COLOR_DARK

        # Col 3
        p2 = cells[2].paragraphs[0]
        r2 = p2.add_run(c3)
        r2.font.name = "Calibri"
        r2.font.size = Pt(9)
        r2.font.color.rgb = COLOR_DARK

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # =========================================================================
    # SECCIÓN 3: MAPEO RELACIONAL COMPLETO DEL SEGUNDO PARCIAL
    # =========================================================================
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. TABLA MAESTRA DE MAPEO RELACIONAL (SEGUNDO PARCIAL)")
    r_h3.font.name = "Calibri"
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = COLOR_PRIMARY

    p_map_desc = doc.add_paragraph()
    p_map_desc.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_md = p_map_desc.add_run(
        "A continuación se especifica la totalidad de entidades, atributos, tipos de datos recomendados, "
        "llaves primarias, foráneas y restricciones relacionales organizadas en cinco (5) módulos funcionales:"
    )
    r_md.font.name = "Calibri"
    r_md.font.size = Pt(11)

    # Definición de datos de la tabla maestra
    COL_WIDTHS = [Inches(1.5), Inches(1.5), Inches(1.3), Inches(1.0), Inches(1.5)]
    
    # Lista de tuplas: (es_modulo, contenido)
    # Si es_modulo=True -> contenido es nombre del módulo
    # Si es_modulo=False -> contenido es (Tabla, Campo, Tipo_Dato, PK_FK, Referencia)
    DATA_MAPEO = [
        # MODULO 1
        (True, "MÓDULO 1: GESTIÓN SAAS, MULTITENANCY Y SEGURIDAD"),
        (False, ("Empresa", "ID_Empresa", "INT", "PK", "-")),
        (False, ("Empresa", "Nombre_Comercial", "VARCHAR(100)", "", "-")),
        (False, ("Empresa", "NIT", "VARCHAR(30)", "", "-")),
        (False, ("Empresa", "Correo_Contacto", "VARCHAR(100)", "", "-")),
        (False, ("Empresa", "Telefono", "VARCHAR(20)", "", "-")),
        (False, ("Empresa", "Estado", "VARCHAR(20)", "", "-")),
        (False, ("Plan_Suscripcion", "ID_Plan", "INT", "PK", "-")),
        (False, ("Plan_Suscripcion", "Nombre_Plan", "VARCHAR(50)", "", "-")),
        (False, ("Plan_Suscripcion", "Precio_Mensual", "DECIMAL(10,2)", "", "-")),
        (False, ("Plan_Suscripcion", "Max_Sucursales", "INT", "", "-")),
        (False, ("Plan_Suscripcion", "Max_Usuarios", "INT", "", "-")),
        (False, ("Suscripcion_Empresa", "ID_Suscripcion", "INT", "PK", "-")),
        (False, ("Suscripcion_Empresa", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Suscripcion_Empresa", "ID_Plan", "INT", "FK", "Plan_Suscripcion(ID_Plan)")),
        (False, ("Suscripcion_Empresa", "Stripe_Customer_ID", "VARCHAR(100)", "", "-")),
        (False, ("Suscripcion_Empresa", "Stripe_Subscription_ID", "VARCHAR(100)", "", "-")),
        (False, ("Suscripcion_Empresa", "Fecha_Inicio", "DATE", "", "-")),
        (False, ("Suscripcion_Empresa", "Fecha_Vencimiento", "DATE", "", "-")),
        (False, ("Suscripcion_Empresa", "Estado", "VARCHAR(20)", "", "-")),
        (False, ("Persona", "CI", "VARCHAR(20)", "PK", "-")),
        (False, ("Persona", "Nombre", "VARCHAR(50)", "", "-")),
        (False, ("Persona", "Apellido_Paterno", "VARCHAR(50)", "", "-")),
        (False, ("Persona", "Apellido_Materno", "VARCHAR(50)", "", "-")),
        (False, ("Persona", "Correo_Electronico", "VARCHAR(100)", "", "-")),
        (False, ("Persona", "Telefono", "VARCHAR(20)", "", "-")),
        (False, ("Persona", "Direccion", "VARCHAR(200)", "", "-")),
        (False, ("Persona", "Tipo_Persona", "VARCHAR(20)", "", "-")),
        (False, ("Cliente", "CI", "VARCHAR(20)", "PK, FK", "Persona(CI)")),
        (False, ("Cliente", "Preferencia_Talla", "VARCHAR(10)", "", "-")),
        (False, ("Cliente", "Preferencia_Estilo", "VARCHAR(50)", "", "-")),
        (False, ("Cliente", "Fecha_Registro", "DATE", "", "-")),
        (False, ("Empleado", "CI", "VARCHAR(20)", "PK, FK", "Persona(CI)")),
        (False, ("Empleado", "ID_Sucursal", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Empleado", "Cargo", "VARCHAR(50)", "", "-")),
        (False, ("Empleado", "Fecha_Contratacion", "DATE", "", "-")),
        (False, ("Empleado", "Activo", "BOOLEAN", "", "-")),
        (False, ("Rol", "ID_Rol", "INT", "PK", "-")),
        (False, ("Rol", "Nombre_Rol", "VARCHAR(50)", "", "-")),
        (False, ("Rol", "Descripcion", "VARCHAR(200)", "", "-")),
        (False, ("Usuario", "ID_Usuario", "INT", "PK", "-")),
        (False, ("Usuario", "CI", "VARCHAR(20)", "FK", "Persona(CI)")),
        (False, ("Usuario", "ID_Rol", "INT", "FK", "Rol(ID_Rol)")),
        (False, ("Usuario", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Usuario", "Username", "VARCHAR(50)", "", "-")),
        (False, ("Usuario", "Password_Hash", "VARCHAR(255)", "", "-")),
        (False, ("Usuario", "Activo", "BOOLEAN", "", "-")),
        (False, ("Bitacora_Auditoria", "ID_Bitacora", "BIGINT", "PK", "-")),
        (False, ("Bitacora_Auditoria", "ID_Usuario", "INT", "FK", "Usuario(ID_Usuario)")),
        (False, ("Bitacora_Auditoria", "Accion", "VARCHAR(50)", "", "-")),
        (False, ("Bitacora_Auditoria", "Tabla_Afectada", "VARCHAR(50)", "", "-")),
        (False, ("Bitacora_Auditoria", "Registro_ID", "VARCHAR(50)", "", "-")),
        (False, ("Bitacora_Auditoria", "IP_Origen", "VARCHAR(45)", "", "-")),
        (False, ("Bitacora_Auditoria", "Fecha_Hora", "TIMESTAMP", "", "-")),

        # MODULO 2
        (True, "MÓDULO 2: SUCURSALES, INVENTARIO ATÓMICO Y LOGÍSTICA"),
        (False, ("Sucursal", "ID_Sucursal", "INT", "PK", "-")),
        (False, ("Sucursal", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Sucursal", "Nombre", "VARCHAR(100)", "", "-")),
        (False, ("Sucursal", "Direccion", "VARCHAR(200)", "", "-")),
        (False, ("Sucursal", "Ciudad", "VARCHAR(50)", "", "-")),
        (False, ("Sucursal", "Telefono", "VARCHAR(20)", "", "-")),
        (False, ("Sucursal", "Es_Almacen_Central", "BOOLEAN", "", "-")),
        (False, ("Sucursal", "Activo", "BOOLEAN", "", "-")),
        (False, ("Caja_POS", "ID_Caja", "INT", "PK", "-")),
        (False, ("Caja_POS", "ID_Sucursal", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Caja_POS", "Numero_Caja", "VARCHAR(20)", "", "-")),
        (False, ("Caja_POS", "Estado", "VARCHAR(20)", "", "-")),
        (False, ("Inventario_Sucursal", "ID_Inventario", "INT", "PK", "-")),
        (False, ("Inventario_Sucursal", "ID_Sucursal", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Inventario_Sucursal", "ID_Variante", "INT", "FK", "Variante_Prenda(ID_Variante)")),
        (False, ("Inventario_Sucursal", "Stock_Fisico", "INT", "", "-")),
        (False, ("Inventario_Sucursal", "Stock_Reservado", "INT", "", "-")),
        (False, ("Inventario_Sucursal", "Stock_Disponible", "INT", "", "Calculado (Fisico - Reservado)")),
        (False, ("Inventario_Sucursal", "Stock_Minimo", "INT", "", "-")),
        (False, ("Traspaso", "ID_Traspaso", "INT", "PK", "-")),
        (False, ("Traspaso", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Traspaso", "ID_Sucursal_Origen", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Traspaso", "ID_Sucursal_Destino", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Traspaso", "Solicitado_Por_CI", "VARCHAR(20)", "FK", "Empleado(CI)")),
        (False, ("Traspaso", "Fecha_Envio", "TIMESTAMP", "", "-")),
        (False, ("Traspaso", "Fecha_Recepcion", "TIMESTAMP", "", "-")),
        (False, ("Traspaso", "Estado", "VARCHAR(30)", "", "SOLICITADO, EN_TRANSITO, RECIBIDO")),
        (False, ("Detalle_Traspaso", "ID_Detalle_Traspaso", "INT", "PK", "-")),
        (False, ("Detalle_Traspaso", "ID_Traspaso", "INT", "FK", "Traspaso(ID_Traspaso)")),
        (False, ("Detalle_Traspaso", "ID_Variante", "INT", "FK", "Variante_Prenda(ID_Variante)")),
        (False, ("Detalle_Traspaso", "Cantidad", "INT", "", "-")),

        # MODULO 3
        (True, "MÓDULO 3: CATÁLOGO DE PRENDAS, VARIANTES Y RECURSOS 3D/AR"),
        (False, ("Categoria", "ID_Categoria", "INT", "PK", "-")),
        (False, ("Categoria", "Nombre", "VARCHAR(50)", "", "-")),
        (False, ("Categoria", "Descripcion", "VARCHAR(200)", "", "-")),
        (False, ("Temporada", "ID_Temporada", "INT", "PK", "-")),
        (False, ("Temporada", "Nombre", "VARCHAR(50)", "", "Invierno, Verano, Primavera")),
        (False, ("Temporada", "Fecha_Inicio", "DATE", "", "-")),
        (False, ("Temporada", "Fecha_Fin", "DATE", "", "-")),
        (False, ("Proveedor", "ID_Proveedor", "INT", "PK", "-")),
        (False, ("Proveedor", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Proveedor", "Razon_Social", "VARCHAR(100)", "", "-")),
        (False, ("Proveedor", "NIT", "VARCHAR(30)", "", "-")),
        (False, ("Proveedor", "Telefono", "VARCHAR(20)", "", "-")),
        (False, ("Ropa", "ID_Ropa", "INT", "PK", "-")),
        (False, ("Ropa", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Ropa", "ID_Categoria", "INT", "FK", "Categoria(ID_Categoria)")),
        (False, ("Ropa", "ID_Temporada", "INT", "FK", "Temporada(ID_Temporada)")),
        (False, ("Ropa", "ID_Proveedor", "INT", "FK", "Proveedor(ID_Proveedor)")),
        (False, ("Ropa", "Nombre", "VARCHAR(100)", "", "-")),
        (False, ("Ropa", "Descripcion", "TEXT", "", "-")),
        (False, ("Ropa", "Precio_Unitario", "DECIMAL(10,2)", "", "Precio al por menor")),
        (False, ("Ropa", "Precio_Mayorista", "DECIMAL(10,2)", "", "A partir de 3 unidades")),
        (False, ("Ropa", "En_Oferta", "BOOLEAN", "", "Liquidación fin de temporada")),
        (False, ("Ropa", "Descuento_Porcentaje", "DECIMAL(5,2)", "", "-")),
        (False, ("Ropa", "Genero", "VARCHAR(20)", "", "Hombre, Mujer, Unisex")),
        (False, ("Ropa", "Imagen_URL", "VARCHAR(500)", "", "-")),
        (False, ("Ropa", "Modelo_3D_URL", "VARCHAR(500)", "", "Recurso .glb para Probador AR")),
        (False, ("Ropa", "Estado", "VARCHAR(20)", "", "-")),
        (False, ("Talla", "ID_Talla", "INT", "PK", "-")),
        (False, ("Talla", "Talla", "VARCHAR(10)", "", "XS, S, M, L, XL, XXL")),
        (False, ("Talla", "Orden", "INT", "", "-")),
        (False, ("Color", "ID_Color", "INT", "PK", "-")),
        (False, ("Color", "Nombre", "VARCHAR(30)", "", "-")),
        (False, ("Color", "Codigo_HEX", "VARCHAR(10)", "", "Ej. #000000")),
        (False, ("Variante_Prenda", "ID_Variante", "INT", "PK", "Antes Ropa_Talla_Color")),
        (False, ("Variante_Prenda", "ID_Ropa", "INT", "FK", "Ropa(ID_Ropa)")),
        (False, ("Variante_Prenda", "ID_Talla", "INT", "FK", "Talla(ID_Talla)")),
        (False, ("Variante_Prenda", "ID_Color", "INT", "FK", "Color(ID_Color)")),
        (False, ("Variante_Prenda", "SKU", "VARCHAR(50)", "", "Código de barra único")),
        (False, ("Variante_Prenda", "Precio_Ajustado", "DECIMAL(10,2)", "", "-")),
        (False, ("Variante_Prenda", "Activo", "BOOLEAN", "", "-")),

        # MODULO 4
        (True, "MÓDULO 4: EXPERIENCIA OMNICANAL Y RESERVAS WEB-TO-STORE"),
        (False, ("Carrito_Compra", "ID_Carrito", "INT", "PK", "-")),
        (False, ("Carrito_Compra", "CI_Cliente", "VARCHAR(20)", "FK", "Cliente(CI)")),
        (False, ("Carrito_Compra", "Fecha_Actualizacion", "TIMESTAMP", "", "-")),
        (False, ("Detalle_Carrito", "ID_Detalle_Carrito", "INT", "PK", "-")),
        (False, ("Detalle_Carrito", "ID_Carrito", "INT", "FK", "Carrito_Compra(ID_Carrito)")),
        (False, ("Detalle_Carrito", "ID_Variante", "INT", "FK", "Variante_Prenda(ID_Variante)")),
        (False, ("Detalle_Carrito", "Cantidad", "INT", "", "-")),
        (False, ("Reserva", "ID_Reserva", "INT", "PK", "Antes Reserva_Cita")),
        (False, ("Reserva", "Codigo_Reserva", "VARCHAR(30)", "", "Ej. #RES-41")),
        (False, ("Reserva", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Reserva", "CI_Cliente", "VARCHAR(20)", "FK", "Cliente(CI)")),
        (False, ("Reserva", "ID_Sucursal_Retiro", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Reserva", "Fecha_Reserva", "TIMESTAMP", "", "-")),
        (False, ("Reserva", "Fecha_Vencimiento", "TIMESTAMP", "", "Vigencia estricta 48 horas")),
        (False, ("Reserva", "Turno_Retiro", "VARCHAR(50)", "", "Mañana / Tarde")),
        (False, ("Reserva", "Estado", "VARCHAR(20)", "", "PENDIENTE, RETIRADA, EXPIRADA")),
        (False, ("Detalle_Reserva", "ID_Detalle_Reserva", "INT", "PK", "-")),
        (False, ("Detalle_Reserva", "ID_Reserva", "INT", "FK", "Reserva(ID_Reserva)")),
        (False, ("Detalle_Reserva", "ID_Variante", "INT", "FK", "Variante_Prenda(ID_Variante)")),
        (False, ("Detalle_Reserva", "Cantidad", "INT", "", "-")),
        (False, ("Detalle_Reserva", "Precio_Unitario", "DECIMAL(10,2)", "", "-")),

        # MODULO 5
        (True, "MÓDULO 5: VENTAS POS OFFLINE, PAGOS, FACTURACIÓN Y DEVOLUCIONES"),
        (False, ("Tipo_Venta", "ID_Tipo_Venta", "INT", "PK", "-")),
        (False, ("Tipo_Venta", "Nombre", "VARCHAR(50)", "", "POS_Presencial, Digital_Web")),
        (False, ("Metodo_Pago", "ID_Metodo_Pago", "INT", "PK", "-")),
        (False, ("Metodo_Pago", "Nombre", "VARCHAR(50)", "", "Stripe_Card, QR_Simple, Efectivo")),
        (False, ("Venta", "ID_Venta", "INT", "PK", "Antes Pedido")),
        (False, ("Venta", "UUID_Offline", "VARCHAR(50)", "", "Clave única para ventas sin internet")),
        (False, ("Venta", "ID_Empresa", "INT", "FK", "Empresa(ID_Empresa)")),
        (False, ("Venta", "ID_Sucursal", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Venta", "CI_Cliente", "VARCHAR(20)", "FK", "Cliente(CI)")),
        (False, ("Venta", "CI_Empleado", "VARCHAR(20)", "FK", "Empleado(CI)")),
        (False, ("Venta", "ID_Tipo_Venta", "INT", "FK", "Tipo_Venta(ID_Tipo_Venta)")),
        (False, ("Venta", "ID_Metodo_Pago", "INT", "FK", "Metodo_Pago(ID_Metodo_Pago)")),
        (False, ("Venta", "Monto_Total", "DECIMAL(10,2)", "", "-")),
        (False, ("Venta", "Descuento_Total", "DECIMAL(10,2)", "", "-")),
        (False, ("Venta", "Monto_Neto", "DECIMAL(10,2)", "", "-")),
        (False, ("Venta", "Estado", "VARCHAR(20)", "", "COMPLETADA, ANULADA, PENDIENTE")),
        (False, ("Venta", "Sincronizado_Offline", "BOOLEAN", "", "True si provino de SQLite/IndexedDB")),
        (False, ("Venta", "Fecha_Venta", "TIMESTAMP", "", "-")),
        (False, ("Detalle_Venta", "ID_Detalle_Venta", "INT", "PK", "-")),
        (False, ("Detalle_Venta", "ID_Venta", "INT", "FK", "Venta(ID_Venta)")),
        (False, ("Detalle_Venta", "ID_Variante", "INT", "FK", "Variante_Prenda(ID_Variante)")),
        (False, ("Detalle_Venta", "Cantidad", "INT", "", "-")),
        (False, ("Detalle_Venta", "Precio_Unitario", "DECIMAL(10,2)", "", "-")),
        (False, ("Detalle_Venta", "Subtotal", "DECIMAL(10,2)", "", "-")),
        (False, ("Pago", "ID_Pago", "INT", "PK", "-")),
        (False, ("Pago", "ID_Venta", "INT", "FK", "Venta(ID_Venta)")),
        (False, ("Pago", "ID_Metodo_Pago", "INT", "FK", "Metodo_Pago(ID_Metodo_Pago)")),
        (False, ("Pago", "Monto", "DECIMAL(10,2)", "", "-")),
        (False, ("Pago", "Referencia_Stripe_QR", "VARCHAR(150)", "", "ID de pago Stripe o hash QR")),
        (False, ("Pago", "Estado", "VARCHAR(20)", "", "APROBADO, PENDIENTE, FALLIDO")),
        (False, ("Pago", "Fecha_Pago", "TIMESTAMP", "", "-")),
        (False, ("Factura", "ID_Factura", "INT", "PK", "-")),
        (False, ("Factura", "ID_Venta", "INT", "FK", "Venta(ID_Venta)")),
        (False, ("Factura", "NRO_Factura", "VARCHAR(50)", "", "-")),
        (False, ("Factura", "NRO_Autorizacion", "VARCHAR(100)", "", "-")),
        (False, ("Factura", "NIT_Emisor", "VARCHAR(30)", "", "-")),
        (False, ("Factura", "NIT_Cliente", "VARCHAR(30)", "", "-")),
        (False, ("Factura", "Razon_Social_Cliente", "VARCHAR(100)", "", "-")),
        (False, ("Factura", "Codigo_Control", "VARCHAR(50)", "", "-")),
        (False, ("Factura", "Fecha_Emision", "TIMESTAMP", "", "-")),
        (False, ("Factura", "Total", "DECIMAL(10,2)", "", "-")),
        (False, ("Devolucion", "ID_Devolucion", "INT", "PK", "CU-12: Exigido por la docente")),
        (False, ("Devolucion", "ID_Venta", "INT", "FK", "Venta(ID_Venta)")),
        (False, ("Devolucion", "CI_Cliente", "VARCHAR(20)", "FK", "Cliente(CI)")),
        (False, ("Devolucion", "ID_Sucursal", "INT", "FK", "Sucursal(ID_Sucursal)")),
        (False, ("Devolucion", "Motivo", "TEXT", "", "Cambio de talla, falla de fábrica")),
        (False, ("Devolucion", "Estado", "VARCHAR(30)", "", "SOLICITADA, APROBADA_REINGRESO")),
        (False, ("Devolucion", "Monto_Diferencia", "DECIMAL(10,2)", "", "Cobro adicional si nueva talla vale más")),
        (False, ("Devolucion", "Fecha_Solicitud", "TIMESTAMP", "", "Dentro del plazo legal de 7 días / 24h")),
        (False, ("Devolucion", "Fecha_Resolucion", "TIMESTAMP", "", "-"))
    ]

    # Crear la tabla de mapeo relacional
    tbl_map = doc.add_table(rows=1, cols=5)
    tbl_map.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_map.autofit = False

    h_cells = tbl_map.rows[0].cells
    h_titles = ["Tabla", "Campo", "Tipo_de_Dato_Sugerido", "Llave_Primaria_Foranea", "Referencia"]
    
    for i, title in enumerate(h_titles):
        h_cells[i].width = COL_WIDTHS[i]
        p = h_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(title)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(h_cells[i], HEX_HEADER)
        set_cell_margins(h_cells[i], 120, 120, 100, 100)

    # Llenar la tabla
    row_count = 0
    for item in DATA_MAPEO:
        es_mod = item[0]
        row = tbl_map.add_row()
        cells = row.cells
        
        if es_mod:
            # Fila de cabecera de módulo (merge de todas las celdas)
            mod_title = item[1]
            a = cells[0]
            b = cells[4]
            a.merge(b)
            p = a.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(mod_title)
            r.font.name = "Calibri"
            r.font.size = Pt(10)
            r.font.bold = True
            r.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_background(a, HEX_MODULE)
            set_cell_margins(a, 120, 120, 150, 150)
        else:
            # Fila de campo normal
            t_name, f_name, f_type, f_pkfk, f_ref = item[1]
            row_count += 1
            bg_color = HEX_ZEBRA if (row_count % 2 == 1) else "FFFFFF"

            for i, w in enumerate(COL_WIDTHS):
                cells[i].width = w
                set_cell_margins(cells[i], 80, 80, 100, 100)
                set_cell_background(cells[i], bg_color)
            
            # Tabla
            p0 = cells[0].paragraphs[0]
            r0 = p0.add_run(t_name)
            r0.font.name = "Calibri"
            r0.font.size = Pt(8.5)
            r0.font.bold = True
            r0.font.color.rgb = COLOR_DARK

            # Campo
            p1 = cells[1].paragraphs[0]
            r1 = p1.add_run(f_name)
            r1.font.name = "Consolas"
            r1.font.size = Pt(8.5)
            r1.font.color.rgb = COLOR_PRIMARY

            # Tipo
            p2 = cells[2].paragraphs[0]
            r2 = p2.add_run(f_type)
            r2.font.name = "Calibri"
            r2.font.size = Pt(8.5)
            r2.font.color.rgb = COLOR_DARK

            # PK / FK
            p3 = cells[3].paragraphs[0]
            p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r3 = p3.add_run(f_pkfk)
            r3.font.name = "Calibri"
            r3.font.size = Pt(8.5)
            if "PK" in f_pkfk:
                r3.font.bold = True
                r3.font.color.rgb = RGBColor(180, 40, 40)
            elif "FK" in f_pkfk:
                r3.font.bold = True
                r3.font.color.rgb = RGBColor(40, 120, 40)
            else:
                r3.font.color.rgb = COLOR_MUTED

            # Referencia
            p4 = cells[4].paragraphs[0]
            r4 = p4.add_run(f_ref)
            r4.font.name = "Calibri"
            r4.font.size = Pt(8.5)
            r4.font.color.rgb = COLOR_DARK

    out_path = r"c:\Users\HP\Desktop\revision de documento\Mapeo_Base_de_Datos_Segundo_Parcial_FashionStore.docx"
    doc.save(out_path)
    print(f"Documento generado exitosamente en: {out_path}")

if __name__ == "__main__":
    create_document()

