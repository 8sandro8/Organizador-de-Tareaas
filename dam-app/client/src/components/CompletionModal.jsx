import { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Terminal } from 'lucide-react';

export default function CompletionModal({ isOpen, onClose, onConfirm, taskTitle }) {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onConfirm(note);
        setNote('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-[#0d1117] border border-neon-green/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,163,0.1)] duration-200">
                {/* Header */}
                <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neon-green/10 border border-neon-green/20 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-neon-green" />
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-neon-green uppercase">Finalizar Misión</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">// TAREA_A_COMPLETAR</span>
                        <h3 className="text-lg font-bold text-white leading-tight">{taskTitle}</h3>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                            <MessageSquare className="w-3.5 h-3.5 text-neon-green" />
                            ¿Qué hemos aprendido hoy? (Opcional)
                        </label>
                        <textarea
                            autoFocus
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ej: Hoy vimos el patrón MVC en Java, muy útil para la arquitectura del backend..."
                            className="w-full bg-[#161b22] border border-[#30363d] focus:border-neon-green/50 p-4 rounded-xl text-sm text-gray-200 font-sans outline-none transition-all resize-none h-32"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-mono text-neon-green/50 animate-pulse">
                        <Terminal className="w-3 h-3" />
                        <span>PREPARANDO_LOG_PARA_EL_HISTORIAL...</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#161b22] border-t border-[#30363d] flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl border border-[#30363d] text-gray-400 font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-[#21262d] transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-[2] bg-neon-green text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-neon-green/20"
                    >
                        Completar Tarea
                    </button>
                </div>
            </div>
        </div>
    );
}
