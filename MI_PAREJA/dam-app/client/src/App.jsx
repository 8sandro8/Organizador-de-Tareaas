import { useState, useEffect } from 'react'
import api from './services/api'
import { Cpu, RefreshCcw, LayoutGrid, List } from 'lucide-react'
import Header from './components/Header'
import SubjectCard from './components/SubjectCard'
import TaskList from './components/TaskList_REAL'
import AddTask from './components/AddTask'
import TaskDetailsModal from './components/TaskDetailsModal'
import Timer from './components/Timer'
import StatsWidget from './components/StatsWidget'
import CalendarWidget from './components/CalendarWidget'
import QuickNotes from './components/QuickNotes'
import SubjectManagerModal from './components/SubjectManagerModal'
import CompletionModal from './components/CompletionModal'
import useSound from './hooks/useSound'

function App() {
  const { playSound } = useSound()
  const DEFAULT_SUBJECTS = [
    { id: 'offline-01', code: "01", name: "LENGUAJES DE MARCAS", icon: "🧱", tasks: [], exams: [] },
    { id: 'offline-02', code: "02", name: "DIGITALIZACION APLICADA", icon: "📱", tasks: [], exams: [] },
    { id: 'offline-03', code: "03", name: "ENTORNOS DE DESARROLLO", icon: "🛠️", tasks: [], exams: [] },
    { id: 'offline-04', code: "04", name: "ITINERARIO PERSONAL", icon: "🧭", tasks: [], exams: [] },
    { id: 'offline-05', code: "05", name: "INGLES", icon: "🇬🇧", tasks: [], exams: [] },
    { id: 'offline-06', code: "06", name: "SISTEMAS INFORMATICOS", icon: "🖥️", tasks: [], exams: [] },
    { id: 'offline-07', code: "07", name: "BASES DE DATOS", icon: "🗄️", tasks: [], exams: [] },
    { id: 'offline-08', code: "08", name: "PROGRAMACION", icon: "☕", tasks: [], exams: [] }
  ];

  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [preselectedSubject, setPreselectedSubject] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [stability, setStability] = useState(100)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [taskToComplete, setTaskToComplete] = useState(null)
  const [gamification, setGamification] = useState(() => {
    try {
      const saved = localStorage.getItem('dam_gamification');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.level === 'number' && typeof parsed.xp === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Critical: Error parsing gamification state", e);
    }
    return { level: 1, xp: 0, streak: 0, lastDate: null };
  });

  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), text: 'SISTEMA_INICIALIZADO', type: 'system' }
  ])

  useEffect(() => {
    localStorage.setItem('dam_gamification', JSON.stringify(gamification));
  }, [gamification]);

  const addXP = (amount) => {
    setGamification(prev => {
      const newXP = prev.xp + amount;
      const xpToNextLevel = prev.level * 1000;
      if (newXP >= xpToNextLevel) {
        addLog(`LEVEL_UP:_NIVEL_${prev.level + 1}_ALCANZADO`, 'system');
        playSound('success');
        return { ...prev, level: prev.level + 1, xp: newXP - xpToNextLevel };
      }
      return { ...prev, xp: newXP };
    });
  };

  const updateStreak = () => {
    const today = new Date().toLocaleDateString();
    setGamification(prev => {
      if (prev.lastDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastDate === yesterday.toLocaleDateString();
      return {
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastDate: today
      };
    });
  };

  const [notifications, setNotifications] = useState([]);

  const addNotification = (title, message, type = 'blue') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message, type }]);
    playSound('kernel');
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const addLog = (text, type = 'info') => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      text: text.toUpperCase().replace(/\s+/g, '_'),
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));

    // Play SFX based on log type
    if (type === 'success') playSound('success');
    else if (type === 'error' || type === 'warning') playSound('warning');
    else if (type === 'system') playSound('kernel');
    else playSound('click');

    // Trigger Notification for major events
    if (type === 'success') {
      addNotification('MISIÓN_COMPLETA', text.replace(/_/g, ' '), 'green');
    } else if (text.includes('LEVEL_UP')) {
      addNotification('ASCENSO_CYBER', text.replace(/_/g, ' '), 'gold');
    }
  };

  useEffect(() => {
    fetchData()
    playSound('kernel')
  }, [])

  useEffect(() => {
    const pendingCount = (tasks || []).filter(t => t && !t.isCompleted).length;
    const baseStability = 100 - (pendingCount * 5);
    setStability(Math.max(0, Math.min(100, baseStability)));
  }, [tasks])

  const fetchData = async () => {
    if (loading === false) setRefreshing(true)
    try {
      const [subjRes, taskRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/tasks')
      ])

      const fetchedSubjects = Array.isArray(subjRes.data) ? subjRes.data : [];

      setSubjects(fetchedSubjects.length > 0 ? fetchedSubjects : DEFAULT_SUBJECTS);
      setTasks(Array.isArray(taskRes.data) ? taskRes.data : [])
      addLog('Sincronización_Kernel_Completa', 'system')
    } catch (error) {
      console.error("Error loading data:", error)
      setApiError(error.message)
      addLog('Error_de_Conexión', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      await api.get('/ping'); // Pre-flight check
      await api.post('/tasks', taskData);

      // Close modal FIRST to prevent re-rendering it with new list data
      setIsAddModalOpen(false);

      await fetchData();
      addLog(`Nueva_Tarea_Registrada:_${taskData.title}`, 'success');
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      addLog('Fallo_al_Registrar:_Sin_Conexión_con_Kernel', 'error');
      throw error;
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      await api.put(`/tasks/${taskId}`, updateData)
      fetchData()
      setSelectedTask(null)
      addLog('Registro_Actualizado', 'success')
    } catch (error) {
      console.error("Error updating task:", error)
      addLog('Error_al_Actualizar:_Sin_Conexión', 'error')
    }
  }

  const deleteTask = async (taskId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea permanentemente?")) return;
    try {
      await api.delete(`/tasks/${taskId}`)
      fetchData()
      setSelectedTask(null)
      addLog('Registro_Eliminado', 'warning');
      addNotification('DATO_ELIMINADO', 'La tarea ha sido destruida del Kernel.', 'red');
      playSound('delete_action');
    } catch (error) {
      console.error("Error deleting task:", error)
      addLog('Error_al_Eliminar', 'error')
    }
  }

  const deleteTasks = async (taskIds) => {
    if (!window.confirm(`¿Estás seguro de eliminar ${taskIds.length} tareas permanentemente?`)) return;
    try {
      await api.post('/tasks/bulk-delete', { ids: taskIds })
      fetchData()
      addLog(`${taskIds.length}_Registros_Eliminados`, 'warning');
      addNotification('DATOS_ELIMINADOS', `${taskIds.length} tareas han sido destruidas del Kernel.`, 'red');
      playSound('delete_action');
    } catch (error) {
      console.error("Error bulk deleting tasks:", error)
      addLog('Error_al_Eliminar_Múltiple', 'error')
    }
  }

  const [pulseEffect, setPulseEffect] = useState(false);

  const toggleTask = async (taskId, note = null) => {
    try {
      const task = tasks.find(t => Number(t.id) === Number(taskId));
      const isCompleting = task && !task.isCompleted;

      // If completing and no note provided yet, show modal
      if (isCompleting && note === null && !taskToComplete) {
        setTaskToComplete(task);
        return;
      }

      await api.put(`/tasks/${taskId}/toggle`, { completionNote: note })
      fetchData()

      if (isCompleting) {
        setPulseEffect(true);
        addXP(50);
        updateStreak();
        addLog('Tarea_Completada_¡+50XP!', 'success');
        playSound('task_check');
        setTimeout(() => setPulseEffect(false), 1000);
      } else {
        addLog('Estado_de_Tarea_Modificado', 'info');
      }
      setTaskToComplete(null);
    } catch (error) {
      console.error("Error toggling task:", error)
      setTaskToComplete(null);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] text-neon-green font-mono flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Cpu className="w-12 h-12 animate-pulse" />
        <span className="text-xl tracking-widest italic uppercase">Sincronizando Kernel...</span>
      </div>
    </div>
  )

  const filteredTasks = (tasks || []).filter(task => {
    if (!task) return false;

    if (filter === 'COMPLETADOS') {
      if (!task.isCompleted) return false;
    } else {
      if (task.isCompleted) return false;
      if (filter !== 'ALL' && task.type !== filter) return false;
    }

    const safeTitle = (task.title || '').toLowerCase();
    const safeSubjectCode = (task.subject?.code || '').toLowerCase();
    const safeSearch = (searchTerm || '').toLowerCase();

    const matchesSearch = safeTitle.includes(safeSearch) || safeSubjectCode.includes(safeSearch);
    return (searchTerm === '' || matchesSearch);
  });

  return (
    <div className={`min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-neon-green selection:text-black pb-20 overflow-x-hidden ${isFocusMode ? 'cursor-none' : ''} ${pulseEffect ? 'neon-pulse transition-all duration-300' : ''}`}>
      {!isFocusMode && (
        <Header
          subjectCount={subjects.length}
          stability={stability}
          gamification={gamification}
          onOpenAddModal={() => {
            setPreselectedSubject(null);
            setIsAddModalOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <main className={`max-w-[1600px] mx-auto p-4 md:p-8 ${isFocusMode ? 'flex items-center justify-center min-h-screen pt-0' : 'space-y-12'}`}>
        {/* Top Section: Tools and Tasks */}
        <div className={`grid grid-cols-1 gap-8 items-start ${isFocusMode ? 'lg:grid-cols-1 w-full max-w-md' : 'lg:grid-cols-12'}`}>
          {/* Left Column: Tools & Stats (4 units) */}
          <div className={`${isFocusMode ? 'lg:col-span-1' : 'lg:col-span-4'} space-y-6 animate-in fade-in slide-in-from-left duration-700`}>
            <div className="grid grid-cols-1 gap-6">
              <Timer
                onFinish={() => {
                  addXP(100);
                  addLog('Sesión_Terminada_¡+100XP!', 'success');
                }}
                isFocusMode={isFocusMode}
                onToggleFocus={() => setIsFocusMode(!isFocusMode)}
                playSound={playSound}
              />

              {!isFocusMode && (
                <>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCalendar(false)}
                        className={`flex-1 py-2 text-[10px] font-mono font-bold rounded-lg border transition-all ${!showCalendar ? 'bg-[#21262d] border-neon-green text-neon-green shadow-lg shadow-neon-green/10' : 'border-[#30363d] text-gray-600 hover:text-gray-400'}`}
                      >
                        ESTADÍSTICAS
                      </button>
                      <button
                        onClick={() => setShowCalendar(true)}
                        className={`flex-1 py-2 text-[10px] font-mono font-bold rounded-lg border transition-all ${showCalendar ? 'bg-[#21262d] border-neon-purple text-neon-purple shadow-lg shadow-neon-purple/10' : 'border-[#30363d] text-gray-600 hover:text-gray-400'}`}
                      >
                        CALENDARIO
                      </button>
                    </div>

                    {showCalendar ? (
                      <CalendarWidget />
                    ) : (
                      <StatsWidget tasks={tasks.filter(t => !t.isCompleted)} subjects={subjects} />
                    )}
                  </div>

                  <QuickNotes />

                  {/* System Action Log */}
                  <div className="bg-black/40 border border-[#30363d] rounded-2xl p-4 font-mono">
                    <div className="flex items-center gap-2 mb-3 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Kernel_Action_Log</span>
                    </div>
                    <div className="space-y-2">
                      {logs.map(log => (
                        <div key={log.id} className="flex gap-3 text-[9px] animate-in fade-in slide-in-from-left duration-300">
                          <span className="text-gray-600">[{log.time}]</span>
                          <span className={`${log.type === 'success' ? 'text-neon-green' :
                            log.type === 'error' ? 'text-red-500' :
                              log.type === 'warning' ? 'text-yellow-500' :
                                log.type === 'system' ? 'text-neon-blue' : 'text-gray-400'
                            }`}>
                            <span>{log.type === 'system' ? '>> ' : '> '}</span>
                            <span>{log.text}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Task List (8 units) */}
          {!isFocusMode && (
            <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 border-b border-[#30363d] pb-4 text-neon-purple">
                <List className="w-5 h-5 text-neon-purple" />
                <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight">Registro General de Tareas</h2>
              </div>

              <TaskList
                tasks={filteredTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onDeleteTasks={deleteTasks}
                onOpenDetails={setSelectedTask}
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          )}
        </div>

        {/* Subjects Section */}
        {!isFocusMode && (
          <div className="pt-8 border-t border-[#30363d]/50">
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-4 bg-[#0d1117] sticky top-0 z-10">
                <h2 className="text-xl font-mono font-bold text-white flex items-center gap-3 text-neon-blue">
                  <LayoutGrid className="w-6 h-6" />
                  PANEL DE MÓDULOS
                </h2>
                <button
                  onClick={fetchData}
                  className={`flex items-center gap-2 px-3 py-1 hover:bg-[#21262d] rounded transition-colors text-xs font-mono ${refreshing ? 'text-neon-green' : 'text-gray-500'}`}
                >
                  <RefreshCcw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'RECARGANDO...' : 'RECARGAR PANEL'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {apiError && (
                  <div className="col-span-full border border-red-500/30 bg-red-500/10 p-4 rounded-xl text-center">
                    <p className="text-red-500 text-sm font-bold uppercase mb-2">ERROR_DE_ENLACE_CON_EL_KERNEL</p>
                    <p className="text-gray-400 text-xs mb-4">No se puede alcanzar el servidor en el puerto 3016. Verifica Tailscale y el estado del NAS.</p>
                    <button onClick={fetchData} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors">REINTENTAR_CONEXIÓN</button>
                  </div>
                )}

                {subjects.length > 0 ? (
                  subjects.map(subj => (
                    <SubjectCard
                      key={subj.id}
                      subject={subj}
                      onToggleTask={toggleTask}
                      onQuickAdd={(id) => {
                        setPreselectedSubject(id);
                        setIsAddModalOpen(true);
                        addLog(`Preparando_Registro_Rápido:_${subj.name}`, 'info');
                      }}
                    />
                  ))
                ) : !apiError && (
                  <div className="col-span-full py-20 border border-dashed border-[#30363d] rounded-3xl flex flex-col items-center justify-center text-gray-600 font-mono">
                    <span className="text-sm uppercase tracking-widest animate-pulse">Advertencia: No se detectaron módulos cargados</span>
                    <span className="text-[10px] mt-2 opacity-50">Verifica la conexión con el Kernel o ejecuta el seed</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <AddTask
        subjects={subjects}
        onAddTask={addTask}
        isOpen={isAddModalOpen}
        initialSubjectId={preselectedSubject}
        onClose={() => setIsAddModalOpen(false)}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />

      <SubjectManagerModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={fetchData}
      />

      <CompletionModal
        isOpen={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        taskTitle={taskToComplete?.title}
        onConfirm={(note) => toggleTask(taskToComplete.id, note)}
      />

      {/* Cyber Notifications Layer */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`cyber-notification min-w-[300px] p-4 rounded-xl border-l-4 backdrop-blur-xl shadow-2xl relative overflow-hidden ${n.type === 'gold' ? 'bg-yellow-500/10 border-yellow-500 shadow-yellow-500/10' :
              n.type === 'green' ? 'bg-neon-green/10 border-neon-green shadow-neon-green/10' :
                'bg-neon-blue/10 border-neon-blue shadow-neon-blue/10'
              }`}
          >
            <div className="absolute top-0 right-0 p-1 opacity-20">
              <Cpu className="w-8 h-8 rotate-12" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">{n.title}</h4>
            <p className="text-xs font-bold text-white tracking-tight">{n.message}</p>
            <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-[scanline_4s_linear_infinite]"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;