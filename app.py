import streamlit as st
import subprocess
import re
from pathlib import Path
import time
import os
import platform
from datetime import datetime, timedelta
import unicodedata

# --- CONFIGURACIÓN ---
st.set_page_config(page_title="Organizador Tareas", page_icon="🎓", layout="wide")
BASE_DIR = Path(__file__).parent
DASHBOARD_FILE = BASE_DIR / "DAM-Dashboard.md"
SCRIPT_SYNC = BASE_DIR / "dash_autosync.py"

# --- ESTILOS CSS ---
st.markdown("""
<style>
    .stButton button { width: 100%; border-radius: 8px; font-weight: bold; }
    .metric-card { background-color: #262730; padding: 15px; border-radius: 10px; text-align: center; }
    div[data-testid="stExpander"] details summary { font-weight: bold; font-size: 1.1em; }
    .stTextArea textarea { height: 100px; }
    .alerta-examen { padding: 10px; border-radius: 5px; background-color: #7d1a1a; color: white; margin-bottom: 5px; font-size: 0.9em;}
    .resultado-busqueda { padding: 8px; background-color: #1e2025; border-left: 3px solid #00bdff; margin-bottom: 5px; border-radius: 0 5px 5px 0;}
    hr { margin-top: 1em; margin-bottom: 1em; }
</style>
""", unsafe_allow_html=True)

# --- MAPEO DE ETIQUETAS ---
TAGS_SHORTCUTS = {
    "Programación": "@PROG",
    "Bases de Datos": "@BBDD",
    "Lenguajes de Marcas": "@LMSGI",
    "Entornos": "@ED",
    "Sistemas": "@SIS",
    "Inglés": "@INGLES",
    "Digitalización": "@DIGI",
    "Itinerario": "@IP",
    "General / Otros": ""
}

# --- FUNCIONES ---

def normalize(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c)).upper()

def abrir_carpeta_local():
    path = str(BASE_DIR)
    if platform.system() == "Windows": os.startfile(path)
    elif platform.system() == "Darwin": subprocess.Popen(["open", path])
    else: subprocess.Popen(["xdg-open", path])

def ejecutar_sync():
    try:
        result = subprocess.run(["python", str(SCRIPT_SYNC)], capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        return f"Error: {e}"

def obtener_info_asignaturas():
    if not DASHBOARD_FILE.exists(): return {}
    contenido = DASHBOARD_FILE.read_text(encoding="utf-8", errors="ignore")
    patron = re.compile(r'##\s+(\d+\s+.*?)\s+—\s+\[.+?\]\(\./(.+?\.md)\)')
    mapa = {}
    for linea in contenido.splitlines():
        match = patron.search(linea)
        if match:
            titulo_raw = match.group(1).strip()
            archivo = match.group(2).strip()
            partes = titulo_raw.split(" ", 2)
            mapa[titulo_raw] = {"archivo": archivo, "codigo": partes[0], "nombre_clean": titulo_raw}
    return mapa

def leer_archivo_detalle(nombre_archivo):
    path = BASE_DIR / nombre_archivo
    if not path.exists(): return None
    text = path.read_text(encoding="utf-8", errors="ignore")
    secciones = {"Pendientes": [], "Píldoras": [], "Evaluación": [], "Hechas": [], "Ejercicios": []}
    lines = text.splitlines()
    seccion_actual = None
    for line in lines:
        l_low = line.lower().strip()
        if "clases pendientes" in l_low: seccion_actual = "Pendientes"
        elif "píldoras" in l_low or "pildoras" in l_low: seccion_actual = "Píldoras"
        elif "evaluación" in l_low or "evaluacion" in l_low: seccion_actual = "Evaluación"
        elif "ejercicios" in l_low: seccion_actual = "Ejercicios"
        elif "hechas" in l_low: seccion_actual = "Hechas"
        elif line.startswith("## "): seccion_actual = "Otros"
        
        if seccion_actual in secciones and not line.startswith("## "):
            if line.strip(): secciones[seccion_actual].append(line)
    return secciones

def marcar_tarea_dashboard(texto_linea_original):
    if not DASHBOARD_FILE.exists(): return False
    texto_tarea_limpio = re.sub(r'^\s*-\s*\[\s*\]\s+', '', texto_linea_original).strip()
    contenido_dash = DASHBOARD_FILE.read_text(encoding="utf-8", errors="ignore")
    lineas = contenido_dash.splitlines()
    nueva_lista = []
    encontrado = False
    patron_busqueda = re.compile(r'^\s*-\s*\[\s*\]\s+' + re.escape(texto_tarea_limpio) + r'\s*$')

    for linea in lineas:
        if not encontrado and patron_busqueda.match(linea):
            nueva_linea = f"- [x] {texto_tarea_limpio}"
            nueva_lista.append(nueva_linea)
            encontrado = True
        else:
            nueva_lista.append(linea)
    if encontrado:
        DASHBOARD_FILE.write_text("\n".join(nueva_lista), encoding="utf-8")
        return True
    return False

def editar_tarea_dashboard(texto_original, texto_nuevo):
    if not DASHBOARD_FILE.exists(): return False
    texto_viejo_limpio = re.sub(r'^\s*-\s*\[\s*\]\s+', '', texto_original)
    texto_viejo_limpio = texto_viejo_limpio.replace("⬜", "").strip()
    contenido_dash = DASHBOARD_FILE.read_text(encoding="utf-8", errors="ignore")
    lineas = contenido_dash.splitlines()
    nueva_lista = []
    encontrado = False
    patron_busqueda = re.compile(r'^\s*-\s*\[\s*\]\s+.*' + re.escape(texto_viejo_limpio) + r'.*$')

    for linea in lineas:
        if not encontrado and patron_busqueda.match(linea):
            nueva_linea = f"- [ ] {texto_nuevo}"
            nueva_lista.append(nueva_linea)
            encontrado = True
        else:
            nueva_lista.append(linea)
    if encontrado:
        DASHBOARD_FILE.write_text("\n".join(nueva_lista), encoding="utf-8")
        return True
    return False

def guardar_inbox(tag, texto):
    if not DASHBOARD_FILE.exists(): return
    lines = DASHBOARD_FILE.read_text(encoding="utf-8", errors="ignore").splitlines()
    for i, line in enumerate(lines):
        if "## 00 Clases pendientes" in line:
            lines.insert(i + 1, f"- [ ] {tag} {texto}")
            lines.insert(i + 2, "")
            break
    DASHBOARD_FILE.write_text("\n".join(lines), encoding="utf-8")

def guardar_seccion_directa(nombre_asignatura_bonito, texto, seccion_buscada):
    archivo_destino = None
    buscado_norm = normalize(nombre_asignatura_bonito)
    for nombre_real, info in mapa_asignaturas.items():
        real_norm = normalize(nombre_real)
        tag_asociado = TAGS_SHORTCUTS.get(nombre_asignatura_bonito, "XYZ")
        if buscado_norm in real_norm or tag_asociado in nombre_real:
             archivo_destino = info['archivo']
             break
    if not archivo_destino: return False
    path = BASE_DIR / archivo_destino
    if not path.exists(): return False
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    
    insertado = False
    for i, line in enumerate(lines):
        if seccion_buscada.lower() in line.lower() and line.startswith("##"):
            lines.insert(i + 1, f"- {texto}")
            insertado = True
            break
            
    if not insertado:
        idx_hechas = -1
        for i, line in enumerate(lines):
            if "## Hechas" in line:
                idx_hechas = i
                break
        bloque = [f"", f"## {seccion_buscada}", f"- {texto}"]
        if idx_hechas != -1:
            lines[idx_hechas:idx_hechas] = bloque
        else:
            lines.extend(bloque)
        insertado = True

    if insertado:
        path.write_text("\n".join(lines), encoding="utf-8")
        return True
    return False

def marcar_ejercicio_hecho(nombre_archivo, texto_linea):
    path = BASE_DIR / nombre_archivo
    if not path.exists(): return False
    content = path.read_text(encoding="utf-8", errors="ignore")
    if texto_linea in content:
        nuevo = content.replace(texto_linea, texto_linea.replace("- [ ]", "- [x]"), 1)
        if "- [ ]" not in texto_linea and "- [x]" not in texto_linea:
             nuevo = content.replace(texto_linea, texto_linea.replace("- ", "- [x] "), 1)
        path.write_text(nuevo, encoding="utf-8")
        return True
    return False

def buscar_examenes_proximos(mapa_asignaturas):
    alertas = []
    hoy = datetime.now()
    patron_fecha = re.compile(r'(\d{1,2}[/-]\d{1,2})')
    for nombre, info in mapa_asignaturas.items():
        datos = leer_archivo_detalle(info['archivo'])
        if not datos or not datos["Evaluación"]: continue
        for linea in datos["Evaluación"]:
            match = patron_fecha.search(linea)
            if match:
                fecha_str = match.group(1).replace("-", "/")
                try:
                    dia, mes = map(int, fecha_str.split("/"))
                    anio = hoy.year
                    if mes < hoy.month: anio += 1
                    fecha_examen = datetime(anio, mes, dia)
                    dias_restantes = (fecha_examen - hoy).days + 1
                    if 0 <= dias_restantes <= 15:
                        nombre_corto = nombre.split(" ", 2)[-1]
                        if dias_restantes == 0: msg = f"¡HOY! {nombre_corto}"
                        elif dias_restantes == 1: msg = f"¡MAÑANA! {nombre_corto}"
                        else: msg = f"{dias_restantes} días: {nombre_corto} ({fecha_str})"
                        alertas.append(msg)
                except: pass
    return alertas

def buscador_global(termino, mapa_asignaturas):
    resultados = []
    for nombre, info in mapa_asignaturas.items():
        path = BASE_DIR / info['archivo']
        if path.exists():
            lineas = path.read_text(encoding="utf-8", errors="ignore").splitlines()
            for i, linea in enumerate(lineas):
                if termino.lower() in linea.lower() and not linea.startswith("#"):
                    resultados.append(f"**{nombre}**: {linea.strip()}")
    return resultados

# --- FUNCION DE CONTEO INTELIGENTE (FILTRO ANTI-FANTASMAS) ---
def contar_items_validos(lista_lineas):
    """Cuenta solo las líneas que tienen un checkbox Y texto real"""
    contador = 0
    for t in lista_lineas:
        # Busca checkbox
        if re.search(r'-\s*\[\s*\]', t):
            # Limpia el checkbox
            texto_limpio = re.sub(r'-\s*\[\s*\]', '', t).strip()
            # Si queda texto, cuenta. Si está vacío, es un fantasma.
            if texto_limpio:
                contador += 1
    return contador

# --- INTERFAZ ---
mapa_asignaturas = obtener_info_asignaturas()
nombres_asignaturas = sorted(list(mapa_asignaturas.keys()))

with st.sidebar:
    st.header("🎛️ Centro de Mando")
    modo_vista = st.radio("Modo:", ["🏠 Vista General", "📂 Asignatura Detalle"])
    
    if modo_vista == "📂 Asignatura Detalle":
        asignatura_activa = st.selectbox("Selecciona:", nombres_asignaturas)
    
    # --- BUSCADOR ---
    st.divider()
    with st.expander("🔍 Buscar"):
        query = st.text_input("Palabra clave:", placeholder="ej: examen, citas...")
        if query:
            res = buscador_global(query, mapa_asignaturas)
            if res:
                for r in res: st.markdown(f'<div class="resultado-busqueda">{r}</div>', unsafe_allow_html=True)
            else: st.caption("No encontrado.")

    st.divider()
    with st.expander("🍅 Pomodoro (25min)"):
        col_p1, col_p2 = st.columns(2)
        iniciar = col_p1.button("▶️ Start")
        detener = col_p2.button("⏹️ Stop")
        reloj = st.empty()
        if 'pomodoro_activo' not in st.session_state:
            st.session_state.pomodoro_activo = False
            st.session_state.tiempo_fin = None
        if iniciar:
            st.session_state.pomodoro_activo = True
            st.session_state.tiempo_fin = datetime.now() + timedelta(minutes=25)
        if detener:
            st.session_state.pomodoro_activo = False
            st.session_state.tiempo_fin = None
            reloj.info("Pausado.")
        if st.session_state.pomodoro_activo and st.session_state.tiempo_fin:
            ahora = datetime.now()
            restante = st.session_state.tiempo_fin - ahora
            if restante.total_seconds() > 0:
                mins, secs = divmod(int(restante.total_seconds()), 60)
                reloj.metric("Tiempo", f"{mins:02d}:{secs:02d}")
                time.sleep(1)
                st.rerun()
            else:
                st.session_state.pomodoro_activo = False
                st.balloons()
                reloj.success("¡Descanso!")

    st.divider()
    st.subheader("🚨 Radar")
    examenes = buscar_examenes_proximos(mapa_asignaturas)
    if examenes:
        for ex in examenes: st.markdown(f'<div class="alerta-examen">📅 {ex}</div>', unsafe_allow_html=True)
    else: st.caption("Sin exámenes próximos.")

    st.divider()
    st.subheader("📝 Nuevo Registro")
    
    # --- PESTAÑAS DE REGISTRO ---
    tab_clase, tab_ejer, tab_manual, tab_examen = st.tabs(["🎓 Clase", "💪 Ejer", "✍️ Manual", "📅 Examen"])
    
    with tab_clase:
        with st.form("form_clase", clear_on_submit=True):
            cat_nombre = st.selectbox("Asignatura", list(TAGS_SHORTCUTS.keys()))
            col_d1, col_d2, col_d3 = st.columns([2, 1, 1])
            fecha = col_d1.date_input("Fecha", datetime.now())
            horas = col_d2.number_input("Horas", min_value=0, max_value=10, value=1)
            minutos = col_d3.number_input("Min", min_value=0, max_value=59, step=5, value=0)
            link = st.text_input("🔗 Link")
            notas = st.text_area("Notas", height=70)
            
            if st.form_submit_button("Añadir Clase"):
                f_str = fecha.strftime("%d/%m")
                dur_str = ""
                if horas > 0 and minutos > 0: dur_str = f"{horas}h {minutos}m"
                elif horas > 0: dur_str = f"{horas}h"
                else: dur_str = f"{minutos} min"
                txt = f"clase del {f_str} ({dur_str})"
                if link: txt += f" - [enlace]({link})"
                if notas: txt += f" - {notas}"
                tag = TAGS_SHORTCUTS[cat_nombre]
                guardar_inbox(tag, txt)
                st.toast("✅ Guardado. Sincronizando...")
                ejecutar_sync()
                time.sleep(0.5) 
                st.rerun()

    with tab_ejer:
        with st.form("form_ejer", clear_on_submit=True):
            asig_ejer_list = [k for k in TAGS_SHORTCUTS.keys() if k != "General / Otros"]
            asig_ejer = st.selectbox("Asignatura", asig_ejer_list, key="sel_ejer")
            desc_ejer = st.text_input("Ejercicio / Práctica")
            link_ejer = st.text_input("Enlace (opcional)")
            
            if st.form_submit_button("Guardar Ejercicio"):
                txt_final = f"[ ] {desc_ejer}"
                if link_ejer: txt_final += f" ([ver]({link_ejer}))"
                if guardar_seccion_directa(asig_ejer, txt_final, "Ejercicios"):
                    st.toast(f"💪 Ejercicio guardado en {asig_ejer}")
                    time.sleep(0.5)
                    st.rerun()
                else: st.error("Error guardando.")

    with tab_manual:
        with st.form("form_manual", clear_on_submit=True):
            cat = st.selectbox("Tag", list(TAGS_SHORTCUTS.keys()), key="man")
            txt = st.text_area("Tarea", height=100)
            if st.form_submit_button("Guardar"):
                if txt:
                    tag = TAGS_SHORTCUTS[cat]
                    guardar_inbox(tag, txt)
                    st.toast("✅ Guardado.")
                    ejecutar_sync()
                    time.sleep(0.5)
                    st.rerun()

    with tab_examen:
        with st.form("form_examen", clear_on_submit=True):
            asignaturas_examen = [k for k in TAGS_SHORTCUTS.keys() if k != "General / Otros"]
            asig_ex = st.selectbox("Asignatura", asignaturas_examen, key="sel_ex")
            c_ex1, c_ex2 = st.columns(2)
            fecha_ex = c_ex1.date_input("Fecha Examen", datetime.now() + timedelta(days=7))
            tipo_ex = c_ex2.selectbox("Tipo", ["Examen", "Entrega", "Práctica"])
            desc_ex = st.text_input("Detalles")
            if st.form_submit_button("Guardar Fecha"):
                f_str = fecha_ex.strftime("%d/%m")
                texto_final = f"**{tipo_ex}**: {desc_ex} — {f_str}"
                if guardar_seccion_directa(asig_ex, texto_final, "Evaluación"):
                    st.toast(f"📅 Fecha guardada en {asig_ex}")
                    time.sleep(0.5)
                    st.rerun()
                else: st.error("Error: No encuentro el archivo.")
    
    st.divider()
    c1, c2 = st.columns(2)
    if c1.button("📂 Carpeta"): abrir_carpeta_local()
    if c2.button("🔄 Sync"): 
        with st.spinner("."): ejecutar_sync()
        st.success("OK")

# --- TÍTULO ---
st.title("🎓 Sandro López Díaz")

if modo_vista == "🏠 Vista General":
    txt_dash = DASHBOARD_FILE.read_text(encoding="utf-8", errors="ignore") if DASHBOARD_FILE.exists() else ""
    
    inbox = []
    cap = False
    for l in txt_dash.splitlines():
        if "## 00 Clases" in l: cap = True
        elif "## 01" in l: cap = False
        if cap and re.search(r'-\s*\[\s*\]', l): inbox.append(l)
    
    # 1. CONTAR INBOX (Validando que no sean fantasmas)
    count_inbox = contar_items_validos(inbox)
    
    count_tasks = 0
    
    # 2. CONTAR SOLO CLASES (Validando que no sean fantasmas)
    for nom in nombres_asignaturas:
        d = mapa_asignaturas[nom]
        det = leer_archivo_detalle(d['archivo'])
        if det: 
            count_tasks += contar_items_validos(det["Pendientes"])
    
    total_real = count_inbox + count_tasks
    
    c1, c2, c3 = st.columns(3)
    c1.metric("Clases Pendientes", total_real, delta="Teoría / Inbox")
    c2.metric("Asignaturas", len(nombres_asignaturas))
    c3.metric("Modo", "DAM")
    
    st.markdown("---")
    st.subheader("📥 Bandeja de Entrada")
    if inbox:
        for t in inbox: 
            clean_t = re.sub(r'-\s*\[\s*\]', '', t).strip()
            # Solo mostrar si tiene texto (ignorar fantasmas visualmente también)
            if clean_t: st.warning(clean_t)
    else: st.success("Bandeja vacía.")
    st.markdown("---")
    st.subheader("📊 Progreso")
    cols = st.columns(2)
    for i, nom in enumerate(nombres_asignaturas):
        d = mapa_asignaturas[nom]
        det = leer_archivo_detalle(d['archivo'])
        
        # CONTAMOS CON FILTRO ANTI-FANTASMA
        pends = contar_items_validos(det["Pendientes"])
        pends_ejer = contar_items_validos(det["Ejercicios"])
        
        emoji = "🔥" if pends > 2 else ("⚠️" if pends > 0 else "✅")
        
        with cols[i%2]:
            with st.container(border=True):
                st.markdown(f"**{nom}**")
                
                c_card1, c_card2 = st.columns(2)
                c_card1.write(f"{emoji} **{pends}** Clases")
                if pends_ejer > 0:
                    c_card2.write(f"🏋️ **{pends_ejer}** Ejer.")
                else:
                    c_card2.caption("_Sin Ejer._")
                
                # Barra de progreso
                st.progress(min(pends/10.0, 1.0))

else:
    if asignatura_activa:
        inf = mapa_asignaturas[asignatura_activa]
        st.header(f"📂 {inf['nombre_clean']}")
        dat = leer_archivo_detalle(inf['archivo'])
        if dat:
            t1, t2, t5, t3, t4 = st.tabs(["📝 Pendientes", "💊 Píldoras", "💪 Ejercicios", "📅 Evaluación", "✅ Historial"])
            
            with t1:
                # Filtrar fantasmas para la lista visual también
                lst = [t for t in dat["Pendientes"] if re.search(r'-\s*\[\s*\]', t) and re.sub(r'-\s*\[\s*\]', '', t).strip()]
                
                if not lst:
                    st.balloons()
                    st.info("¡Limpio!")
                else:
                    for i, t in enumerate(lst):
                        c1, c2 = st.columns([0.85, 0.15])
                        texto_puro = re.sub(r'-\s*\[\s*\]', '', t)
                        texto_puro = texto_puro.replace("⬜", "").strip()
                        c1.write(f"⬜ {texto_puro}")
                        if c2.button("Hecho", key=f"b_{i}"):
                            if marcar_tarea_dashboard(t):
                                st.toast("¡Bien hecho!")
                                ejecutar_sync()
                                time.sleep(0.5)
                                st.rerun()
                        with st.expander(f"✏️ Editar / Anotar"):
                            texto_edit = st.text_input("Modificar:", value=texto_puro, key=f"txt_{i}")
                            if st.button("💾 Guardar Cambios", key=f"sav_{i}"):
                                if editar_tarea_dashboard(t, texto_edit):
                                    st.toast("Actualizado.")
                                    ejecutar_sync()
                                    time.sleep(0.5)
                                    st.rerun()
            with t2: st.markdown("\n".join(dat["Píldoras"]) or "_Vacío_")
            
            with t5:
                # Filtrar fantasmas en ejercicios
                content_ejer = [e for e in dat["Ejercicios"] if not (re.search(r'-\s*\[\s*\]', e) and not re.sub(r'-\s*\[\s*\]', '', e).strip())]
                
                if not content_ejer: st.info("No hay ejercicios.")
                else:
                    for i, linea in enumerate(content_ejer):
                        if "- [ ]" in linea:
                            c_e1, c_e2 = st.columns([0.85, 0.15])
                            txt_e = linea.replace("- [ ]", "").strip()
                            # Extra check de seguridad
                            if txt_e:
                                c_e1.write(f"🏋️ {txt_e}")
                                if c_e2.button("Hecho", key=f"btn_ejer_{i}"):
                                    if marcar_ejercicio_hecho(inf['archivo'], linea):
                                        st.toast("¡Ejercicio Completado!")
                                        time.sleep(0.5)
                                        st.rerun()
                        elif "- [x]" in linea:
                            st.caption(f"✅ ~~{linea.replace('- [x]', '').strip()}~~")
                        else: st.markdown(linea)

            with t3: 
                content_eval = "\n".join(dat["Evaluación"])
                if not content_eval: st.info("No hay fechas. Añade una desde el menú lateral '📅 Examen'.")
                else: st.markdown(content_eval)
            with t4: st.code("\n".join(dat["Hechas"]) or "_Vacío_", language="markdown")