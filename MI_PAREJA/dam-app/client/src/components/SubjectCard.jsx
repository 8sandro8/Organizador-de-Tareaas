import { Plus, BookOpen, Clock, Layers, Activity, ExternalLink } from 'lucide-react';

export default function SubjectCard({ subject, onToggleTask, onQuickAdd }) {
    if (!subject) return null;

    const pendingTasks = subject.tasks?.filter(t => !t.isCompleted) || [];
    const countableTasks = subject.tasks?.filter(t => t.type === 'CLASE' || t.type === 'EJERCICIO') || [];
    const completedCount = countableTasks.filter(t => t.isCompleted).length;
    const totalCount = countableTasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-neon-blue/50 transition-all group shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-neon-blue/5 blur-[60px] group-hover:bg-neon-blue/10 transition-all"></div>

            <div className="flex justify-between items-start mb-6 relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-center group-hover:border-neon-blue/30 transition-all">
                        <Layers className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-neon-blue transition-colors">
                            {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-neon-blue bg-neon-blue/10 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-tighter">
                                COD_{subject.code}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onQuickAdd(subject.id)}
                    className="p-3 bg-[#21262d] text-neon-blue rounded-xl hover:bg-neon-blue hover:text-black transition-all shadow-lg hover:shadow-neon-blue/20 flex items-center justify-center min-w-[44px] min-h-[44px]"
                    title="AÑADIR_NUEVA_TAREA"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 mb-6 font-mono relative gap-2">
                <div className="bg-[#0d1117]/50 backdrop-blur-sm p-3.5 rounded-xl border border-[#30363d] group-hover:border-[#444c56] transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Tareas Pendientes</span>
                    </div>
                    <div className="text-2xl font-bold text-white leading-none">{pendingTasks.length}</div>
                </div>

                {pendingTasks.length > 0 && (
                    <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-3 flex flex-col gap-1 cyber-scanline">
                        <div className="flex justify-between items-center text-[8px] font-black text-neon-blue uppercase tracking-widest opacity-70">
                            <span>Próximo Objetivo</span>
                            <span className="animate-pulse">Active_Task</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-white font-bold truncate">{pendingTasks[0].title}</span>
                            {pendingTasks[0].link && (
                                <a
                                    href={pendingTasks[0].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-neon-blue hover:scale-110 transition-transform"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 relative flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[#30363d]" />
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} className={`transition-all duration-1000 ${progress === 100 ? 'text-neon-green' : 'text-neon-blue'}`} style={{ filter: `drop-shadow(0 0 6px ${progress === 100 ? '#39ff14' : '#00f0ff'})` }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[10px] font-black font-mono ${progress === 100 ? 'text-neon-green' : 'text-neon-blue'}`}>{Math.round(progress)}%</span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                        <span className="text-gray-500 uppercase tracking-widest">Progreso del Módulo</span>
                    </div>
                    <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d] hidden sm:block">
                        <div
                            className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-neon-green shadow-[0_0_10px_#39ff1488]' : 'bg-neon-blue shadow-[0_0_10px_#00f0ff88]'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="text-[9px] text-gray-600 font-mono mt-1 w-full truncate border border-transparent">
                        [{completedCount}/{totalCount}] Procesos Completados
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#30363d]/50 relative">
                <div className="text-[9px] font-mono text-gray-600 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse"></span>
                    Sincronización de Clases
                </div>
                <div className="space-y-2">
                    {pendingTasks.slice(0, 2).map(task => (
                        <div key={task.id} className="flex items-center gap-3 text-[10px] font-mono text-gray-400 group/task cursor-pointer" onClick={() => onToggleTask(task.id)}>
                            <div className="w-1 h-1 bg-gray-700 rounded-full group-hover/task:bg-neon-blue"></div>
                            <span className="truncate group-hover/task:text-gray-200 transition-colors">{task.title}</span>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className="text-[10px] font-mono text-neon-green/60 italic px-4 py-2 border border-neon-green/10 bg-neon-green/5 rounded-lg text-center">
                            // Todo al día
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
