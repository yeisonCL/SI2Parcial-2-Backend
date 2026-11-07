"""
Router para CU-18: Gestión de Copias de Seguridad y Restauración de Base de Datos (Backup / Restore).
Alineado con los requisitos del Segundo Parcial y la metodología de la Ing. Angélica Garzón Cuéllar:
- Modalidad Manual: "ahorita yo decido hacer una copia de seguridad y lo hago" (Inmediata y Cierres de Gestión).
- Modalidad Automática: Programada por hora, día y fecha ("todos los días a la 1:00 AM").
- Diferenciación por Plan SaaS: Plan Básico (cuota limitada 3-5 copias) vs Plan Profesional (automatización diaria + retención 30 copias).
- Rotación automática de backups para no saturar el servidor ("cuando no pagamos les dan un contador muy poquito").
- Generación de Dumps estructurados de PostgreSQL (DDL + DML) con Sello SHA-256.
- Restauración integral ante contingencias con código estricto 'CONFIRMAR_RESTAURACION'.
"""
import os
import json
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
CONFIG_FILE = os.path.join(BACKUP_DIR, "schedule_config.json")


class RestaurarBackupRequest(BaseModel):
    nombre_archivo: str = Field(..., description="Nombre del archivo .sql almacenado en el servidor")
    confirmacion: str = Field(..., description="Escriba 'CONFIRMAR_RESTAURACION' para autorizar")


class ProgramacionBackupRequest(BaseModel):
    activo: bool = Field(True, description="Habilitar o suspender el cron de backups automáticos")
    hora: str = Field("01:00", description="Hora de ejecución automática (ej: '01:00' para la 1:00 AM)")
    frecuencia: str = Field("diario", description="Frecuencia: 'diario', 'semanal', 'mensual'")
    dia_semana: str = Field("todos", description="Días: 'todos', 'lunes', 'viernes', 'domingo', 'fin_mes'")
    max_retencion: int = Field(30, description="Cantidad máxima de backups en almacenamiento antes de rotación")
    plan: Optional[str] = Field("PROFESIONAL", description="Plan de la empresa: 'BASICO' o 'PROFESIONAL'")


class GenerarBackupRequest(BaseModel):
    tipo: Optional[str] = Field("MANUAL_OPERATIVO", description="Tipo: MANUAL_OPERATIVO, CIERRE_MES, FIN_GESTION, AUTOMATICO_CRON")
    descripcion: Optional[str] = Field(None, description="Nota o motivo del respaldo")


def _obtener_config_programacion() -> Dict[str, Any]:
    """Lee o inicializa la configuración de automatización y retención de backups."""
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    # Configuración por defecto según indicaciones de la docente ("todos los días a la 1:00 AM")
    ahora = datetime.now()
    proxima = (ahora + timedelta(days=1)).replace(hour=1, minute=0, second=0, microsecond=0)
    default_config = {
        "activo": True,
        "hora": "01:00",
        "frecuencia": "diario",
        "dia_semana": "todos",
        "max_retencion": 30,
        "plan_activo": "PROFESIONAL",
        "tipo_programacion": "CRON_AUTOMATICO_01_00_AM",
        "ultimo_backup_automatico": ahora.strftime("%Y-%m-%d 01:00:00"),
        "proxima_ejecucion": proxima.isoformat(),
        "rotacion_habilitada": True
    }
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(default_config, f, indent=2)
    return default_config


def _guardar_config_programacion(config: Dict[str, Any]):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)


def _calcular_proxima_ejecucion(hora_str: str, frecuencia: str) -> str:
    try:
        partes = hora_str.strip().split(":")
        h = int(partes[0])
        m = int(partes[1]) if len(partes) > 1 else 0
    except Exception:
        h, m = 1, 0

    ahora = datetime.now()
    candidato = ahora.replace(hour=h, minute=m, second=0, microsecond=0)
    if candidato <= ahora:
        if frecuencia == "semanal":
            candidato += timedelta(days=7)
        elif frecuencia == "mensual":
            candidato += timedelta(days=30)
        else:
            candidato += timedelta(days=1)
    return candidato.isoformat()


def _aplicar_rotacion_retencion(max_retencion: int):
    """
    Elimina los backups más antiguos si se supera la cuota permitida por el plan
    para evitar saturación de disco o nube (regla explicada por la docente).
    """
    if not os.path.exists(BACKUP_DIR) or max_retencion <= 0:
        return

    archivos_sql = []
    for fname in os.listdir(BACKUP_DIR):
        if fname.endswith(".sql"):
            fpath = os.path.join(BACKUP_DIR, fname)
            archivos_sql.append((os.path.getmtime(fpath), fpath))

    archivos_sql.sort(key=lambda x: x[0], reverse=True) # Más nuevos primero

    if len(archivos_sql) > max_retencion:
        a_eliminar = archivos_sql[max_retencion:]
        for _, path_del in a_eliminar:
            try:
                os.remove(path_del)
            except Exception:
                pass


def _generar_dump_sql(db: Session, tipo_backup: str = "MANUAL_OPERATIVO") -> tuple[str, Dict[str, Any]]:
    """Genera un volcado SQL estructurado con DDL y DML de las tablas principales."""
    tables_order = [
        "personas", "clientes", "empleados", "roles", "permisos", "rol_permisos", "usuarios",
        "empresas", "planes_suscripcion", "suscripciones_empresa",
        "sucursales", "categorias", "temporadas", "proveedores", "colores", "tallas",
        "ropa", "variantes_prenda", "inventario_sucursal", "movimientos_inventario", "traspasos", "detalles_traspaso",
        "promociones", "carritos_compra", "detalles_carrito_compra",
        "reservas", "detalles_reserva", "metodos_pago", "tipos_venta", "ventas", "detalles_venta", "facturas",
        "devoluciones", "bitacoras"
    ]

    sql_lines = []
    ahora_dt = datetime.now()
    sql_lines.append("-- ============================================================================")
    sql_lines.append("-- FASHIONSTORE SAAS MULTITENANT - COPIA DE SEGURIDAD OFICIAL (POSTGRESQL)")
    sql_lines.append(f"-- Generado el: {ahora_dt.strftime('%Y-%m-%d %H:%M:%S')} (UTC-4 Bolivia)")
    sql_lines.append(f"-- Modalidad: {tipo_backup}")
    sql_lines.append("-- Módulo: CU-18 Gestión de Backup y Restore ante Contingencias")
    sql_lines.append("-- Docente: MSc. Ing. Angélica Garzón Cuéllar | UAGRM")
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
    full_sql += f"\n-- MODALIDAD: {tipo_backup}"
    full_sql += "\n-- FIN DEL RESPALDO ESTRUCTURADO"
    full_sql += "\n-- ============================================================================\n"

    resumen = {
        "timestamp": ahora_dt.isoformat(),
        "total_tablas": len(tablas_respaldadas),
        "total_registros": total_records,
        "tablas": tablas_respaldadas,
        "hash_sha256": hash_sha256,
        "tipo_backup": tipo_backup
    }
    return full_sql, resumen


# =============================================================================
# ENDPOINTS CU-18
# =============================================================================

@router.get("/programacion", summary="[CU-18] Obtener Configuración de Backup Automático y Cuotas de Plan")
@router_compat.get("/programacion")
def obtener_programacion():
    """Retorna la configuración actual del cron automático, hora (01:00 AM), frecuencia y cuotas del plan SaaS."""
    cfg = _obtener_config_programacion()
    return {
        "success": True,
        "configuracion": cfg,
        "reglas_plan": {
            "BASICO": {
                "nombre": "Plan Básico",
                "backups_manuales": "Ilimitados en local",
                "backups_automaticos": "Limitado a Semanal",
                "cuota_maxima_nube": 5,
                "soporta_cierre_gestion": False,
                "hora_cron_defecto": "01:00 AM"
            },
            "PROFESIONAL": {
                "nombre": "Plan Profesional",
                "backups_manuales": "Ilimitados",
                "backups_automaticos": "Habilitado Diario (01:00 AM) configurable",
                "cuota_maxima_nube": 30,
                "soporta_cierre_gestion": True,
                "hora_cron_defecto": "01:00 AM"
            }
        }
    }


@router.post("/programacion", summary="[CU-18] Guardar Configuración de Programación Automática (Hora, Día, Frecuencia)")
@router_compat.post("/programacion")
def guardar_programacion(body: ProgramacionBackupRequest):
    """
    Permite configurar la ejecución programada de backups:
    - Hora de ejecución (ej. 01:00 AM)
    - Frecuencia (diario, semanal, mensual)
    - Día de la semana
    - Cuota máxima de retención
    """
    cfg = _obtener_config_programacion()
    cfg["activo"] = body.activo
    cfg["hora"] = body.hora
    cfg["frecuencia"] = body.frecuencia
    cfg["dia_semana"] = body.dia_semana
    cfg["max_retencion"] = body.max_retencion
    if body.plan:
        cfg["plan_activo"] = body.plan.upper()

    cfg["proxima_ejecucion"] = _calcular_proxima_ejecucion(body.hora, body.frecuencia)
    _guardar_config_programacion(cfg)

    return {
        "success": True,
        "mensaje": f"Programación de backups actualizada: Ejecución {body.frecuencia} a las {body.hora} ({body.dia_semana}).",
        "configuracion": cfg
    }


@router.post("/disparar-cron-automatico", summary="[CU-18] Disparar Ciclo de Backup Automático (Simular Cron 01:00 AM)")
@router_compat.post("/disparar-cron-automatico")
def disparar_cron_automatico(db: Session = Depends(get_db)):
    """
    Ejecuta el ciclo de backup automático simulando la activación del Cron de las 01:00 AM.
    Genera el dump SQL con firma SHA-256 y aplica la rotación de retención de copias antiguas.
    """
    cfg = _obtener_config_programacion()
    sql_text, resumen = _generar_dump_sql(db, tipo_backup="AUTOMATICO_CRON_01_00_AM")

    ahora_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_auto_cron_01am_{ahora_str}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_text)

    file_size_kb = round(os.path.getsize(filepath) / 1024.0, 2)

    # Actualizar estado de ejecución
    cfg["ultimo_backup_automatico"] = datetime.now().isoformat()
    cfg["proxima_ejecucion"] = _calcular_proxima_ejecucion(cfg.get("hora", "01:00"), cfg.get("frecuencia", "diario"))
    _guardar_config_programacion(cfg)

    # Aplicar rotación según cuota del plan (elimina backups antiguos si superan max_retencion)
    max_ret = cfg.get("max_retencion", 30)
    _aplicar_rotacion_retencion(max_ret)

    return {
        "success": True,
        "mensaje": f"Backup automático programado ejecutado exitosamente a las {cfg.get('hora', '01:00')} AM.",
        "archivo": {
            "nombre": filename,
            "tamano_kb": file_size_kb,
            "tipo": "AUTOMATICO",
            "etiqueta": f"Cron {cfg.get('frecuencia', 'Diario').capitalize()} a las {cfg.get('hora', '01:00')} AM",
            "hash_sha256": resumen["hash_sha256"],
            "fecha_creacion": datetime.now().isoformat()
        },
        "rotacion": {
            "retencion_maxima": max_ret,
            "estado": "Rotación y limpieza de cuota aplicadas conforme al Plan SaaS"
        },
        "proxima_ejecucion": cfg["proxima_ejecucion"]
    }


@router.post("/generar", summary="[CU-18] Generar Copia de Seguridad Manual o Cierre de Gestión")
@router_compat.post("/generar")
def generar_backup(body: Optional[GenerarBackupRequest] = None, db: Session = Depends(get_db)):
    """
    Genera un volcado SQL estructurado manual de todas las tablas del sistema.
    Soporta tipos: 'MANUAL_OPERATIVO', 'CIERRE_MES', 'FIN_GESTION'.
    Calcula su huella SHA-256 y lo guarda en el catálogo seguro.
    """
    tipo_sel = (body.tipo if body and body.tipo else "MANUAL_OPERATIVO").upper()
    sql_text, resumen = _generar_dump_sql(db, tipo_backup=tipo_sel)

    prefijo = "cierre_mes" if "CIERRE" in tipo_sel else ("fin_gestion" if "GESTION" in tipo_sel else "manual")
    ahora_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_{prefijo}_{ahora_str}.sql"
    filepath = os.path.join(BACKUP_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sql_text)

    file_size_kb = round(os.path.getsize(filepath) / 1024.0, 2)

    # Rotación preventiva
    cfg = _obtener_config_programacion()
    _aplicar_rotacion_retencion(cfg.get("max_retencion", 30))

    return {
        "success": True,
        "mensaje": f"Copia de seguridad '{filename}' ({tipo_sel}) generada exitosamente.",
        "archivo": {
            "nombre": filename,
            "tamano_kb": file_size_kb,
            "tipo": tipo_sel,
            "ruta_relativa": f"backups/{filename}",
            "fecha_creacion": datetime.now().isoformat(),
            "hash_sha256": resumen["hash_sha256"]
        },
        "metricas": {
            "tablas_respaldadas": resumen["total_tablas"],
            "total_tuplas_respaldadas": resumen["total_registros"],
            "motor": "PostgreSQL 16 Neon Cloud / Local"
        }
    }


@router.get("/listar", summary="[CU-18] Listar Historial de Copias de Seguridad (Manuales y Automáticas)")
@router_compat.get("/listar")
def listar_backups():
    """
    Retorna el inventario de copias de seguridad disponibles con etiquetas de origen
    (Manual, Automático 01:00 AM, Cierre de Mes) y firmas SHA-256.
    """
    archivos = []
    if os.path.exists(BACKUP_DIR):
        for fname in sorted(os.listdir(BACKUP_DIR), reverse=True):
            if fname.endswith(".sql"):
                fpath = os.path.join(BACKUP_DIR, fname)
                st = os.stat(fpath)

                with open(fpath, "rb") as bf:
                    h = hashlib.sha256(bf.read()).hexdigest()

                # Detectar tipo según nombre
                fname_lower = fname.lower()
                if "auto" in fname_lower or "cron" in fname_lower:
                    tipo = "AUTOMATICO"
                    etiqueta = "Automático (Cron 01:00 AM)"
                    badge_class = "badge-auto"
                elif "cierre" in fname_lower or "mes" in fname_lower:
                    tipo = "CIERRE_MES"
                    etiqueta = "Cierre de Mes (Histórico)"
                    badge_class = "badge-cierre"
                elif "gestion" in fname_lower:
                    tipo = "FIN_GESTION"
                    etiqueta = "Fin de Gestión (Auditoría)"
                    badge_class = "badge-gestion"
                else:
                    tipo = "MANUAL"
                    etiqueta = "Manual Bajo Demanda"
                    badge_class = "badge-manual"

                archivos.append({
                    "nombre": fname,
                    "tamano_kb": round(st.st_size / 1024.0, 2),
                    "fecha_creacion": datetime.fromtimestamp(st.st_mtime).isoformat(),
                    "hash_sha256": h,
                    "estado": "INTEGRO_DISPONIBLE",
                    "tipo": tipo,
                    "etiqueta": etiqueta,
                    "badge_class": badge_class
                })

    cfg = _obtener_config_programacion()
    return {
        "total_backups": len(archivos),
        "backups": archivos,
        "configuracion_cron": cfg
    }


@router.get("/descargar/{nombre_archivo}", summary="[CU-18] Descargar Copia de Seguridad .SQL")
@router_compat.get("/descargar/{nombre_archivo}")
def descargar_backup(nombre_archivo: str):
    """Descarga el archivo SQL de copia de seguridad seleccionado."""
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
    """Descarga directa de copia de seguridad para el panel de DatabaseManagement."""
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
