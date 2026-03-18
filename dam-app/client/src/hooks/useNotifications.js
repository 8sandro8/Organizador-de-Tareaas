import { useState, useCallback } from 'react'

/**
 * useNotifications - Hook para gestionar logs y notificaciones toast
 */
function useNotifications(playSound) {
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), text: 'SISTEMA_INICIALIZADO', type: 'system' }
  ])
  const [notifications, setNotifications] = useState([])

  // Añadir log al sistema
  const addLog = useCallback((text, type = 'info') => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      text: text.toUpperCase().replace(/\s+/g, '_'),
      type
    }
    
    setLogs(prev => [newLog, ...prev].slice(0, 5))

    // Notificaciones automáticas para eventos especiales
    if (type === 'success') {
      setNotifications(prev => [...prev, { 
        id: Date.now(), 
        title: 'MISIÓN COMPLETA', 
        message: text.replace(/_/g, ' '), 
        type: 'green' 
      }])
      
      // Auto-remove después de 4 segundos
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.title !== 'MISIÓN COMPLETA'))
      }, 4000)
    } else if (text.includes('LEVEL_UP')) {
      setNotifications(prev => [...prev, { 
        id: Date.now(), 
        title: 'ASCENSO CYBER', 
        message: text.replace(/_/g, ' '), 
        type: 'gold' 
      }])
    }
  }, [])

  // Añadir notificación toast
  const addNotification = useCallback((title, message, type = 'blue') => {
    const id = Date.now()
    
    setNotifications(prev => [...prev, { id, title, message, type }])
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }, [])

  // Limpiar todas las notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Limpiar logs
  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return {
    logs,
    notifications,
    addLog,
    addNotification,
    clearNotifications,
    clearLogs
  }
}

export default useNotifications
