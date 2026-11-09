# FashionStore SaaS — Plataforma E-commerce y POS Omnicanal
> **Sistemas de Información II (SI2) — Segundo Parcial**  
> **Universidad Autónoma Gabriel René Moreno (UAGRM)**  
> **Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones**  
> **Docente:** MSc. Ing. Angélica Garzón Cuéllar  
> **Estudiante:** Yeison Choque León | **Registro:** 220025754  

---

## 🚀 Ecosistema de Repositorios Oficiales (Segundo Parcial)

| Componente | Repositorio GitHub | Tecnologías Clave |
| :--- | :--- | :--- |
| **Backend API & Documentación** | [**`SI2Parcial-2-Backend`**](https://github.com/yeisonCL/SI2Parcial-2-Backend) | Python 3.12, FastAPI, PostgreSQL (Neon Cloud), JWT, Stripe API, QR Simple |
| **Frontend Web & POS** | [**`SI2Parcial-2-Frontend`**](https://github.com/yeisonCL/SI2Parcial-2-Frontend) | Angular 17, Material Design, IndexedDB (Offline-First), WebXR 3D Viewer |
| **Aplicación Móvil** | [**`SI2Parcial-2-Mobile`**](https://github.com/yeisonCL/SI2Parcial-2-Mobile) | Flutter 3, Dart, SQLite Offline Cache, Cámara AR / Probador Virtual |

---

## 📁 Carpeta de Documentación Formal (`/documentacion`)

En este repositorio se encuentra alojada toda la documentación técnica, diagramas y memorias académicas completas del Segundo Parcial:

1. **Documento Principal de Memoria Técnica:**
   - [`SI2 Parcial 2.docx`](./documentacion/SI2%20Parcial%202.docx): Documento académico completo con metodología ICONIX, Análisis de Robustez (BCE), Diagramas de Secuencia, Comunicación, Despliegue y los 18 Casos de Prueba con capturas reales adjuntas.
2. **Batería de Pruebas de Caja Negra:**
   - [`Casos_de_Prueba_Formale_18CU_FashionStore.docx`](./documentacion/Casos_de_Prueba_Formale_18CU_FashionStore.docx): 54 tablas formales para los 18 Casos de Uso con estados `Satisfactorio` y capturas de pantalla adjuntas.
3. **Fichas Técnicas de Casos de Uso:**
   - [`Fichas_Tecnicas_Casos_de_Uso_Segundo_Parcial.docx`](./documentacion/Fichas_Tecnicas_Casos_de_Uso_Segundo_Parcial.docx): Especificación detallada de los 18 casos de uso con prototipos UI de alta resolución.
4. **Mapeo Relacional y Diccionario de Datos:**
   - [`Mapeo_Base_de_Datos_Segundo_Parcial_FashionStore.docx`](./documentacion/Mapeo_Base_de_Datos_Segundo_Parcial_FashionStore.docx): Mapeo formal de 32 entidades organizadas en 5 módulos (SaaS, Sucursales, Catálogo, Omnicanalidad y Ventas POS/Garantías).
5. **Diagramas de Arquitectura y Diseño (Draw.io y PNG):**
   - [`Diagrama_Despliegue_FashionStore_Examen.drawio`](./documentacion/Diagrama_Despliegue_FashionStore_Examen.drawio) / [`.png`](./documentacion/Diagrama_Despliegue_FashionStore_Examen.png): Diagrama de despliegue físico (Render, Vercel, Neon DB, Stripe, Gemini, ARCore).
   - [`Modelo_Dominio_Conceptual_Simple.drawio`](./documentacion/Modelo_Dominio_Conceptual_Simple.drawio) / [`.png`](./documentacion/Modelo_Dominio_Conceptual_Simple.png): Modelo de dominio conceptual según la regla de cátedra (solo nombres, relaciones verbales y multiplicidades).
   - [`Diagramas_Secuencia_Codigo_18CU.drawio`](./documentacion/Diagramas_Secuencia_Codigo_18CU.drawio): Diagramas de secuencia trazados con el código real de backend y frontend.
   - [`Diagramas_Comunicacion_Codigo_18CU.drawio`](./documentacion/Diagramas_Comunicacion_Codigo_18CU.drawio): Diagramas de colaboración/comunicación con numeración jerárquica.
   - [`Diagrama_de_Robustez.drawio`](./documentacion/Diagrama_de_Robustez.drawio) y carpeta [`Diagramas_Robustez_18CUs_PNG/`](./documentacion/Diagramas_Robustez_18CUs_PNG): Análisis BCE de los 18 casos de uso.
6. **Automatización para Enterprise Architect (JScript):**
   - [`Modelo_Dominio_Simple_EA.js`](./documentacion/Modelo_Dominio_Simple_EA.js)
   - [`Diagramas_Secuencia_EA_18CUs_Codigo.js`](./documentacion/Diagramas_Secuencia_EA_18CUs_Codigo.js)
   - [`Diagramas_Comunicacion_EA_18CUs_Codigo.js`](./documentacion/Diagramas_Comunicacion_EA_18CUs_Codigo.js)
   - [`Diagramas_Detalle_Casos_de_Uso_18_EA.js`](./documentacion/Diagramas_Detalle_Casos_de_Uso_18_EA.js)

---

## 🛠️ Ejecución Local del Backend

```bash
# 1. Crear entorno virtual e instalar dependencias
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# 2. Configurar variables de entorno (.env)
# DATABASE_URL=postgresql://neondb_owner:...@ep-winter-snow-...aws.neon.tech/neondb?sslmode=require
# SECRET_KEY=clave_secreta_jwt_fashionstore

# 3. Iniciar servidor FastAPI
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- **Swagger UI interactivo:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

