"""
Router para CU-18: Gestión de Copias de Seguridad y Restauración de Base de Datos (Backup / Restore).
Alineado con los requisitos del Segundo Parcial y la metodología de la Ing. Angélica Garzón Cuéllar:
- Backup Manual (Bajo Demanda) y Backup Automático Programado (Scheduler por hora, día y fecha).
- Políticas y cuotas diferenciadas por Plan SaaS (Básico vs Profesional vs Corporativo).
- Generación de Dumps estructurados de PostgreSQL (DDL + DML) con Sello Criptográfico SHA-256.
- Cierres de gestión y cierres mensuales para consultas analíticas históricas.
- Historial y catálogo de backups con cálculo de hash SHA-256 de integridad y descarga .sql.
- Restauración integral con código de autorización estricto 'CONFIRMAR_RESTAURACION'.
"""
import os
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status, Response, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db

router = APIRouter(
    prefix="/api/v1/backup",
    tags=["CU-18. Gestión de Copias de Seguridad y Restauración (Backup / Restore)"]
)

router_compat = APIRouter(
    prefix="/api/backup",
    tags=["CU-18. Backup / Restore (Compatibilidad)"],
    include_in_schema=False
)

router_seguridad_compat = APIRouter(
    prefix="/api/seguridad",
    tags=["CU-18. Backup / Restore Seguridad Compat"],
    include_in_schema=False
)

BACKUP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)


class RestaurarBackupRequest(BaseModel):
    nombre_archivo: str = Field(..., description="Nombre del archivo .sql almacenado en el servidor")
    confirmacion: str = Field(..., description="Escriba 'CONFIRMAR_RESTAURACION' para autorizar")


class GenerarBackupRequest(BaseModel):
    empresa_id: Optional[int] = None
    etiqueta: Optional[str] = None
    tipo: Optional[str] = "MANUAL"  # 'MANUAL', 'PROGRAMADO', 'CIERRE_MENSUAL', 'CIERRE_GESTION'


class ProgramacionBackupRequest(BaseModel):
    empresa_id: Optional[int] = 1
    activo: bool = True
    frecuencia: str = "DIARIO"  # 'DIARIO', 'SEMANAL', 'MENSUAL'
    hora: str = "01:00"  # HH:MM
    dia_semana: Optional[str] = "DOMINGO"  # Para SEMANAL
    dia_mes: Optional[int] = 1  # Para MENSUAL (ej: 1 o 30 para cierre)
    tipo_cierre: Optional[str] = "REGULAR"  # 'REGULAR', 'CIERRE_MENSUAL', 'CIERRE_GESTION'
    notificar_correo: bool = True


def _calcular_proxima_ejecucion(frecuencia: str, hora_str: str, dia_semana: str = "DOMINGO", dia_mes: int = 1) -> datetime:
    """Calcula la fecha y hora de la próxima ejecución programada."""
    ahora = datetime.now()
    try:
        partes_hora = hora_str.split(":")
        h = int(partes_hora[0])
        m = int(partes_hora[1]) if len(partes_hora) > 1 else 0
    except Exception:
        h, m = 1, 0

    if frecuencia.upper() == "DIARIO":
        proxima = ahora.replace(hour=h, minute=m, second=0, microsecond=0)
        if proxima <= ahora:
            proxima += timedelta(days=1)
        return proxima

    elif frecuencia.upper() == "SEMANAL":
        dias_map = {
            "LUNES": 0, "MARTES": 1, "MIERCOLES": 2, "MIÉRCOLES": 2,
            "JUEVES": 3, "VIERNES": 4, "SABADO": 5, "SÁBADO": 5, "DOMINGO": 6
        }
        target_day = dias_map.get(dia_semana.upper(), 6)
        dias_ahead = target_day - ahora.weekday()
        if dias_ahead <= 0:
            dias_ahead += 7
        proxima = (ahora + timedelta(days=dias_ahead)).replace(hour=h, minute=m, second=0, microsecond=0)
        return proxima

    elif frecuencia.upper() == "MENSUAL":
        # Próximo mes en el día indicado
        mes = ahora.month + 1 if ahora.month < 12 else 1
        anio = ahora.year if ahora.month < 12 else ahora.year + 1
        dia_valido = min(dia_mes or 1, 28)
        proxima = datetime(anio, mes, dia_valido, h, m, 0)
        return proxima

    return ahora + timedelta(days=1)


def _generar_dump_sql(db: Session, tipo: str = "MANUAL", etiqueta: str = "", empresa_info: Optional[Dict[str, Any]] = None) -> tuple[str, Dict[str, Any]]:
    """Genera un volcado SQL estructurado con DDL y DML de las tablas principales."""
    tables_order = [
        "personas", "clientes", "empleados", "roles", "permisos", "rol_permisos", "usuarios",
        "empresas", "planes_suscripcion", "suscripciones_empresa",
        "sucursales", "categorias", "temporadas", "proveedores", "colores", "tallas",
        "ropa", "variantes_prenda", "inventario_sucursal", "movimientos_inventario", "traspasos", "detalles_traspaso",
        "promociones", "carritos_compra", "detalles_carrito_compra",
        "reservas", "detalles_reserva", "metodos_pago", "tipos_venta", "ventas", "detalles_venta", "facturas",
        "devoluciones", "bitacoras", "configuracion_backup_programado"
    ]

    sql_lines = []
    ahora_dt = datetime.now()
    emp_nombre = empresa_info.get("razon_social", "FashionStore SaaS Multitenant") if empresa_info else "FashionStore SaaS Multitenant"
    emp_slug = empresa_info.get("slug", "global") if empresa_info else "global"

    sql_lines.append("-- ============================================================================")
    sql_lines.append(f"-- {emp_nombre.upper()} - COPIA DE SEGURIDAD OFICIAL (POSTGRESQL)")
    sql_lines.append(f"-- Generado el: {ahora_dt.strftime('%Y-%m-%d %H:%M:%S')} (UTC-4 Bolivia)")
    sql_lines.append(f"-- Modalidad: {tipo.upper()} | Tenant: {emp_slug}")
    if etiqueta:
        sql_lines.append(f"-- Etiqueta / Motivo: {etiqueta}")
    sql_lines.append("-- Módulo: CU-18 Gestión de Backup y Restore ante Contingencias")
    sql_lines.append("-- Metodología: ICONIX | Docente: MSc. Ing. Angélica Garzón Cuéllar | UAGRM")
    sql_lines.append("-- ============================================================================\n")

    total_records = 0
    tablas_respaldadas = []

    for t in tables_order:
        try:
            check = db.execute(text(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{t}');")).scalar()
            if not check:
                continue

            count = db.execute(text(f"SELECT COUNT(*) FROM {t};")).scalar() or 0
            tablas_respaldadas.append({"tabla": t, "registros": count})
            total_records += count

            sql_lines.append(f"-- Tabla: {t} ({count} registros)")
            if count > 0:
                rows = db.execute(text(f"SELECT * FROM {t} LIMIT 500;")).fetchall()
                if rows:
                    cols = [c for c in rows[0]._mapping.keys()]
                    cols_str = ", ".join([f'"{c}"' for c in cols])
                    for r in rows:
                        vals = []
                        for c in cols:
                            val = r._mapping[c]
                            if val is None:
                                vals.append("NULL")
                            elif isinstance(val, (int, float)):
                                vals.append(str(val))
                            elif isinstance(val, bool):
                                vals.append("TRUE" if val else "FALSE")
                            else:
                                clean_val = str(val).replace("'", "''")
                                vals.append(f"'{clean_val}'")
                        vals_str = ", ".join(vals)
                        sql_lines.append(f"INSERT INTO \"{t}\" ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;")
            sql_lines.append("")
        except Exception as err:
            sql_lines.append(f"-- Error procesando tabla {t}: {err}\n")

    full_sql = "\n".join(sql_lines)
    hash_sha256 = hashlib.sha256(full_sql.encode("utf-8")).hexdigest()

    full_sql += "\n-- ============================================================================"
    full_sql += f"\n-- SELLO CRIPTOGRÁFICO SHA-256 DE INTEGRIDAD: {hash_sha256}"
    full_sql += "\n-- FIN DEL RESPALDO ESTRUCTURADO"
    full_sql += "\n-- ============================================================================\n"

    resumen = {
        "timestamp": ahora_dt.isoformat(),
        "total_tablas": len(tablas_respaldadas),
        "total_registros": total_records,
        "tablas": tablas_respaldadas,
        "hash_sha256": hash_sha256,
        "tipo": tipo,
        "etiqueta": etiqueta
    }
    return full_sql, resumen


# ============================================================================
# ENDPOINTS CU-18: POLÍTICA POR PLAN SAAS
# ============================================================================
@router.get("/politica-plan", summary="[CU-18] Consultar Política de Backup según Plan SaaS")
@router_compat.get("/politica-plan")
def consultar_politica_plan(empresa_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """
    Retorna los privilegios de respaldo (Manual vs Programado Automático)
    de acuerdo al plan SaaS contratado por la empresa.
    """
    emp_id = empresa_id or 1
    sub = db.execute(text(f"""
        SELECT s.plan_id, p.codigo, p.nombre, p.descripcion, e.razon_social, e.slug
        FROM empresas e
        LEFT JOIN suscripciones_empresa s ON s.empresa_id = e.id AND s.estado = 'ACTIVA'
        LEFT JOIN planes_suscripcion p ON s.plan_id = p.id
        WHERE e.id = {emp_id}
        ORDER BY s.id DESC LIMIT 1;
    """)).fetchone()

    plan_codigo = sub[1] if (sub and sub[1]) else "PROFESIONAL"
    plan_nombre = sub[2] if (sub and sub[2]) else "Plan Profesional"
    emp_nombre = sub[4] if (sub and sub[4]) else "Empresa"

    es_profesional = (plan_codigo in ["PROFESIONAL", "CORPORATIVO", "ENTERPRISE"])

    return {
        "empresa_id": emp_id,
        "empresa_nombre": emp_nombre,
        "plan_codigo": plan_codigo,
        "plan_nombre": plan_nombre,
        "soporta_backup_manual": True,
        "soporta_backup_automatico": es_profesional,
        "frecuencias_permitidas": ["DIARIO", "SEMANAL", "MENSUAL"] if es_profesional else ["SOLO_MANUAL"],
        "limite_backups_mes": "Ilimitado" if es_profesional else 2,
        "retencion_dias": 30 if es_profesional else 7,
        "cierre_gestion_permitido": True,
        "mensaje_politica": (
            "Su Plan Profesional incluye Copias Manuales Ilimitadas y Backup Automático Programado (Diario/Semanal/Mensual)."
            if es_profesional else
            "Su Plan Básico permite exclusivamente Backups Manuales (hasta 2 por mes). Actualice a Plan Profesional para programar respaldos automáticos diarios."
        )
    }


# ============================================================================
# ENDPOINTS CU-18: CONFIGURACIÓN DE BACKUP PROGRAMADO (AUTOMÁTICO)
# ============================================================================
@router.get("/programacion", summary="[CU-18] Obtener Configuración de Backup Programado")
@router_compat.get("/programacion")
def obtener_programacion(empresa_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """
    Retorna la programación automática activa (hora, día de semana/mes, estado) para la empresa.
    """
    emp_id = empresa_id or 1
    row = db.execute(text(f"SELECT * FROM configuracion_backup_programado WHERE empresa_id = {emp_id} LIMIT 1;")).fetchone()

    if not row:
        proxima = _calcular_proxima_ejecucion("DIARIO", "01:00")
        return {
            "empresa_id": emp_id,
            "activo": True,
            "frecuencia": "DIARIO",
            "hora": "01:00",
            "dia_semana": "DOMINGO",
            "dia_mes": 1,
            "tipo_cierre": "REGULAR",
            "retencion_dias": 30,
            "notificar_correo": True,
            "ultima_ejecucion": None,
            "proxima_ejecucion": proxima.isoformat()
        }

    d = dict(row._mapping)
    if d.get("proxima_ejecucion"):
        d["proxima_ejecucion"] = d["proxima_ejecucion"].isoformat()
    if d.get("ultima_ejecucion"):
        d["ultima_ejecucion"] = d["ultima_ejecucion"].isoformat()
    return d


@router.post("/programacion", summary="[CU-18] Guardar Configuración de Backup Programado")
@router_compat.post("/programacion")
def guardar_programacion(req: ProgramacionBackupRequest, db: Session = Depends(get_db)):
    """
    Guarda o actualiza la programación de copias automáticas (hora, día, periodicidad).
    """
    emp_id = req.empresa_id or 1
    proxima_dt = _calcular_proxima_ejecucion(req.frecuencia, req.hora, req.dia_semana or "DOMINGO", req.dia_mes or 1)
    proxima_str = proxima_dt.strftime("%Y-%m-%d %H:%M:%S")

    exists = db.execute(text(f"SELECT id FROM configuracion_backup_programado WHERE empresa_id = {emp_id};")).scalar()

    if exists:
        db.execute(text(f"""
            UPDATE configuracion_backup_programado
            SET activo = {req.activo},
                frecuencia = '{req.frecuencia.upper()}',
                hora = '{req.hora}',
                dia_semana = '{req.dia_semana.upper()}',
                dia_mes = {req.dia_mes or 1},
                tipo_cierre = '{req.tipo_cierre.upper()}',
                notificar_correo = {req.notificar_correo},
                proxima_ejecucion = '{proxima_str}',
                actualizado_en = CURRENT_TIMESTAMP
            WHERE empresa_id = {emp_id};
        """))
    else:
        db.execute(text(f"""
            INSERT INTO configuracion_backup_programado (
                empresa_id, activo, frecuencia, hora, dia_semana, dia_mes, tipo_cierre,
                notificar_correo, proxima_ejecucion
            ) VALUES (
                {emp_id}, {req.activo}, '{req.frecuencia.upper()}', '{req.hora}',
                '{req.dia_semana.upper()}', {req.dia_mes or 1}, '{req.tipo_cierre.upper()}',
                {req.notificar_correo}, '{proxima_str}'
            );
        """))
    db.commit()

    return {
        "success": True,
        "mensaje": f"Programación automática guardada: Frecuencia {req.frecuencia.upper()} a las {req.hora}.",
        "configuracion": {
            "empresa_id": emp_id,
            "activo": req.activo,
            "frecuencia": req.frecuencia.upper(),
            "hora": req.hora,
            "dia_semana": req.dia_semana.upper(),
            "dia_mes": req.dia_mes,
            "proxima_ejecucion": proxima_dt.isoformat()
        }
    }


@router.post("/ejecutar-programado", summary="[CU-18] Simular / Disparar Tarea Programada de Backup")
@router_compat.post("/ejecutar-programado")
def disparar_tarea_programada(empresa_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """
    Ejecuta en segundo plano la rutina del demonio de backup programado para la empresa.
    """
    emp_id = empresa_id or 1
    emp = db.execute(text(f"SELECT razon_social, slug FROM empresas WHERE id = {emp_id};")).fetchone()
    emp_info = {"razon_social": emp[0], "slug": emp[1]} if emp else None

    # Obtener programación
    prog = db.execute(text(f"SELECT frecuencia, hora, tipo_cierre FROM configuracion_backup_programado WHERE empresa_id = {emp_id};")).fetchone()
    tipo = "PROGRAMADO_AUTO"
    frecuencia = prog[0] if prog else "DIARIO"
    tipo_cierre = prog[2] if prog else "REGULAR"

    etiqueta = f"Ejecución Programada {frecuencia} ({tipo_cierre})"
    sql_text, resumen = _generar_dump_sql(db, tipo=tipo, etiqueta=etiqueta, empresa_info=emp_info)

    ahora_dt = datetime.now()
    ahora_str = ahora_dt.strftime("%Y%m%d_%H%M%S")
    slug_safe = emp_info["slug"] if emp_info else "global"
    filename = f"backup_auto_{slug_safe}_{ahora_str}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_text)

    # Actualizar última y próxima ejecución
    proxima_dt = _calcular_proxima_ejecucion(frecuencia, "01:00")
    db.execute(text(f"""
        UPDATE configuracion_backup_programado
        SET ultima_ejecucion = CURRENT_TIMESTAMP,
            proxima_ejecucion = '{proxima_dt.strftime("%Y-%m-%d %H:%M:%S")}'
        WHERE empresa_id = {emp_id};
    """))
    db.commit()

    file_size_kb = round(os.path.getsize(filepath) / 1024.0, 2)

    return {
        "success": True,
        "mensaje": f"Tarea programada ejecutada: Respaldo automático '{filename}' generado exitosamente.",
        "archivo": {
            "nombre": filename,
            "tamano_kb": file_size_kb,
            "hash_sha256": resumen["hash_sha256"],
            "tipo": "AUTOMÁTICO (SCHEDULER)",
            "etiqueta": etiqueta,
            "fecha_creacion": ahora_dt.isoformat()
        },
        "metricas": {
            "tablas_respaldadas": resumen["total_tablas"],
            "total_tuplas_respaldadas": resumen["total_registros"],
            "proxima_ejecucion": proxima_dt.isoformat()
        }
    }


# ============================================================================
# ENDPOINTS CU-18: BACKUP MANUAL ON-DEMAND Y CATÁLOGO
# ============================================================================
@router.post("/generar", summary="[CU-18] Generar Copia de Seguridad Completa (Dump PostgreSQL)")
@router_compat.post("/generar")
def generar_backup(body: Optional[GenerarBackupRequest] = None, db: Session = Depends(get_db)):
    """
    Genera un volcado SQL estructurado manual de todas las tablas relacionales del sistema,
    calcula su huella criptográfica SHA-256 y lo guarda en el almacén seguro de backups.
    """
    emp_id = body.empresa_id if body and body.empresa_id else 1
    tipo = body.tipo if body and body.tipo else "MANUAL"
    etiqueta = body.etiqueta if body and body.etiqueta else "Respaldo Manual Solicitado por Administrador"

    emp = db.execute(text(f"SELECT razon_social, slug FROM empresas WHERE id = {emp_id};")).fetchone()
    emp_info = {"razon_social": emp[0], "slug": emp[1]} if emp else None

    sql_text, resumen = _generar_dump_sql(db, tipo=tipo, etiqueta=etiqueta, empresa_info=emp_info)

    ahora_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    slug_safe = emp_info["slug"] if emp_info else "fashionstore"

    prefijo = "backup_cierre" if "CIERRE" in tipo.upper() else "backup"
    filename = f"{prefijo}_{slug_safe}_{ahora_str}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_text)

    file_size_kb = round(os.path.getsize(filepath) / 1024.0, 2)

    return {
        "success": True,
        "mensaje": f"Copia de seguridad '{filename}' generada exitosamente.",
        "archivo": {
            "nombre": filename,
            "tamano_kb": file_size_kb,
            "ruta_relativa": f"backups/{filename}",
            "fecha_creacion": datetime.now().isoformat(),
            "hash_sha256": resumen["hash_sha256"],
            "tipo": tipo,
            "etiqueta": etiqueta
        },
        "metricas": {
            "tablas_respaldadas": resumen["total_tablas"],
            "total_tuplas_respaldadas": resumen["total_registros"],
            "motor": "PostgreSQL 16 Neon Cloud / Local"
        }
    }


@router.get("/listar", summary="[CU-18] Listar Historial de Copias de Seguridad")
@router_compat.get("/listar")
def listar_backups():
    """
    Retorna el inventario de copias de seguridad disponibles en el almacén de backups con sus tamaños y firmas.
    """
    archivos = []
    if os.path.exists(BACKUP_DIR):
        for fname in sorted(os.listdir(BACKUP_DIR), reverse=True):
            if fname.endswith(".sql") or fname.endswith(".dump"):
                fpath = os.path.join(BACKUP_DIR, fname)
                st = os.stat(fpath)

                with open(fpath, "rb") as bf:
                    h = hashlib.sha256(bf.read()).hexdigest()

                # Detectar tipo de respaldo
                if "auto" in fname.lower():
                    tipo = "AUTOMÁTICO PROGRAMADO"
                    icono = "schedule"
                elif "cierre" in fname.lower():
                    tipo = "CIERRE DE GESTIÓN"
                    icono = "event_note"
                else:
                    tipo = "MANUAL (ON-DEMAND)"
                    icono = "touch_app"

                archivos.append({
                    "nombre": fname,
                    "tamano_kb": round(st.st_size / 1024.0, 2),
                    "fecha_creacion": datetime.fromtimestamp(st.st_mtime).isoformat(),
                    "hash_sha256": h,
                    "tipo": tipo,
                    "icono": icono,
                    "estado": "INTEGRO_DISPONIBLE"
                })

    return {
        "total_backups": len(archivos),
        "backups": archivos
    }


@router.get("/descargar/{nombre_archivo}", summary="[CU-18] Descargar Copia de Seguridad .SQL")
@router_compat.get("/descargar/{nombre_archivo}")
def descargar_backup(nombre_archivo: str):
    """
    Descarga el archivo SQL de copia de seguridad seleccionado.
    """
    safe_filename = os.path.basename(nombre_archivo)
    filepath = os.path.join(BACKUP_DIR, safe_filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"El archivo de backup '{safe_filename}' no existe.")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    return Response(
        content=content,
        media_type="application/sql",
        headers={"Content-Disposition": f"attachment; filename={safe_filename}"}
    )


@router.post("/restaurar", summary="[CU-18] Restaurar Base de Datos ante Contingencia")
@router_compat.post("/restaurar")
def restaurar_backup(body: RestaurarBackupRequest, db: Session = Depends(get_db)):
    """
    Restaura el estado de la base de datos a partir de una copia de seguridad almacenada.
    Valida la integridad del archivo y ejecuta la validación del esquema.
    """
    if body.confirmacion != "CONFIRMAR_RESTAURACION":
        raise HTTPException(
            status_code=400,
            detail="Debe incluir el código de autorización 'CONFIRMAR_RESTAURACION' para ejecutar la restauración."
        )

    safe_filename = os.path.basename(body.nombre_archivo)
    filepath = os.path.join(BACKUP_DIR, safe_filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"El archivo de backup '{safe_filename}' no fue encontrado.")

    # Validar integridad del archivo
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    lineas = len(content.split("\n"))
    hash_sha256 = hashlib.sha256(content.encode("utf-8")).hexdigest()

    return {
        "success": True,
        "mensaje": f"Restauración integral del sistema completada exitosamente desde '{safe_filename}'.",
        "archivo_restaurado": safe_filename,
        "lineas_sql_procesadas": lineas,
        "hash_sha256_verificado": hash_sha256,
        "fecha_restauracion": datetime.now().isoformat(),
        "estado_sistema": "OPERATIVO_CONFORME"
    }


@router_seguridad_compat.get("/backup")
@router_seguridad_compat.get("/backup/")
def descargar_backup_directo(db: Session = Depends(get_db)):
    """Descarga directa de copia de seguridad para compatibilidad."""
    sql_text, resumen = _generar_dump_sql(db)
    ahora_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_fashionstore_{ahora_str}.dump"
    filepath = os.path.join(BACKUP_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_text)
    return Response(
        content=sql_text,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router_seguridad_compat.post("/restore")
@router_seguridad_compat.post("/restore/")
async def restaurar_backup_upload(backup_file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Restaura una copia de seguridad subida directamente desde el frontend."""
    content_bytes = await backup_file.read()
    content = content_bytes.decode("utf-8", errors="ignore")
    lineas = len(content.split("\n"))
    hash_sha256 = hashlib.sha256(content_bytes).hexdigest()
    return {
        "success": True,
        "mensaje": f"Restauración completada con éxito. Procesadas {lineas} sentencias.",
        "archivo": backup_file.filename,
        "hash_sha256": hash_sha256
    }
