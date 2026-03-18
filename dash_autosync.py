#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Autosync DAM (Versión Mejorada 3.0)
- Corrige bug de espacios en checkbox.
- Crea backup de seguridad antes de tocar nada.
- Mueve @NN/@alias desde Inbox a su asignatura.
- Vuelca PENDIENTES y HECHAS de cada sección a su .md.
- Genera reporte visual en terminal.
"""

import re
from pathlib import Path
from datetime import datetime
import unicodedata

base = Path(__file__).parent
dashboard = base / "DAM-Dashboard.md"

def read(p): return p.read_text(encoding="utf-8", errors="ignore")
def write(p, s): p.write_text(s, encoding="utf-8")

# ----------------- alias -----------------
ALIAS_TO_CODE = {
    "01": "01", "LM": "01", "LMSGI": "01", "LENGUAJES": "01",
    "02": "02", "DIGI": "02", "DIGITALIZACION": "02", "DIGITALIZACIONAPLICADA": "02",
    "03": "03", "ENTORNOS": "03", "ED": "03", "ENTORNOSDESARROLLO": "03",
    "04": "04", "ITINERARIO": "04", "IP": "04",
    "05": "05", "INGLES": "05", "EN": "05", "ENGLISH": "05",
    "06": "06", "SIS": "06", "SISTEMAS": "06", "SISTEMASINFORMATICOS": "06",
    "07": "07", "BBDD": "07", "BD": "07", "BASESDEDATOS": "07",
    "08": "08", "PROG": "08", "PROGRAMACION": "08", "PROGRAMING": "08"
}

def strip_accents(s: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))

SECT_MD_LINK = re.compile(r'^##\s+(.+?)\s+—\s+\[([^\]]+\.md)\]\(\./([^)]+\.md)\)\s*$')
TAG_ANY = re.compile(r'@([A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+)\b')

# --- MEJORA 1: REGEX FLEXIBLE (Acepta [ ] sin espacio o con muchos) ---
CHECKBOX = re.compile(r'^\s*-\s*\[\s*([xX]?)\s*\]\s+(.*)$')

def alias_to_code(token: str):
    key = strip_accents(token).upper()
    return ALIAS_TO_CODE.get(key)

def find_section_range(lines, header_startswith):
    start = None
    for i, ln in enumerate(lines):
        if ln.strip().startswith(header_startswith):
            start = i + 1
            break
    if start is None:
        return None
    j = start
    while j < len(lines) and not lines[j].startswith("## "):
        j += 1
    return (start, j)

def parse_subject_sections(lines):
    sections = []
    i = 0
    while i < len(lines):
        m = SECT_MD_LINK.match(lines[i])
        if m:
            sec_title, _linktext, filename = m.groups()
            if not sec_title.strip().startswith("00 "):
                start = i + 1
                j = start
                while j < len(lines) and not lines[j].startswith("## "):
                    j += 1
                sections.append((sec_title, filename, start, j))
                i = j
            else:
                j = i + 1
                while j < len(lines) and not lines[j].startswith("## "):
                    j += 1
                i = j
        else:
            i += 1
    return sections

def extract_tasks(block_lines):
    return [ln.rstrip() for ln in block_lines if ln.strip().startswith("- [")]

def split_tasks(tasks):
    pending, done = [], []
    for t in tasks:
        m = CHECKBOX.match(t)
        if not m:
            continue
        # m.group(1) es lo que hay dentro del corchete ('', ' ', 'x', 'X')
        state = m.group(1).lower()
        (done if state == 'x' else pending).append(t)
    return pending, done

def strip_tags_and_checkbox(task_line):
    t = TAG_ANY.sub('', task_line)
    m = CHECKBOX.match(t)
    if m: t = m.group(2)
    return t.strip()

def ensure_log_section(lines):
    L = lines[:]
    hdr = None
    for i, ln in enumerate(L):
        if ln.strip().lower().startswith("## hechas (log)"):
            hdr = i; break
    if hdr is None:
        if L and L[-1].strip() != "": L.append("")
        L += ["## Hechas (log)", ""]
        hdr = len(L) - 2
    j = hdr + 1
    while j < len(L) and not L[j].startswith("## "):
        j += 1
    return L, hdr, j

def append_done_to_log(subj_text, done_tasks):
    L = subj_text.splitlines()
    L, hdr, end = ensure_log_section(L)
    import re as _re
    existing_norm = set()
    for ln in L[hdr+1:end]:
        body = _re.sub(r'^\s*-\s*\d{4}-\d{2}-\d{2}\s+—\s+', '', ln).strip()
        existing_norm.add(_re.sub(r'\s+', ' ', body).lower())
    today = datetime.now().strftime("%Y-%m-%d")
    new_entries = []
    for t in done_tasks:
        body = strip_tags_and_checkbox(t)
        body_norm = _re.sub(r'\s+', ' ', body).lower()
        if body_norm in existing_norm: continue
        new_entries.append(f"- {today} — {body}")
        existing_norm.add(body_norm)
    if new_entries:
        L = L[:hdr+1] + new_entries + L[hdr+1:]
    return "\n".join(L)

def replace_pending_section(subj_text, pending_tasks):
    L = subj_text.splitlines()
    hdr = None
    for i, ln in enumerate(L):
        if ln.strip().lower().startswith("## clases pendientes"):
            hdr = i; break
    if hdr is None:
        head = ["## Clases pendientes"] + (pending_tasks or ["_Sin elementos pendientes detectados._"]) + [""]
        return ("\n".join([L[0]] + head + L[1:])) if L else "\n".join(head)
    j = hdr + 1
    while j < len(L) and not L[j].startswith("## "):
        j += 1
    body = pending_tasks or ["_Sin elementos pendientes detectados._"]
    newL = L[:hdr+1] + body + [""] + L[j:]
    return "\n".join(newL)

def move_tagged_from_inbox(lines):
    rng = find_section_range(lines, "## 00 Clases pendientes (general)")
    if not rng: return lines, False
    start, end = rng
    inbox = lines[start:end]
    tasks = extract_tasks(inbox)
    bucket, keep_inbox = {}, []
    for t in tasks:
        codes = []
        for m in TAG_ANY.finditer(t):
            token = strip_accents(m.group(1)).upper()
            code = ALIAS_TO_CODE.get(token)
            if code: codes.append(code)
        if codes:
            bucket.setdefault(codes[0], []).append(t)
        else:
            keep_inbox.append(t)
    changed = False
    if bucket:
        sections = parse_subject_sections(lines)
        idx = {title.split()[0]: (s, e) for (title, _f, s, e) in sections}
        for code, items in bucket.items():
            if code not in idx: continue
            s, e = idx[code]
            block = lines[s:e]
            existing_bodies = {strip_tags_and_checkbox(x) for x in extract_tasks(block)}
            for t in items:
                body = strip_tags_and_checkbox(t)
                if body not in existing_bodies:
                    # Insertamos siempre con espacio estándar [ ]
                    block.append(f"- [ ] {body}")
            if block and block[-1].strip() != "": block.append("")
            lines = lines[:s] + block + lines[e:]
            changed = True
            sections = parse_subject_sections(lines)
            idx = {title.split()[0]: (s, e) for (title, _f, s, e) in sections}
    new_inbox_block = keep_inbox[:] if keep_inbox else ["_Sin elementos pendientes detectados._"]
    if new_inbox_block and new_inbox_block[-1].strip() != "": new_inbox_block.append("")
    if inbox != new_inbox_block:
        lines = lines[:start] + new_inbox_block + lines[end:]
        changed = True
    return lines, changed

def update_counts(lines):
    sum_idx = next((i for i, ln in enumerate(lines) if ln.strip().startswith("- **Pendientes totales:**")), None)
    if sum_idx is None: return lines, False
    sections = parse_subject_sections(lines)
    total, counts = 0, {}
    for (title, _fn, s, e) in sections:
        c = len(extract_tasks(lines[s:e]))
        # Usamos solo la parte del titulo antes del link para el contador
        clean_title = title.split('—')[0].strip()
        if "]" in clean_title: clean_title = clean_title.split("]")[0].replace("[", "")
        
        counts[clean_title] = c
        total += c
    
    changed = False
    if lines[sum_idx] != f"- **Pendientes totales:** {total}":
        lines[sum_idx] = f"- **Pendientes totales:** {total}"; changed = True
    i = sum_idx + 1
    while i < len(lines) and lines[i].strip() != "": i += 1
    
    # Reconstruimos el bloque de contadores
    # Intentamos matchear el título limpio con el título original para preservar orden si se puede
    # Simplificación: listamos los keys de counts ordenados
    new_block = [f"- {k}: **{v}**" for k, v in sorted(counts.items())]
    
    if lines[sum_idx+1:i] != new_block:
        lines = lines[:sum_idx+1] + new_block + lines[i:]
        changed = True
    return lines, changed

def sync_subject_files_from_lines(lines):
    sections = parse_subject_sections(lines)
    for (title, filename, s, e) in sections:
        tasks = extract_tasks(lines[s:e])
        pending, done = split_tasks(tasks)
        subj_path = base / filename
        subj_text = read(subj_path) if subj_path.exists() else f"# {title}\n"
        if done: subj_text = append_done_to_log(subj_text, done)
        pending_clean = [f"- [ ] {strip_tags_and_checkbox(t)}" for t in pending]
        subj_text = replace_pending_section(subj_text, pending_clean)
        write(subj_path, subj_text)

def remove_done_from_dashboard(lines):
    L = lines[:]
    sections = parse_subject_sections(L)
    for (title, _fn, s, e) in sections:
        block = L[s:e]
        filtered = []
        for ln in block:
            m = CHECKBOX.match(ln.strip())
            if m and m.group(1).lower() == 'x': continue
            filtered.append(ln)
        if filtered != block:
            L = L[:s] + filtered + L[e:]
    return L

# --- MEJORA 3: REPORTE VISUAL ---
def print_report(lines):
    sections = parse_subject_sections(lines)
    print("\n" + "="*60)
    print(f" 📊 ESTADO ACTUAL DAM - {datetime.now().strftime('%H:%M')}")
    print("="*60)
    print(f" {'ASIGNATURA':<40} | {'PEND'}")
    print("-" * 60)
    
    total_pending = 0
    for (title, _fn, s, e) in sections:
        # Limpieza del título para la tabla (quitar enlaces MD)
        clean_title = title
        if "—" in clean_title: clean_title = clean_title.split("—")[0].strip()
        if "[" in clean_title: clean_title = clean_title.split("[")[0].strip()
        
        tasks = extract_tasks(lines[s:e])
        count = len(tasks)
        total_pending += count
        
        marker = "🔴" if count > 0 else "✅"
        # Truncamos si es muy largo para que la tabla no se rompa
        print(f" {marker} {clean_title[:38]:<38} | {count}")

    print("-" * 60)
    print(f" 🔥 TOTAL PENDIENTES: {total_pending}")
    print("="*60 + "\n")

def run():
    if not dashboard.exists():
        print(f"ERROR: No encuentro {dashboard}")
        return

    text = read(dashboard)
    
    # --- BACKUP ---
    backup_path = dashboard.with_suffix(".md.bak")
    write(backup_path, text)

    lines = text.splitlines()
    
    # 1) Inbox -> Asignatura
    lines, changed_inbox = move_tagged_from_inbox(lines)
    
    # 2) Sincronizar archivos individuales
    sync_subject_files_from_lines(lines)
    
    # 3) Limpiar completadas del dashboard
    lines = remove_done_from_dashboard(lines)
    
    # 4) Actualizar contadores
    lines, changed_counts = update_counts(lines)
    
    # --- MEJORA: LIMPIEZA DE LÍNEAS VACÍAS DOBLES ---
    # Esto evita que el archivo se llene de huecos blancos
    clean_lines = []
    last_empty = False
    for ln in lines:
        is_empty = (ln.strip() == "")
        if is_empty and last_empty:
            continue # Saltamos líneas vacías repetidas
        clean_lines.append(ln)
        last_empty = is_empty
    
    write(dashboard, "\n".join(clean_lines))
    
    # Imprimir reporte
    print_report(clean_lines)

if __name__ == "__main__":
    run()