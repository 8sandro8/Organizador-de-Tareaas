import { Cpu } from 'lucide-react'

/**
 * NotificationStack - Componente visual para mostrar notificaciones toast
 * Extraído de Dashboard.jsx para mejorar modularidad
 */
function NotificationStack({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`cyber-notification min-w-[300px] p-4 rounded-xl border-l-4 backdrop-blur-xl shadow-2xl relative overflow-hidden ${
            n.type === 'gold'
              ? 'bg-yellow-500/10 border-yellow-500 shadow-yellow-500/10'
              : n.type === 'green'
                ? 'bg-neon-green/10 border-neon-green shadow-neon-green/10'
                : 'bg-neon-blue/10 border-neon-blue shadow-neon-blue/10'
          }`}
        >
          <div className="absolute top-0 right-0 p-1 opacity-20">
            <Cpu className="w-8 h-8 rotate-12" />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
            {n.title}
          </h4>
          <p className="text-xs font-bold text-white tracking-tight">{n.message}</p>
          <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-[scanline_4s_linear_infinite]"></div>
        </div>
      ))}
    </div>
  )
}

export default NotificationStack
