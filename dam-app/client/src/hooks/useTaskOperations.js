import { useState, useCallback } from 'react'
import api from '../services/api'

/**
 * useTaskOperations - Hook para gestionar operaciones CRUD de tareas
 * Maneja: addTask, updateTask, deleteTask, deleteTasks, toggleTask
 */
function useTaskOperations({ 
  tasks, 
  fetchData, 
  addLog, 
  addNotification, 
  addXP, 
  updateStreak,
  playSound,
  setTaskToComplete 
}) {
  const [isLoading, setIsLoading] = useState(false)

  // Crear nueva tarea
  const addTask = useCallback(async (taskData) => {
    setIsLoading(true)
    try {
      await api.get('/ping')
      await api.post('/tasks', taskData)
      addLog(`Nueva_Tarea_Registrada:_${taskData.title}`, 'success')
      await fetchData()
      return true
    } catch (error) {
      console.error('Error adding task:', error)
      addLog('Fallo_al_Registrar:_Sin_Conexión_con_Kernel', 'error')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [addLog, fetchData])

  // Actualizar tarea existente
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      await api.put(`/tasks/${taskId}`, updateData)
      await fetchData()
      addLog('Registro_Actualizado', 'success')
    } catch (error) {
      console.error('Error updating task:', error)
      addLog('Error_al_Actualizar:_Sin_Conexión', 'error')
    }
  }, [addLog, fetchData])

  // Eliminar tarea individual
  const deleteTask = useCallback(async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      await fetchData()
      addLog('Registro_Eliminado', 'warning')
      addNotification('DATO_ELIMINADO', 'La tarea ha sido destruida del Kernel.', 'red')
      if (playSound) playSound('delete_action')
    } catch (error) {
      console.error('Error deleting task:', error)
      addLog('Error_al_Eliminar', 'error')
    }
  }, [addLog, addNotification, fetchData, playSound])

  // Eliminar múltiples tareas
  const deleteTasks = useCallback(async (taskIds) => {
    try {
      await api.post('/tasks/bulk-delete', { ids: taskIds })
      await fetchData()
      addLog(`${taskIds.length}_Registros_Eliminados`, 'warning')
      addNotification('DATOS_ELIMINADOS', `${taskIds.length} tareas han sido destruidas del Kernel.`, 'red')
      if (playSound) playSound('delete_action')
    } catch (error) {
      console.error('Error bulk deleting tasks:', error)
      addLog('Error_al_Eliminar_Múltiple', 'error')
    }
  }, [addLog, addNotification, fetchData, playSound])

  // Toggle completar/incompletar tarea
  const toggleTask = useCallback(async (taskId, completionNote = null) => {
    try {
      const task = tasks.find(t => Number(t.id) === Number(taskId))
      const isCompleting = task && !task.isCompleted

      // Si está completando y no hay nota, pedir confirmación
      if (isCompleting && completionNote === null && !setTaskToComplete) {
        // Fallback si no hay setTaskToComplete
        await api.put(`/tasks/${taskId}/toggle`, { completionNote: '' })
        await fetchData()
        addLog('Tarea_Completada', 'success')
        return
      }

      // Manejo especial si hay modal de completado
      if (isCompleting && completionNote === null && setTaskToComplete) {
        setTaskToComplete(task)
        return
      }

      await api.put(`/tasks/${taskId}/toggle`, { completionNote })
      await fetchData()

      if (isCompleting) {
        // Recompensar por completar
        addXP(50)
        updateStreak()
        addLog('Tarea_Completada_¡+50XP!', 'success')
        if (playSound) playSound('task_check')
      } else {
        addLog('Estado_de_Tarea_Modificado', 'info')
      }
      
      // Limpiar estado de completado
      if (setTaskToComplete) setTaskToComplete(null)
    } catch (error) {
      console.error('Error toggling task:', error)
      if (setTaskToComplete) setTaskToComplete(null)
    }
  }, [tasks, addLog, addXP, updateStreak, playSound, setTaskToComplete, fetchData])

  return {
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    toggleTask
  }
}

export default useTaskOperations
