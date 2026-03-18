import { Plus, BookOpen, Clock, Layers, Activity, ExternalLink, Stethoscope, FileText, ClipboardList, Pill } from 'lucide-react';

const iconMap = {
    '🏥': Stethoscope,
    '🏗️': Layers,
    '📋': FileText,
    '💊': Pill,
    '🇬🇧': BookOpen,
    '⚕️': ClipboardList,
    '🧱': Layers,
    '📱': Layers,
    '🛠️': Layers,
    '🧭': Layers,
    '🖥️': Layers,
    '🗄️': Layers,
    '☕': Layers,
};

export default function SubjectCard({ subject, onToggleTask, onQuickAdd, theme = 'cyberpunk' }) {
    if (!subject) return null;

    const isSanidad = theme === 'sanidad';
    const pendingTasks = subject.tasks?.filter(t => !t.isCompleted) || [];
    const countableTasks = subject.tasks?.filter(t => t.type === 'CLASE' || t.type === 'EJERCICIO') || [];
    const completedCount = countableTasks.filter(t => t.isCompleted).length;
    const totalCount = countableTasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const IconComponent = iconMap[subject.icon] || Layers;

    const styles = {
        container: isSanidad 
            ? 'bg-white border border-slate-200 rounded-[1.25rem] p-6 hover:shadow-[0_8px_30px_rgb(0,127,255,0.15)] hover:border-slate-300 transition-all duration-300'
            : 'bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-neon-blue/50 transition-all group shadow-xl relative overflow-hidden',
        iconContainer: isSanidad
            ? 'w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center'
            : 'w-10 h-10 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-center group-hover:border-neon-blue/30 transition-all',
        icon: isSanidad ? 'w-6 h-6 text-[#007FFF]' : 'w-5 h-5 text-neon-blue',
        title: isSanidad
            ? 'text-slate-800 font-semibold text-lg'
            : 'text-white font-bold text-lg group-hover:text-neon-blue transition-colors',
        code: isSanidad
            ? 'text-[10px] text-[#007FFF] bg-blue-50 px-2 py-1 rounded-full font-semibold'
            : 'text-[9px] text-neon-blue bg-neon-blue/10 px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-tighter',
        button: isSanidad
            ? 'p-3 bg-[#007FFF] text-white rounded-2xl hover:bg-[#0066cc] transition-all shadow-lg hover:shadow-[#007FFF]/20 flex items-center justify-center min-w-[44px] min-h-[44px]'
            : 'p-3 bg-[#21262d] text-neon-blue rounded-xl hover:bg-neon-blue hover:text-black transition-all shadow-lg hover:shadow-neon-blue/20 flex items-center justify-center min-w-[44px] min-h-[44px]',
        statsContainer: isSanidad
            ? 'bg-slate-50 p-4 rounded-2xl border border-slate-100'
            : 'bg-[#0d1117]/50 backdrop-blur-sm p-3.5 rounded-xl border border-[#30363d] group-hover:border-[#444c56] transition-all flex items-center justify-between',
        statsLabel: isSanidad
            ? 'text-slate-500 text-xs font-medium uppercase tracking-wide'
            : 'text-gray-500 text-[10px] uppercase font-bold tracking-widest',
        statsValue: isSanidad
            ? 'text-3xl font-bold text-slate-800'
            : 'text-2xl font-bold text-white leading-none',
        nextTask: isSanidad
            ? 'bg-blue-50 border border-blue-100 rounded-2xl p-4'
            : 'bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-3 flex flex-col gap-1 cyber-scanline',
        nextTaskLabel: isSanidad
            ? 'text-[10px] font-semibold text-[#007FFF] uppercase tracking-wide'
            : 'text-[8px] font-black text-neon-blue uppercase tracking-widest opacity-70',
        nextTaskTitle: isSanidad
            ? 'text-sm text-slate-700 font-medium'
            : 'text-[11px] text-white font-bold truncate',
        progressBar: isSanidad
            ? 'bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200'
            : 'h-1.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d] hidden sm:block',
        progressFill: isSanidad
            ? 'h-full bg-gradient-to-r from-[#007FFF] to-[#0ea5e9] transition-all duration-1000'
            : 'h-full transition-all duration-1000 bg-neon-blue shadow-[0_0_10px_#00f0ff88]',
        footer: isSanidad
            ? 'mt-6 pt-5 border-t border-slate-100'
            : 'mt-6 pt-5 border-t border-[#30363d]/50 relative',
        footerLabel: isSanidad
            ? 'text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2'
            : 'text-[9px] font-mono text-gray-600 mb-3 uppercase tracking-[0.2em] flex items-center gap-2',
        taskItem: isSanidad
            ? 'flex items-center gap-3 text-xs text-slate-500 hover:text-[#007FFF] cursor-pointer transition-colors'
            : 'flex items-center gap-3 text-[10px] font-mono text-gray-400 group/task cursor-pointer',
        dot: isSanidad
            ? 'w-1.5 h-1.5 bg-[#007FFF] rounded-full'
            : 'w-1 h-1 bg-gray-700 rounded-full group-hover/task:bg-neon-blue',
        empty: isSanidad
            ? 'text-xs text-green-600 font-medium italic px-4 py-2 border border-green-100 bg-green-50 rounded-xl text-center'
            : 'text-[10px] font-mono text-neon-green/60 italic px-4 py-2 border border-neon-green/10 bg-neon-green/5 rounded-lg text-center',
    };

    const glowDiv = !isSanidad && (
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-neon-blue/5 blur-[60px] group-hover:bg-neon-blue/10 transition-all"></div>
    );

    return (
        <div className={styles.container}>
            {glowDiv}

            <div className="flex justify-between items-start mb-6 relative">
                <div className="flex items-center gap-3">
                    <div className={styles.iconContainer}>
                        <IconComponent className={styles.icon} />
                    </div>
                    <div>
                        <h3 className={styles.title}>
                            {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={styles.code}>
                                {isSanidad ? subject.code : `COD_${subject.code}`}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onQuickAdd(subject.id)}
                    className={styles.button}
                    title={isSanidad ? 'AÑADIR NUEVA TAREA' : 'AÑADIR_NUEVA_TAREA'}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className={`grid grid-cols-1 mb-6 ${isSanidad ? 'font-sans' : 'font-mono'} relative gap-2`}>
                <div className={styles.statsContainer}>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Activity className={isSanidad ? 'w-4 h-4 text-[#007FFF]' : 'w-3.5 h-3.5'} />
                        <span className={styles.statsLabel}>{isSanidad ? 'Tareas Pendientes' : 'Tareas Pendientes'}</span>
                    </div>
                    <div className={styles.statsValue}>{pendingTasks.length}</div>
                </div>

                {pendingTasks.length > 0 && (
                    <div className={styles.nextTask}>
                        <div className="flex justify-between items-center">
                            <span className={styles.nextTaskLabel}>{isSanidad ? 'Próxima Tarea' : 'Próximo Objetivo'}</span>
                            <span className={isSanidad ? 'text-[10px] text-[#007FFF] animate-pulse' : 'text-[8px] text-neon-blue animate-pulse'}>
                                {isSanidad ? 'En progreso' : 'Active_Task'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2">
                            <span className={styles.nextTaskTitle}>{pendingTasks[0].title}</span>
                            {pendingTasks[0].link && (
                                <a
                                    href={pendingTasks[0].link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={isSanidad ? 'p-1 text-[#007FFF] hover:scale-110 transition-transform' : 'p-1 text-neon-blue hover:scale-110 transition-transform'}
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
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className={isSanidad ? 'text-slate-200' : 'text-[#30363d]'} />
                        <circle 
                            cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={125.6} 
                            strokeDashoffset={125.6 - (125.6 * progress) / 100} 
                            className={`transition-all duration-1000 ${progress === 100 ? (isSanidad ? 'text-green-500' : 'text-neon-green') : (isSanidad ? 'text-[#007FFF]' : 'text-neon-blue')}`}
                            style={{ filter: `drop-shadow(0 0 6px ${progress === 100 ? (isSanidad ? '#10b981' : '#39ff14') : (isSanidad ? '#007FFF' : '#00f0ff')})` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[10px] font-black ${isSanidad ? 'font-sans' : 'font-mono'} ${progress === 100 ? (isSanidad ? 'text-green-600' : 'text-neon-green') : (isSanidad ? 'text-[#007FFF]' : 'text-neon-blue')}`}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className={isSanidad ? 'text-slate-400 uppercase tracking-wide' : 'text-gray-500 uppercase tracking-widest'}>
                            {isSanidad ? 'Progreso del Módulo' : 'Progreso del Módulo'}
                        </span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className={`text-[9px] ${isSanidad ? 'text-slate-400 font-medium mt-1' : 'text-gray-600 font-mono mt-1 w-full truncate border border-transparent'}`}>
                        [{completedCount}/{totalCount}] {isSanidad ? 'Tareas Completadas' : 'Procesos Completados'}
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerLabel}>
                    <span className={`w-1.5 h-1.5 ${isSanidad ? 'bg-[#007FFF] rounded-full' : 'bg-neon-blue rounded-full animate-pulse'}`}></span>
                    {isSanidad ? 'Clases Pendientes' : 'Sincronización de Clases'}
                </div>
                <div className="space-y-2">
                    {pendingTasks.slice(0, 2).map(task => (
                        <div key={task.id} className={styles.taskItem} onClick={() => onToggleTask(task.id)}>
                            <div className={styles.dot}></div>
                            <span className="truncate">{task.title}</span>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className={styles.empty}>
                            {isSanidad ? 'Todo al día' : '// Todo al día'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
