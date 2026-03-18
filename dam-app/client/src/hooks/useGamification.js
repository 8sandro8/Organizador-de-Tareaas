import { useState, useEffect, useCallback } from 'react'

/**
 * useGamification - Hook para gestionar el sistema de gamificación
 * Maneja: XP, nivel, racha, persistencia en localStorage
 */
function useGamification(playSound) {
  const [gamification, setGamification] = useState(() => {
    try {
      const saved = localStorage.getItem('dam_gamification')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.level === 'number' && typeof parsed.xp === 'number') {
          return parsed
        }
      }
    } catch (e) {
      console.error('Critical: Error parsing gamification state', e)
    }
    return { level: 1, xp: 0, streak: 0, lastDate: null }
  })

  // Persistir estado en localStorage
  useEffect(() => {
    localStorage.setItem('dam_gamification', JSON.stringify(gamification))
  }, [gamification])

  // Añadir XP y manejar level up
  const addXP = useCallback((amount) => {
    setGamification(prev => {
      const newXP = prev.xp + amount
      const xpToNextLevel = prev.level * 1000
      if (newXP >= xpToNextLevel) {
        // Level up!
        if (playSound) playSound('success')
        return { 
          ...prev, 
          level: prev.level + 1, 
          xp: newXP - xpToNextLevel 
        }
      }
      return { ...prev, xp: newXP }
    })
  }, [playSound])

  // Actualizar racha de días consecutivos
  const updateStreak = useCallback(() => {
    const today = new Date().toLocaleDateString()
    setGamification(prev => {
      if (prev.lastDate === today) return prev
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const isConsecutive = prev.lastDate === yesterday.toLocaleDateString()
      
      return {
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastDate: today
      }
    })
  }, [])

  // Resetear gamificación (para logout)
  const resetGamification = useCallback(() => {
    setGamification({ level: 1, xp: 0, streak: 0, lastDate: null })
    localStorage.removeItem('dam_gamification')
  }, [])

  return {
    gamification,
    addXP,
    updateStreak,
    resetGamification
  }
}

export default useGamification
