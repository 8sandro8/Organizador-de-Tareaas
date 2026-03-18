# 🚀 DAM APP - Estado del Proyecto (Actualizado 08 Mar 2026) -> v5.1 PRODUCTION BUILD & CYBER-RINGS ⭕⚡

El sistema ha sido elevado a la versión **v4.5** para garantizar una supervivencia total nativa contra la arquitectura de Synology (Linux ARM64). Se han resuelto todas las colisiones de puertos y purgado los crash loops causados por las diferencias de dependencias entre Windows y el NAS.

## 🚨 ESTADO ACTUAL Y SIGUIENTES PASOS (A partir de la Noche del 05 Mar):

¡Hemos encontrado y exterminado el Crash Loop de PM2 en el NAS (Node.js 22)! 
Al ver tus logs, el error fue `PathError [TypeError]: Missing parameter name at index 1: *`. El problema venía del Kernel de Express v5.x. En esta nueva versión, la ruta wildcard `app.get('*')` que usábamos para servir el Frontend (React) rompe el servidor al instante porque la librería interna `path-to-regexp` cambió sus reglas.

**🛠️ Correcciones implementadas en el código:**
1. **Rutas Express 5 Fix:** Se ha cambiado la sintaxis que fallaba por el middleware global `app.use()` en el servidor de **Sandro**, sirviendo correctamente el `index.html`.
2. **App Pareja Fix Crítico:** Se ha descubierto que tu instancia **Pareja** NO TENÍA el código de Express para servir el Frontend compilado. Esto hubiese causado que cargara en blanco. Se ha añadido la ruta de estáticos SPA en su `index.js`.
3. **Crash Loggers Inyectados:** He añadido al código global de Express un manejador de excepciones para que, si pasa algo similar, PM2 no muera en silencio y escriba en `pm2_crash.log`.

**👉 ACCIÓN INICIAL PARA TU REGRESO (Mañana):**
Todo el código está sincronizado y los problemas mortales parcheados. Vuelve a lanzar el script de reparación estrella en la consola SSH, que recompilará el código y aplicará las nuevas rutas nativas:

```bash
bash "/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE/dam-app/REPAIR_V61.sh"
```

Si todo va bien, estas URLs ahora sí cargarán el frontend instantáneamente en la nube:
*   **Tu Instancia:** `http://minube.tail30f4e5.ts.net:3015`
*   **La de tu Pareja:** `http://minube.tail30f4e5.ts.net:3016`

---


## ⚙️ Arquitectura General y Tecnologías (Kernel v6.2 ULTRA)
El sistema funciona bajo una **arquitectura dual desacoplada** (Frontend + Backend en repositorios / carpetas separadas) que se despliega replicada en **dos instancias independientes** (Sandro y Pareja). Cada instancia es completamente auto-contenida pero corre en el mismo servidor.

### 1. Frontend (Interfaz Visual React)
*   **Código Fuente**: Ubicado en la carpeta `client/` de cada instancia.
*   **Tecnologías**: React + Tailwind CSS + Lucide-React.
*   **Embalaje (Vite)**: Anteriormente servíamos el frontend en *Development Mode* usando Vite, lo que causaba problemas de lentitud y conexión por red (`This host is not allowed`). 
*   **Estado Actual (Build de Producción)**: 
    Actualmente **NO se ejecuta Vite** en los procesos finales. El script de despliegue (`REPAIR_V61.sh`) ejecuta `npm run build` dentro de `client/`. Esto transfiere y minifica todo el código React en archivos estáticos `HTML/JS/CSS` ubicados dentro de la carpeta oculta `client/dist`.

### 2. Backend (API & Servidor Express)
*   **Código Fuente**: Ubicado en la carpeta `server/` de cada instancia.
*   **Kernel Web**: Se utiliza **Node.js + Express** (puertos `3015` Sandro y `3016` Pareja).
*   **Funciones del Express Server**:
    1.  **Gateway API**: Gestiona las peticiones REST a `/api/*` (ej: `/api/tasks`, `/api/subjects`).
    2.  **Servidor SPA (Front)**: Todo lo que NO ES `/api/*` lo redirige mediante el middleware estático de Express hacia una ruta Catch-All que apunta directamente a `../client/dist/index.html`. Es por esto que ya no hace falta iniciar Vite.
*   **Consumo de API Relativa**: Todos los `fetch` en el código de React (ej: `Header.jsx`) se hacen sin dominio usando rutas relativas como `api.get('/reports/weekly')`. Esto previene que se queden cacheados hacia *localhost*.

### 3. Base de Datos (Prisma + SQLite)
*   **Archivo Local**: Cada instancia tiene su propio archivo de datos `dev.db` guardado en la ruta (`server/prisma/dev.db`).
*   **Prisma ORM**: Transforma el modelo teórico (`schema.prisma`) a consultas SQL nativas.
    *   *Advertencia NAS ARM64*: Prisma a veces no compila correctamente en los procesadores ARM de Synology. Por eso es vital tener definido en `schema.prisma` los configuradores de binarios como `linux-arm64-openssl-3.0.x`.
*   **Auto-Migración (`db:push`)**: El despliegue inyectará obligatoriamente una subida del esquema (`npm run db:push`). Para asegurar que nunca falla, el script inyecta un `export DATABASE_URL` de antemano evitando errores `P1012`.

### 4. Gestión de Procesos y Redes (DevOps)
*   **PM2**: Es el orquestador principal. En lugar de tener cuatro consolas encendidas, PM2 gestiona en background los dos motores `index.js`. Puedes ver su estado real tecleando `pm2 status`.
*   **Tailscale**: Ambos backends se exponen directamente por VPN sin configuración de puertos de router. Al acceder a la Magic IP de Tailscale más el puerto (`3015` o `3016`), el propio Express sirve tanto en el Frontend encapsulado como la API.

## 🛡️ Sistema de Copias de Seguridad (Backups)
Se ha implementado un nuevo script `CREATE_BACKUP.sh` en la raíz del proyecto para crear puntos de restauración preventivos.
*   **Comando**: `bash "/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE/dam-app/CREATE_BACKUP.sh"`
*   **Funcionamiento**: Genera un archivo `.tar.gz` dentro de la carpeta `backups/`, comprimiendo todo el código y la base de datos de manera limpia y ligera (excluyendo todas las pesadas carpetas `node_modules`). ¡Muy recomendable usarlo antes de hacer pruebas!

## 🌐 URLs de Acceso y Redes (VPN: Tailscale)
Se accede internamente por la subred mágica de Tailscale hacia el Synology NAS en IPs estilo `100.x.x.x`.
*   **Instancia Principal (Sandro)**: 
    *   Frontend UI + API Backend: `http://minube.tail30f4e5.ts.net:3015`
*   **Instancia Secundaria (Pareja)**: 
    *   Frontend UI + API Backend: `http://minube.tail30f4e5.ts.net:3016`

---

## 🔥 Novedades y Correcciones Recientes (v5.0 PRODUCTION/v6.2 ULTRA)
1. **Frontend en Modo Producción**: La UI ahora se compila estáticamente y se sirve a gran velocidad usando Express, eliminando por completo la ralentidad de Vite Dev Mode en red. Ambos servicios corren ahora bajo un único puerto local.
2. **[CRÍTICO] Bugfix Prisma `.env` P1012**:
   - Resuelto el fallo mortal en la instancia de la *Pareja* donde el orquestador fallaba durante el `db:push` al no detectar el `DATABASE_URL`. El problema de raíz era el arrastre de una codificación incompatible e invisible (saltos de línea y BOM) desde Windows a través del Synology Drive. **Ambos `.env` (Sandro y Pareja) han sido reformateados a Unix/Linux puro (`LF`)**.
3. **Auto-Heal Arquitectónico (`REPAIR_V61.sh`) Mejorado**:
   - El script que reinstala el proyecto ahora forzará la eliminación de hilos muertos en PM2 (`pm2 delete all`, `fuser -k`).
   - Usa la fuerza bruta instalando paquetes (`npm install --force`) para sobreescribir dependencias oxidadas o trabadas desde la subida de Synology Drive.
   - Ejecuta obligatoriamente NPM puro (`npm run generate` y `npm run db:push`) para saltarse bugs de `npx` desfasados.
4. **Auto-Migración de Base de Datos DB:PUSH**:
   - El script forzará ahora cada vez que se inicie que el archivo de SQLite se acople automáticamente al esquema Prisma (ej: con la columna `completionNote`).
7. **Bugfix Port Conflicts (Variables de Entorno)**:
   - Resuelta la colisión mortal originada por fallos al leer los ficheros `.env`. Ahora Express impone sus puertos de emergencia (`3015` local y `3016` pareja).

---

## 🔥 [NUEVO] Novedades v5.1 (08 Mar 2026)
1. **Frontend Reportes Semanales Fix**: El botón `Header.jsx` del frontend que descarga el trofeo (Reporte Semanal) estaba usando la URL `http://localhost:3015` de forma programada a fuego ("hardcoded"). Esto rompía la aplicación en el móvil y en la instancia de la pareja. Ahora usa URLs dinámicas correctas del backend.
2. **Crash `P1012` Pareja Database Fix**: El script maestro `REPAIR_V61.sh` fallaba con `Environment variable not found: DATABASE_URL` en el proceso de la pareja. Se ha inyectado el `export DATABASE_URL` temporal dentro del shell script para asegurar que su base de datos se migre correctamente.