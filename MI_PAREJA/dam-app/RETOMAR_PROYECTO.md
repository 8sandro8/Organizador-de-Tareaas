# 🚀 DAM APP - Estado del Proyecto (Actualizado 08 Mar 2026) -> v5.1 NATIVE ARM64 & CYBER-RINGS ⭕⚡

El sistema ha sido elevado a la versión **v4.5** para garantizar una supervivencia total nativa contra la arquitectura de Synology (Linux ARM64). Se han resuelto todas las colisiones de puertos y purgado los crash loops causados por las diferencias de dependencias entre Windows y el NAS.

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

## 🌐 URLs de Acceso y Redes (VPN: Tailscale)
Se accede internamente por la subred mágica de Tailscale hacia el Synology NAS en IPs estilo `100.x.x.x`.
*   **Instancia Principal (Sandro)**: 
    *   Frontend UI + API Backend: `http://minube.tail30f4e5.ts.net:3015`
*   **Instancia Secundaria (Pareja)**: 
    *   Frontend UI + API Backend: `http://minube.tail30f4e5.ts.net:3016`

---

## 💎 Novedades y Correcciones Recientes (v4.5/v6.2 ULTRA)
1. **Auto-Heal Arquitectónico (`REPAIR_V61.sh`) Mejorado**:
   - El script que reinstala el proyecto ahora forzará la eliminación de hilos muertos en PM2 (`pm2 delete all`, `fuser -k`).
   - Usa la fuerza bruta instalando paquetes (`npm install --force`) para sobreescribir dependencias oxidadas o trabadas desde la subida de Synology Drive (como `rollup-linux-arm64-gnu`).
   - Ejecuta obligatoriamente NPM puro (`npm run generate` y `npm run db:push`) para saltarse bugs de `npx` desfasados.
2. **Auto-Migración de Base de Datos DB:PUSH**:
   - El backend principal y el de la pareja sufrían crash loops porque el esquema de la base de Datos incorporó una columna nueva en el código (`completionNote` en Tareas) pero el archivo de SQLite no se alteraba sólo. El script lo forzará ahora cada vez que se inicie.
3. **[NUEVO] Frontend Reportes Semanales Fix (v5.1)**: El front descargaba el reporte desde un `localhost` genérico en lugar del servidor actual. Ya se ha configurado al igual que el resto para usar el Proxy Nativo.
4. **[NUEVO] Crash `P1012` Pareja Database Fix (v5.1)**: El script de reparacion `REPAIR_V61.sh` crasheaba en esta instancia porque Prisma no veía la base de datos a empujar. Se le ha inyectado temporalmente su URL maestra en el script para no fallar jamás.
5. **Bugfix Port Conflicts (Variables de Entorno)**:
   - Resuelta la colisión mortal originada por fallos al leer los ficheros `.env`. Ahora Express impone sus puertos de emergencia (`3015` local y `3016` pareja).

---

## 🚨 ACCIÓN OBLIGATORIA (LEE ESTO NADA MÁS ENTRAR):
Dado que la sincronización de archivos arroja directamente los binarios compilados de Windows 64-bits que machacan y rompen a los del servidor Linux del NAS, **hay que recompilar e hidratar manualmente las Bases de Datos SIEMPRE**.

### Para arrancar o arreglar la app de una vez por todas, COPIA Y PEGA ESTE ÚNICO COMANDO en el SSH del NAS:

```bash
bash /volume1/homes/Sandro/GRADO\ SUPERIOR/PENDIENTE/dam-app/REPAIR_V61.sh
```

**Si este comando de arroja verde "TODO REINICIADO", significará que el Frontend transpiló su Rollup y el Backend empujó las Db al ORM sin morir. Abre las web de tu Tailscale y a gozar.** 🦾⚡
