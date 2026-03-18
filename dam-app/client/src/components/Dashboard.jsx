import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCcw, LayoutGrid, List, Cpu } from 'lucide-react'

// Componentes
import Header from './Header'
import SubjectCard from './SubjectCard'
import TaskList from './TaskList_REAL'
import AddTask from './AddTask'
import TaskDetailsModal from './TaskDetailsModal'
import Timer from './Timer'
import StatsWidget from './StatsWidget'
import CalendarWidget from './CalendarWidget'
import QuickNotes from './QuickNotes'
import SubjectManagerModal from './SubjectManagerModal'
import CompletionModal from './CompletionModal'
import NotificationStack from './NotificationStack'
import ViewToggle from './ViewToggle'

// Hooks
import useSound from '../hooks/useSound'
import useDashboardData from '../hooks/useDashboardData'
import useGamification from '../hooks/useGamification'
import useNotifications from '../hooks/useNotifications'
import useTaskOperations from '../hooks/useTaskOperations'

/**
 * Dashboard - Componente orquestador del sistema
 * 
 * Este componente SOLO orquesta:
 * - Custom Hooks que gestionan la lógica de negocio
 * - Componentes visuales que renderizan la UI
 * 
 * NO contiene lógica de negocio directamente - déllega todo a los hooks
 */
function Dashboard({ currentUser, onLogout }) {
  // =============================================================================
  // GUARDIA DE SEGURIDAD: Verificación inmediata de usuario
  // =============================================================================
  const { t } = useTranslation(['dashboard', 'common'])
  
  if (!currentUser || !currentUser.id) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-10 h-10 text-neon-blue animate-pulse" />
          <span className="text-gray-400">{t('dashboard.loading')}</span>
        </div>
      </div>
    )
  }

  // =============================================================================
  // INICIALIZACIÓN DE HOOKS (orden crítico)
  // =============================================================================
  const { playSound } = useSound()
  const theme = currentUser.id === 'MI_PAREJA' ? 'sanidad' : 'cyberpunk'
  
  // Hook de datos - necesita userId y addLog
  const { notifications, addLog } = useNotifications(playSound)
  const { subjects, setSubjects, tasks, loading, refreshing, apiError, stability, fetchData } = 
    useDashboardData(currentUser.id, addLog)
  
  const { gamification, addXP, updateStreak } = useGamification(playSound)
  
  // Estado local para modales
  const [filter, setFilter] = useState('CLASE')
  const [selectedSubjectForFilter, setSelectedSubjectForFilter] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [preselectedSubject, setPreselectedSubject] = useState(null)
  const [taskToComplete, setTaskToComplete] = useState(null)
  const [pulseEffect, setPulseEffect] = useState(false)

  // Hook de operaciones de tareas - necesita dependencias
  const { addTask, updateTask, deleteTask, deleteTasks, toggleTask } = useTaskOperations({
    tasks,
    fetchData,
    addLog,
    addNotification: notifications.addNotification || (() => {}),
    addXP,
    updateStreak,
    playSound,
    setTaskToComplete
  })

  // =============================================================================
  // EFECTOS SECUNDARIOS
  // =============================================================================
  useEffect(() => {
    document.body.className = `theme-${theme}`
  }, [theme])
  
  // =============================================================================
  // MANEJADORES DE EVENTOS
  // =============================================================================
  const handleToggleTask = async (taskId, note = null) => {
    const task = tasks.find(t => Number(t.id) === Number(taskId))
    const isCompleting = task && !task.isCompleted

    if (isCompleting && note === null && !taskToComplete) {
      setTaskToComplete(task)
      return
    }

    await toggleTask(taskId, note)

    if (isCompleting) {
      setPulseEffect(true)
      addLog(t('dashboard.xp.taskCompleted'), 'success')
      setTimeout(() => setPulseEffect(false), 1000)
    }
  }

  const handleOpenAddModal = () => {
    setPreselectedSubject(null)
    setIsAddModalOpen(true)
  }

  const handleQuickAdd = (subjectId) => {
    setPreselectedSubject(subjectId)
    setIsAddModalOpen(true)
    addLog(t('dashboard.quickAdd'), 'info')
  }

  // =============================================================================
  // FILTRO DE TAREAS
  // =============================================================================
  const filteredTasks = (tasks || []).filter(task => {
    if (!task) return false

    if (filter === 'COMPLETADOS') {
      if (!task.isCompleted) return false
    } else {
      if (task.isCompleted) return false
      if (filter !== 'ALL' && task.type !== filter) return false
    }

    if (selectedSubjectForFilter && task.subject?.id !== selectedSubjectForFilter) {
      return false
    }

    const safeTitle = (task.title || '').toLowerCase()
    const safeSubjectCode = (task.subject?.code || '').toLowerCase()
    const safeSearch = (searchTerm || '').toLowerCase()

    const matchesSearch = safeTitle.includes(safeSearch) || safeSubjectCode.includes(safeSearch)
    return searchTerm === '' || matchesSearch
  })

  // =============================================================================
  // RENDER
  // =============================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-10 h-10 text-neon-blue animate-pulse" />
          <span className="text-gray-400">{t('app.loading', { defaultValue: 'Cargando...' })}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-neon-green selection:text-black pb-20 overflow-x-hidden ${
        isFocusMode ? 'cursor-none' : ''
      } ${pulseEffect ? 'neon-pulse transition-all duration-300' : ''}`}
    >
      {/* Header - solo cuando no está en modo focus */}
      {!isFocusMode && (
        <Header
          subjectCount={subjects.length}
          stability={stability}
          gamification={gamification}
          theme={theme}
          onOpenAddModal={handleOpenAddModal}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={onLogout}
        />
      )}

      {/* Contenido principal */}
      <main
        className={`max-w-[1600px] mx-auto p-4 md:p-8 ${
          isFocusMode ? 'flex items-center justify-center min-h-screen pt-0' : 'space-y-12'
        }`}
      >
        <div
          className={`grid grid-cols-1 gap-8 items-start ${
            isFocusMode ? 'lg:grid-cols-1 w-full max-w-md' : 'lg:grid-cols-12'
          }`}
        >
          {/* Columna izquierda - Widgets */}
          <div
            className={`${isFocusMode ? 'lg:col-span-1' : 'lg:col-span-4'} space-y-6`}
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Timer - siempre visible */}
              <Timer
                onFinish={() => {
                  addXP(100)
                  addLog(t('dashboard.xp.sessionFinished'), 'success')
                }}
                isFocusMode={isFocusMode}
                onToggleFocus={() => setIsFocusMode(!isFocusMode)}
                playSound={playSound}
              />

              {/* Widgets adicionales - solo cuando no está en modo focus */}
              {!isFocusMode && (
                <>
                  {/* Toggle Stats/Calendario */}
                  <ViewToggle
                    showCalendar={showCalendar}
                    onToggle={setShowCalendar}
                  />

                  {/* Stats o Calendario */}
                  {showCalendar ? (
                    <CalendarWidget />
                  ) : (
                    <StatsWidget tasks={tasks.filter(t => !t.isCompleted)} subjects={subjects} />
                  )}

                  {/* Quick Notes */}
                  <QuickNotes />
                </>
              )}
            </div>
          </div>

          {/* Columna derecha - Lista de tareas */}
          {!isFocusMode && (
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-[#30363d] pb-4">
                <List className="w-5 h-5 text-neon-purple" />
                <h2 className="text-xl font-semibold text-white">
                  {t('dashboard.tasks')}
                </h2>
              </div>

              <TaskList
                tasks={filteredTasks}
                theme={theme}
                onToggleTask={handleToggleTask}
                onDeleteTask={deleteTask}
                onDeleteTasks={deleteTasks}
                onOpenDetails={setSelectedTask}
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedSubjectForFilter={selectedSubjectForFilter}
                setSelectedSubjectForFilter={setSelectedSubjectForFilter}
                subjects={subjects}
              />
            </div>
          )}
        </div>

        {/* Sección de Asignaturas */}
        {!isFocusMode && (
          <div className="pt-8 border-t border-[#30363d]/50">
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-4 bg-[#0d1117] sticky top-0 z-10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-neon-blue" />
                  {t('dashboard.subjects')}
                </h2>
                <button
                  onClick={() => fetchData(true)}
                  className={`flex items-center gap-2 px-3 py-1 hover:bg-[#21262d] rounded transition-colors text-xs font-mono ${
                    refreshing ? 'text-neon-green' : 'text-gray-500'
                  }`}
                >
                  <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? t('dashboard.refreshing') : t('dashboard.refresh')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Error de conexión */}
                {apiError && (
                  <div className="col-span-full border border-red-500/30 bg-red-500/10 p-4 rounded-xl text-center">
                    <p className="text-red-500 text-sm font-medium mb-2">
                      {t('dashboard.error.title')}
                    </p>
                    <p className="text-gray-400 text-xs mb-4">
                      {t('dashboard.error.message')}
                    </p>
                    <button
                      onClick={() => fetchData(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                    >
                      {t('dashboard.error.retry')}
                    </button>
                  </div>
                )}

                {/* Grid de asignaturas */}
                {subjects.length > 0 ? (
                  subjects.map(subj => (
                    <SubjectCard
                      key={subj.id}
                      subject={subj}
                      theme={theme}
                      onToggleTask={handleToggleTask}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))
                ) : !apiError && (
                  <div className="col-span-full py-20 border border-dashed border-[#30363d] rounded-3xl flex flex-col items-center justify-center text-gray-600 font-mono">
                    <span className="text-sm uppercase tracking-widest animate-pulse">
                      {t('dashboard.noModules.title')}
                    </span>
                    <span className="text-[10px] mt-2 opacity-50">
                      {t('dashboard.noModules.subtitle')}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ======================================================================= */}
      {/* MODALES */}
      {/* ======================================================================= */}
      
      {/* Modal de añadir tarea */}
      <AddTask
        subjects={subjects}
        onAddTask={addTask}
        isOpen={isAddModalOpen}
        initialSubjectId={preselectedSubject}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Modal de detalles de tarea */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />

      {/* Modal de gestión de asignaturas */}
      <SubjectManagerModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={fetchData}
      />

      {/* Modal de completado de tarea */}
      <CompletionModal
        isOpen={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        taskTitle={taskToComplete?.title}
        onConfirm={(note) => handleToggleTask(taskToComplete.id, note)}
      />

      {/* ======================================================================= */}
      {/* NOTIFICACIONES */}
      {/* ======================================================================= */}
      <NotificationStack notifications={notifications} />
    </div>
  )
}

export default Dashboard