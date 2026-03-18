# 🍎 Guía DAM Organizer: Acceso Permanente (iPad Pro + NAS)

¡Buenas noticias! Tu organizador ahora puede vivir permanentemente en tu **NAS Synology**, lo que significa que puedes acceder desde tu iPad Pro **sin necesidad de encender el ordenador**.

## 1. Conexión Permanente 🔌
Tu NAS actúa como el servidor 24/7. Para conectar tu iPad Pro:

1.  Asegúrate de tener **Tailscale** activo en el iPad (esto te permite usarlo incluso fuera de casa).
2.  Abre **Safari** en tu iPad Pro.
3.  Escribe la **IP de Tailscale** de tu NAS seguida del puerto `5173`.
    *   Ejemplo: `http://100.X.Y.Z:5173`
    *   *(La IP de Tailscale la ves en la app de Tailscale de tu móvil o PC).*

## 2. Convertirlo en App ✨ (Recomendado)
Para que se sienta como una app nativa y ocupe toda la pantalla:
1.  Abre **Safari** en tu iPad Pro.
2.  Escribe la dirección que anotaste (ejemplo: `http://192.168.1.35:5173`).
3.  ¡Ya deberías ver tu panel de control!

## 3. Convertirlo en App (Recomendado) ✨
Para aprovechar toda la pantalla del iPad Pro y que no parezca una web:

1.  En Safari, pulsa el botón **Compartir** (el cuadrado con la flecha hacia arriba ⬆️).
2.  Baja por el menú y selecciona **"Añadir a la pantalla de inicio"**.
3.  Dale a **"Añadir"**.
4.  Cierra Safari. Ahora tienes un icono de **DAM Organizer** en tu iPad. Al abrirlo, se verá a pantalla completa, sin barras de navegación.

## 💡 Tips para iPad Pro
- **Pencil**: La interfaz está optimizada para toques, por lo que el Apple Pencil funciona de maravilla para marcar tareas.
- **Split View**: Puedes usarlo en pantalla dividida junto con tus apuntes o PDFs de clase.
- **Multitasking**: Al ser una PWA (Progressive Web App), el iPad la gestiona de forma fluida.

---
> [!IMPORTANT]
> Recuerda que tu PC debe estar encendido y con el `FULL_LAUNCH.bat` abierto para que el iPad pueda conectar.
