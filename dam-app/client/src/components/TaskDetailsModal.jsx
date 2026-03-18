import { useState, useEffect, useRef } from 'react';
import { X, Terminal, Link, AlignLeft, Calendar, Save, Trash2, Edit3, ShieldAlert, ShieldCheck, RefreshCcw, MessageSquare } from 'lucide-react';

function TaskDetailsModalContent({ task, onClose, onUpdate, onDelete }) {
    const isMountedRef = useRef(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [link, setLink] = useState(task?.link || '');
    const [type, setType] = useState(task?.type || '');
    const [duration, setDuration] = useState(task?.duration || '');
    const [resumePoint, setResumePoint] = useState(task?.resumePoint || '');
    const [completionNote, setCompletionNote] = useState(task?.completionNote || '');

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setLink(task.link || '');
            setType(task.type || '');
            setDuration(task.duration || '');
            setResumePoint(task.resumePoint || '');
            setCompletionNote(task.completionNote || '');
            setIsEditing(false);
        }
    }, [task?.id]);

    const handleSave = async () => {
        if (!isMountedRef.current) return;
        await onUpdate(task.id, { title, description, link, type, duration, resumePoint, completionNote });
        onClose();
    };

    const handleDelete = async () => {
        if (!isMountedRef.current) return;
        await onDelete(task.id);
        onClose();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl duration-200">
                {/* Header */}
                <div className="p-5 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-center">
                            <Terminal className="w-4 h-4 text-neon-blue" />
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-neon-blue uppercase">Detalles de la Tarea // {String(task.id).slice(0, 8)}</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Title Section */}
                    <div className="relative">
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">Título de la Tarea</label>
                        {isEditing ? (
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-[#0d1117] border border-neon-blue/50 p-4 rounded-xl text-white font-mono text-lg outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-black text-white leading-tight tracking-tight">{title}</h2>
                        )}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-12 bg-neon-blue rounded-r-full"></div>
                    </div>

                    {/* External Link Section */}
                    <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-xl p-4 flex gap-3 items-center">
                        <Link className="w-5 h-5 text-neon-blue flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <label className="block text-[9px] text-neon-blue mb-1 uppercase tracking-widest font-mono font-bold">Enlace Externo</label>
                            {isEditing ? (
                                <input
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-transparent border-none text-white text-sm font-mono outline-none"
                                />
                            ) : (
                                link ? (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-gray-300 hover:text-white transition-colors truncate block">
                                        {link}
                                    </a>
                                ) : (
                                    <span className="text-sm font-mono text-gray-500 italic">// SIN ENLACE REGISTRADO</span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Meta Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-neon-blue" /> Fecha de Registro
                                </label>
                                <div className="text-sm text-gray-300 font-mono bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
                                    {new Date(task.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>

                            {task.isCompleted && task.completedAt && (
                                <div>
                                    <label className="block text-[10px] text-neon-green mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Fecha de Finalización
                                    </label>
                                    <div className="text-sm text-neon-green font-mono bg-neon-green/5 p-3 rounded-xl border border-neon-green/20">
                                        {new Date(task.completedAt).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">Asignatura</label>
                                <div className="flex items-center gap-3 bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
                                    <span className="px-2 py-0.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded text-[10px] font-black uppercase tracking-tighter">
                                        {task.subject?.code}
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">{task.subject?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Video Tracking Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                    <ShieldAlert className="w-3.5 h-3.5 text-neon-blue" /> Duración Total
                                </label>
                                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d] min-h-[48px] flex items-center">
                                    {isEditing ? (
                                        <input
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="Ej: 1h 20m..."
                                            className="w-full bg-transparent border-none text-sm text-gray-300 font-mono outline-none"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-300 font-mono">{duration || "// N/A"}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                    <RefreshCcw className="w-3.5 h-3.5 text-neon-blue" /> Punto de Reanudación
                                </label>
                                <div className="bg-[#0d1117] p-3 rounded-xl border border-neon-blue/20 min-h-[48px] flex items-center shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]">
                                    {isEditing ? (
                                        <input
                                            value={resumePoint}
                                            onChange={(e) => setResumePoint(e.target.value)}
                                            placeholder="Ej: 45:30..."
                                            className="w-full bg-transparent border-none text-sm text-neon-blue font-mono font-bold outline-none"
                                        />
                                    ) : (
                                        <span className="text-sm text-neon-blue font-mono font-bold">{resumePoint || "// SI_INICIAR"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-[#30363d] pt-8">
                        <label className="block text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-neon-blue" /> Notas y Observaciones
                        </label>
                        {isEditing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Escribe aquí instrucciones, dudas o pasos a seguir..."
                                className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl text-sm text-gray-200 font-sans outline-none focus:border-neon-blue/30 transition-all resize-none"
                            />
                        ) : (
                            <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-2xl min-h-[120px] text-sm text-gray-400 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                                {description || "// Sin notas adicionales."}
                            </div>
                        )}
                    </div>

                    {/* Completion Note (Optional) */}
                    <div className="border-t border-[#30363d] pt-8">
                        <label className="block text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-neon-green" /> Nota de Finalización
                        </label>
                        {isEditing ? (
                            <textarea
                                value={completionNote}
                                onChange={(e) => setCompletionNote(e.target.value)}
                                rows={3}
                                placeholder="Notas sobre lo aprendido al completar la tarea..."
                                className="w-full bg-[#0d1117] border border-green-500/20 p-4 rounded-xl text-sm text-gray-200 font-sans outline-none focus:border-green-500/40 transition-all resize-none"
                            />
                        ) : (
                            <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-2xl min-h-[60px] text-sm text-neon-green/60 italic leading-relaxed font-mono">
                                {completionNote || "// No se registró nota de finalización."}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-[#0d1117]/50 border-t border-[#30363d] flex justify-between items-center backdrop-blur-md">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all text-[10px] font-mono font-black uppercase tracking-widest group px-3 py-2 rounded-lg hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar Tarea</span>
                    </button>

                    <div className="flex gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 text-[10px] font-mono font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-neon-blue text-black px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-neon-blue/20"
                                >
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="flex items-center gap-3 border border-[#30363d] text-gray-300 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#21262d] hover:border-gray-500 transition-all font-mono group"
                            >
                                <Edit3 className="w-4 h-4 group-hover:text-neon-blue" />
                                Editar Tarea
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TaskDetailsModal({ task, isOpen, onClose, onUpdate, onDelete }) {
    if (!isOpen || !task) {
        return null;
    }

    return <TaskDetailsModalContent 
        task={task} 
        onClose={onClose} 
        onUpdate={onUpdate} 
        onDelete={onDelete} 
    />;
}
