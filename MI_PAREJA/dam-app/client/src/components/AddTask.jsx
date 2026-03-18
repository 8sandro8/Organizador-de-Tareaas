import { useState, useEffect } from 'react';
import { X, Plus, Link, AlignLeft, Calendar, Terminal, Shield } from 'lucide-react';

export default function AddTask({ subjects, onAddTask, isOpen, onClose, initialSubjectId }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState(initialSubjectId || '');
    const [type, setType] = useState('CLASE');
    const [link, setLink] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState('');
    const [resumePoint, setResumePoint] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSubjectId(initialSubjectId || '');
        }
    }, [isOpen, initialSubjectId]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !subjectId || isSaving) return;

        setIsSaving(true);
        setError(null);
        try {
            await onAddTask({ title, subjectId, type, date, link, description, duration, resumePoint });
            setTitle('');
            setDescription('');
            setSubjectId('');
            setType('CLASE');
            setLink('');
            setDuration('');
            setResumePoint('');
            onClose();
        } catch (err) {
            setError('Error de conexión con el Kernel');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-5 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-center shadow-lg">
                            <Plus className="w-4 h-4 text-neon-blue" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-neon-blue uppercase">Añadir Nueva Tarea</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="group">
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold group-focus-within:text-neon-blue transition-colors">Título de la Tarea</label>
                        <input
                            autoFocus
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                            placeholder="Ej: Ejercicio 1 - Bucles..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">Asignatura</label>
                            <select
                                required
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Seleccionar Módulo...</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">Tipo de Tarea</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="CLASE">CLASE</option>
                                <option value="EJERCICIO">EJERCICIO</option>
                                <option value="EXAMEN">EXAMEN</option>
                                <option value="PILDORAS">PÍLDORAS</option>
                                <option value="APUNTES">APUNTES</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Link className="w-3.5 h-3.5 text-neon-blue" /> Enlace Externo
                            </label>
                            <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-neon-blue" /> Fecha de Ejecución
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all cursor-pointer invert brightness-150 grayscale"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-neon-blue" /> Duración Total
                            </label>
                            <input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder="Ej: 1h 20m o 45:00..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 text-neon-blue" /> Punto de Reanudación
                            </label>
                            <input
                                value={resumePoint}
                                onChange={(e) => setResumePoint(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder="Ej: 15:30 o Minuto 20..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-neon-blue" /> Notas y Detalles
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none resize-none transition-all placeholder:text-gray-700"
                            placeholder="Anotaciones extra, dudas o pasos a seguir..."
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] font-mono font-bold text-red-500 uppercase">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`group w-full font-black py-4 rounded-xl text-sm transform transition-all uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 ${isSaving
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-neon-blue text-black hover:scale-[1.02] active:scale-95 shadow-neon-blue/10'
                            }`}
                    >
                        {isSaving ? (
                            <Plus className="w-5 h-5 animate-spin" />
                        ) : (
                            <Shield className="w-5 h-5 group-hover:animate-pulse" />
                        )}
                        {isSaving ? 'Estableciendo Conexión...' : 'Confirmar y Guardar Tarea'}
                    </button>
                </div>
            </form>
        </div>
    );
}
