import React from 'react';
import { X, History, RotateCcw, CheckCircle2, Terminal, MessageSquare } from 'lucide-react';

export default function HistoryModal({ subject, isOpen, onClose, onToggleTask }) {
    if (!isOpen || !subject) return null;

    const completedTasks = subject.tasks?.filter(t => t.isCompleted) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-200">
                {/* Header Style Console */}
                <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-gray-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Archivo_Histórico // {subject.code}</span>
                            <span className="text-sm font-bold text-white uppercase">{subject.name}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
                    {completedTasks.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                            <Terminal className="w-12 h-12" />
                            <p className="font-mono text-xs uppercase tracking-[0.3em]">No_hay_registros_completados</p>
                        </div>
                    ) : (
                        completedTasks.map(task => (
                            <div key={task.id} className="group relative bg-[#161b22]/50 border border-[#30363d] p-4 rounded-xl flex items-center justify-between hover:border-neon-blue/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-neon-green" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold text-gray-300 ${task.isCompleted ? 'line-through decoration-gray-600' : ''}`}>{task.title}</span>
                                        <span className="text-[9px] font-mono text-gray-600 uppercase">
                                            Completada: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : new Date(task.date).toLocaleDateString()}
                                        </span>
                                        {task.completionNote && (
                                            <p className="mt-1 text-[10px] text-neon-green/60 font-mono italic leading-snug">
                                                {task.completionNote}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onToggleTask(task.id)}
                                    className="p-2 text-gray-600 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-all flex items-center gap-2 group/btn"
                                    title="Restaurar a Pendientes"
                                >
                                    <RotateCcw className="w-4 h-4 group-hover/btn:rotate-[-45deg] transition-transform" />
                                    <span className="text-[9px] font-mono font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Restaurar</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-[#161b22] border-t border-[#30363d] text-center">
                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest italic">
                        // Estos registros no afectan a la estabilidad actual del Kernel
                    </p>
                </div>
            </div>
        </di