import { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Check, Trash2, ExternalLink, Filter, Search, ChevronRight, RefreshCcw, Square, CheckSquare, Trash } from 'lucide-react';

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onDeleteTasks, filter, setFilter, searchTerm, setSearchTerm, onOpenDetails }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const filterOptions = [
        { id: 'ALL', label: 'ALL_PROCESSES', color: 'bg-gray-700' },
        { id: 'CLASE', label: 'CLASSES', color: 'bg-neon-blue' },
        { id: 'EJERCICIO', label: 'EXERCISES', color: 'bg-neon-purple' },
        { id: 'EXAMEN', label: 'EXAMS', color: 'bg-red-500' },
        { id: 'PILDORAS', label: 'PÍLDORAS', color: 'bg-yellow-500' },
        { id: 'APUNTES', label: 'APUNTES', color: 'bg-neon-green/80' },
        { id: 'COMPLETADOS', label: 'COMPLETADOS', color: 'bg-neon-green text-black font-black' },
    ];

    // Reset selection when tasks or filter change
    useEffect(() => {
        setSelectedIds([]);
    }, [filter]);

    const handleSelectAll = () => {
        if (selectedIds.length === tasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tasks.map(t => t.id));
        }
    };

    const handleToggleSelect = (e, id) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (onDeleteTasks && selectedIds.length > 0) {
            onDeleteTasks(selectedIds);
            setSelectedIds([]);
        }
    };

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl h-[70vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-center">
                        <Terminal className="w-4 h-4 text-neon-blue" />
                    </div>
                    <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                        Registro de Tareas <span className="text-neon-blue opacity-50">v4.2 BULK_DELETION</span>
                    </h2>
                </div>
                <div className="flex gap-1.5 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-50"></div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {tasks.length > 0 && (
                <div key="bulk-actions-bar" className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
                    <button
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 hover:text-neon-blue transition-colors"
                    >
                        {selectedIds.length === tasks.length ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>{selectedIds.length === tasks.length ? 'DESELECCIONAR TODO' : 'SELECCIONAR TODO'}</span>
                    </button>

                    {selectedIds.length > 0 && (
                        <button
                            key="delete-selected-btn"
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-1 rounded-lg text-[10px] font-mono font-black hover:bg-red-500 hover:text-white transition-all animate-pulse"
                        >
                            <Trash className="w-3 h-3" />
                            <span>BORRAR {selectedIds.length} SELECCIONADAS</span>
                        </button>
                    )}
                </div>
            )}

            {/* Search */}
            <div key="search-bar" className="bg-[#0d1117] p-3 border-b border-[#30363d]">
                <div className="relative group">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-neon-blue transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="BUSCAR TAREA O ASIGNATURA..."
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-2 pl-9 text-[11px] font-mono text-white outline-none focus:border-neon-blue/50 transition-all placeholder:text-gray-700"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#0d1117] p-2 border-b border-[#30363d] flex gap-2 overflow-x-auto no-scrollbar custom-scrollbar">
                {filterOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border whitespace-nowrap ${filter === opt.id
                            ? `${opt.color} text-black border-transparent shadow-lg shadow-white/5`
                            : 'text-gray-500 border-gray-800 hover:border-gray-600'
                            }`}
                    >
                        {opt.id === 'ALL' ? 'TODAS' : opt.id === 'CLASE' ? 'CLASES' : opt.id === 'EJERCICIO' ? 'EJERCICIOS' : opt.id === 'EXAMEN' ? 'EXÁMENES' : opt.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm custom-scrollbar">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-600 mt-16 py-10 border border-dashed border-[#30363d] rounded-2xl">
                        <ShieldCheck className="w-10 h-10 mx-auto opacity-10 mb-3" />
                        <p className="text-[10px] uppercase tracking-[0.2em]">Cero Tareas Pendientes</p>
                    </div>
                ) : (
                    tasks.map(task => {
                        const isUrgent = new Date(task.date) <= new Date(new Date().setHours(48));
                        const isSelected = selectedIds.includes(task.id);
                        return (
                            <div
                                key={task.id}
                                className={`group flex gap-3 pb-3 border border-transparent last:border-0 hover:bg-[#161b22] px-3 py-4 rounded-xl transition-all relative cursor-pointer ${task.isCompleted ? 'task-glitch-active' : ''} ${isSelected ? 'bg-neon-blue/5 border-neon-blue/20 ring-1 ring-neon-blue/10' : ''} ${task.type === 'EXAMEN' && !task.isCompleted ? 'critical-threat-pulse border-red-500/30' : 'border-b-[#30363d]/30'}`}
                                onClick={() => onOpenDetails(task)}
                            >
                                {/* Checkbox Selector */}
                                <button
                                    onClick={(e) => handleToggleSelect(e, task.id)}
                                    className="mt-0.5 relative z-10 shrink-0"
                                >
                                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-neon-blue border-neon-blue text-black'
                                        : 'border-[#30363d] hover:border-neon-blue/50 bg-[#0d1117]'
                                        }`}>
                                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                                    className="mt-0.5 relative z-10 shrink-0"
                                >
                                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${task.isCompleted
                                        ? 'bg-neon-green border-neon-green text-black scale-90'
                                        : task.type === 'EXAMEN' ? 'border-red-500 bg-red-500/10' : 'border-[#30363d] hover:border-neon-blue bg-[#0d1117]'
                                        }`}>
                                        {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                                        {!task.isCompleted && task.type === 'EXAMEN' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                                    </div>
                                </button>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[8px] text-black ${task.type === 'EXAMEN' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-flicker' :
                                            task.type === 'EJERCICIO' ? 'bg-neon-purple' :
                                                task.type === 'PILDORAS' ? 'bg-yellow-500' :
                                                    task.type === 'APUNTES' ? 'bg-neon-green/80' : 'bg-neon-blue'
                                            } px-2 py-0.5 rounded-md font-black uppercase tracking-tighter`}>
                                            {task.type === 'EXAMEN' ? 'CRITICAL_THREAT' : task.type}
                                        </span>
                                        <span className="text-[10px] text-gray-600 font-bold tracking-tighter" title={task.subject?.name}>
                                            {task.subject?.code} - <span className="text-gray-400">{task.subject?.name}</span>
                                        </span>
                                        {!task.isCompleted && (
                                            <div className="flex items-center gap-1 ml-1">
                                                <div className={`w-1 h-1 rounded-full animate-pulse ${task.type === 'EXAMEN' ? 'bg-red-500' :
                                                    task.type === 'PILDORAS' ? 'bg-yellow-500' :
                                                        task.type === 'APUNTES' ? 'bg-neon-green' : 'bg-neon-blue'}`}></div>
                                                <span className={`text-[7px] font-black uppercase ${task.type === 'EXAMEN' ? 'text-red-500' :
                                                    task.type === 'PILDORAS' ? 'text-yellow-500' :
                                                        task.type === 'APUNTES' ? 'text-neon-green' : 'text-neon-blue'} opacity-80 tracking-widest`}>Active</span>
                                            </div>
                                        )}
                                        {task.duration && (
                                            <span className="text-[8px] bg-[#161b22] border border-[#30363d] text-gray-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                                                <Terminal className="w-2.5 h-2.5" /> {task.duration}
                                            </span>
                                        )}
                                        {task.resumePoint && (
                                            <span className="text-[8px] bg-neon-blue/10 border border-neon-blue/20 text-neon-blue px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                                <RefreshCcw className="w-2.5 h-2.5" /> RE: {task.resumePoint}
                                            </span>
                                        )}
                                        {isUrgent && !task.isCompleted && (
                                            <span className="text-[7px] text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded-md uppercase font-bold animate-pulse">Urgente</span>
                                        )}
                                        <div className="flex flex-col items-end ml-auto text-[10px] font-mono leading-tight shrink-0 min-w-[60px]">
                                            <span className={`uppercase opacity-60 ${task.isCompleted ? 'text-neon-green' : 'text-gray-500'}`}>
                                                {task.isCompleted ? 'Terminado:' : 'Creado:'}
                                            </span>
                                            <span className={`font-bold ${task.isCompleted ? 'text-neon-green/80' : 'text-gray-700'}`}>
                                                {task.isCompleted && task.completedAt
                                                    ? new Date(task.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                                    : task.date ? new Date(task.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '--/--'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 pr-8 sm:pr-0">
                                        <p className={`text-[15px] sm:text-[16px] text-gray-200 leading-tight break-words group-hover:text-neon-blue transition-colors ${task.isCompleted ? 'font-bold text-neon-green/90' : 'font-medium'}`}>
                                            {task.title}
                                        </p>
                                    </div>
                                    {task.isCompleted && task.completionNote && (
                                        <div className="mt-2 bg-neon-green/5 border-l-2 border-neon-green/30 px-3 py-2 rounded-r-lg">
                                            <p className="text-[11px] text-neon-green/80 font-mono leading-relaxed italic">
                                                <span className="font-bold uppercase tracking-tighter mr-1">Nota:</span>
                                                {task.completionNote}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {task.link && (
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-full flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-black transition-all animate-glitch-hover group/btn shadow-lg shadow-neon-blue/5"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                        <span>Lanzar</span>
                                    </a>
                                )}

                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                    className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all self-center relative z-10 shrink-0"
                                >
                                    <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                </button>

                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-neon-blue group-hover:h-8 transition-all duration-300 rounded-full"></div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 border-t border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md">
                <div className="flex items-center justify-between text-gray-600 text-[9px] font-mono font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Filter className="w-3 h-3" />
                        <div className="flex items-center gap-1">
                            <span>Logs_Output: {tasks.length}</span>
                            {selectedIds.length > 0 && (
                                <span className="text-neon-blue ml-2">| SELECCIONADAS: {selectedIds.length}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-neon-blue cursor-help">
                        <ChevronRight className="w-3 h-3" />
                        <span>System_Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
