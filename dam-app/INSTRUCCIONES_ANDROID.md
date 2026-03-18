# 📱 Guía DAM Organizer: Modo Tablet (Android/Xiaomi)

Para usar DAM Organizer en una tablet (Android, iPad) o en el móvil mientras el servidor corre en tu PC, sigue estos pasos:

## 1. El Concepto "Servidor-Cliente" 🖥️ ↔️ 📱
La aplicación no se instala en la tablet directamente a través de un archivo `.bat`. 
*   **Tu PC** actúa como el "Generador" (Servidor). Debe estar encendido y con la app ejecutándose.
*   **Tu Tablet** actúa como la "Pantalla" (Cliente). Se conecta a tu PC a través de la red WiFi de tu casa.

## 2. Preparar el PC (Windows)
1.  Asegúrate de que la tablet y el PC estén conectados a la **misma red WiFi**.
2.  Ejecuta **`FULL_LAUNCH.bat`** en tu PC.
3.  Fíjate en la consola de comandos. Ahora aparecerá una línea que dice:
    `[INFO] Dirección para Tablet: http://192.168.1.XX:5173`
    *(Anota ese número, será algo como 192.168.1.35)*

## 3. Conectar la Tablet (Android/Xiaomi)
1.  Abre el navegador (Chrome recomendado) en tu tablet.
2.  Escribe la dirección que anotaste (ejemplo: `http://192.168.1.35:5173`).
3.  ¡Deberías ver la interfaz de DAM Organizer!

## 4. Instalar como App Nativa (PWA) 🚀
Para que no parezca que estás en una web y se sienta como una app real:
1.  En el navegador de la tablet (Chrome), toca los **3 puntos vertical** (menú).
2.  Busca la opción **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.
3.  Confirma la instalación.
4.  Ahora tendrás un icono de **DAM Organizer** en tu escritorio de la tablet que se abre a pantalla completa, sin barras de navegación.

---

## 🛠️ Solución de Problemas (Si no conecta)
*   **Firewall**: El firewall de Windows a veces bloquea la conexión. Si no carga en la tablet, prueba a desactivar temporalmente el firewall de red privada o permitir el tráfico en los puertos `3015` y `5173`.
*   **Red**: Asegúrate de que tu WiFi no sea "Red de Invitados", ya que estas redes suelen impedir que los dispositivos se hablen entre sí.

---
*SISTEMA DAM v4.5 - OPTIMIZADO PARA TABLETS XIAOMI* 🦾
