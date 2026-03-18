import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'
import { DEFAULT_SUBJECTS } from '../config/constants'

/**
 * useDashboardData - Hook para gestionar la carga de datos del Dashboard
 * Maneja: subjects, tasks, loading, refreshing, fetchData, apiError
 */
function useDashboardData(userId, addLog) {
  const [subjects, setSubjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Fetch de datos del servidor
  const fetchData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    
    try {
      const [subjRes, taskRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/tasks')
      ])

      const fetchedSubjects = Array.isArray(subjRes.data) ? subjRes.data : []
      const fetchedTasks = Array.isArray(taskRes.data) ? taskRes.data : []

      setSubjects(fetchedSubjects.length > 0 ? fetchedSubjects : DEFAULT_SUBJECTS)
      setTasks(fetchedTasks)
      setApiError(null)
      
      if (addLog) {
        addLog('Sincronización_Kernel_Completa', 'system')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setApiError(error.message)
      if (addLog) {
        addLog('Error_de_Conexión', 'error')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [addLog])

  // Cargar datos al iniciar (solo si hay userId)
  useEffect(() => {
    if (userId) {
      fetchData(false)
    }
  }, [userId])

  // Calcular estabilidad del sistema
  const stability = Math.max(0, Math.min(100, 100 - (tasks.filter(t => t && !t.isCompleted).length * 5)))

  return {
    subjects,
    setSubjects,
    tasks,
    setTasks,
    loading,
    refreshing,
    apiError,
    stability,
    fetchData
  }
}

export default useDashboardData
