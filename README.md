# 🚀 Organizador de Tareas (DAM App)

> Sistema full-stack para gestión académica de tareas, desarrollado como proyecto del ciclo formativo de Desarrollo de Aplicaciones Multiplataforma (DAM).  
> Arquitectura dual (frontend React + backend Node/Express) desplegada en NAS Synology DS723+ mediante PM2 y Tailscale.

---

## 📋 Estado Actual

- **Versión**: v5.1 PRODUCTION BUILD & CYBER-RINGS ⭕⚡ (actualizado 08 Mar 2026)
- **Entorno**: NAS Synology DS723+ (ARM64 Linux)
- **Tecnologías**:
  - **Frontend**: React 18 + Vite (modo producción) + Tailwind CSS + Lucide React
  - **Backend**: Node.js + Express (puertos 3015/3016) + Prisma ORM + SQLite
  - **DevOps**: PM2 (gestión de procesos), Tailscale (VPN segura), scripts de despliegue automático
  - **Base de datos**: Archivo SQLite independiente por instancia (`server/prisma/dev.db`)

---

## 🏗️ Arquitectura

```bash
Organizador de Tareas/
├── dam-app/                     # Código principal (dual instancia: Sandro & Pareja)
│   ├── client/                  # Código fuente React (Vite)
│   │   ├── src/                 # Componentes, hooks, estilos, servicios
│   │   ├── dist/                # Build de producción (generado por npm run build)
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── server/                  # Código fuente Node/Express
│   │   ├── index.js             # Express + rutas API + middleware estático SPA
│   │   ├── prisma/              # Esquema Prisma, migraciones, dev.db
│   │   ├── package.json
│   │   └── scripts/             # Utilidades (backup, dump, sincronización MD)
│   ├── tools/                   # Scripts de despliegue y mantenimiento
│   │   ├── REPAIR_V61.sh        # Script maestro de auto-reparación y despliegue
│   │   ├── CREATE_BACKUP.sh     # Copias de seguridad (excluye node_modules)
│   │   ├── FULL_LAUNCH.sh/.bat  # Lanzamiento completo (backend + frontend)
│   │   ├── RESET_DATABASE.sh/.bat
│   │   └── RESTART_NAS.sh/.bat
│   └── backups/                 # Archivos .tar.gz generados por CREATE_BACKUP.sh
├── Z_ARCHIVE_LEGACY/            # Versiones antiguas y scripts de respaldo
├── MI_PAREJA/                   # Duplicado completo para la instancia de pareja
├── backups/                     # Copias de seguridad globales del proyecto
├── tasks.json                   # Estado rápido de tareas pendientes (sincronizado)
├── DAM-Dashboard.md             # Vista resumen de tareas pendientes por asignatura
└── RETOMAR_PROYECTO.md          # Guía detallada de despliegue y solución de problemas
```

### Flujo de trabajo

1. **Desarrollo**: Edición en `client/src` y `server/`.
2. **Build**: `npm run build` dentro de `client/` genera archivos estáticos en `client/dist/`.
3. **Despliegue**: El script `REPAIR_V61.sh` (o `FULL_LAUNCH.sh`):
   - Limpia procesos PM2 muertos.
   - Fuerza reinstalación de dependencias (`npm install --force`).
   - Ejecuta `npm run generate` (Prisma) y `npm run db:push` (migraciones).
   - Construye el frontend (`npm run build`).
   - Inicia los servicios backend mediante PM2 (puertos 3015 y 3016).
4. **Acceso**:
   - **Instancia Sandro**: `http://minube.tail30f4e5.ts.net:3015`
   - **Instancia Pareja**: `http://minube.tail30f4e5.ts.net:3016`
   (Tailscale provee la red VPN segura; el dominio `*.ts.net` es la Magic DNS de Tailscale).

---

## 🛠️ Características Destacadas

- **Modo Producción puro**: El frontend se sirve como archivos estáticos mediante Express, eliminando la sobrecarga y problemas de conexión de Vite Dev Mode en red.
- **Arquitectura desacoplada**: Frontend y backend son carpetas independientes, lo que permite desplegar cada instancia de forma aislada pero en el mismo NAS.
- **Manejo robusto de errores**: Middleware global de Express captura excepciones y las escribe en `pm2_crash.log` para evitar crash loops silenciosos.
- **Sincronización de Prisma**: Los scripts aseguran que el archivo SQLite se migra automáticamente al esquema (`db:push`) antes de levantar el servidor.
- **Variables de entorno**: Los archivos `.env` fueron normalizados a finales de línea Unix (LF) para evitar el error `P1012` de Prisma en la instancia de pareja.
- **Informes semanales**: El componente `Header.jsx` genera y descarga reportes de actividad mediante URLs dinámicas al backend.
- **Copias de seguridad**: `CREATE_BACKUP.sh` empaqueta código y base de datos en `.tar.gz` ligero, ideal para restauración rápida.

---

## 🚦 Próximos Pasos / Mejoras

- [ ] Integrar autenticación JWT para acceso seguro fuera de Tailscale.
- [ ] Añadir pruebas unitarias y de integración (Jest + Supertest).
- [ ] Implementar CI/CD básico con GitHub Actions para build y test automáticos.
- [ ] Mejorar la UI con temas oscuros y accesibilidad (WCAG).
- [ ] Exportar/importar tareas en formatos CSV o JSON.
- [ ] Documentar la API con Swagger/OpenAPI.
- [ ] Migrar a una base de datos PostgreSQL para mayor escalabilidad (opcional).

---

## 📚 Recursos y Guías

- **Guía de despliegue y solución de problemas**: [`RETOMAR_PROYECTO.md`](./dam-app/RETOMAR_PROYECTO.md)
- **Dashboard de tareas pendientes**: [`DAM-Dashboard.md`](./DAM-Dashboard.md)
- **Guía de primeros pasos (cliente)**: [`dam-app/GUIA_PRIMEROS_PASOS.md`](./dam-app/GUIA_PRIMEROS_PASOS.md)
- **Guía para iPad**: [`dam-app/GUIA_IPAD.md`](./dam-app/GUIA_IPAD.md)
- **Instrucciones Android**: [`dam-app/INSTRUCCIONES_ANDROID.md`](./dam-app/INSTRUCCIONES_ANDROID.md)
- **Guía para pareja (español)**: [`MI_PAREJA/GUIA_PAREJA.md`](./MI_PAREJA/GUIA_PAREJA.md)

---

## 👨‍💻 Créditos

Desarrollado por **Sandro** como proyecto personal y académico.  
Inspirado en la necesidad de una herramienta ligera y centralizada para el seguimiento de tareas escolares, compatible con múltiples dispositivos (PC, tablet, móvil) y accesible desde casa mediante VPN privada.

> _“Lo importante no es cuánto sabes, sino lo que haces con lo que sabes.”_

---

*Última actualización: 18 Mar 2026*  
*Hecho con ❤️ y ☕ en el NAS Synology DS723+*
