import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Pencil } from 'lucide-react';

export default function QuickNotes() {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('dam_quick_notes');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: 'Revisar apuntes de Programación', completed: false },
            { id: 2, text: 'Configurar entorno de red', completed: true }
        ];
    });
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        localStorage.setItem('dam_quick_notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const newNote = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false
        };
        setNotes([newNote, ...notes]);
        setInputValue('');
    };

    const toggleNote = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, completed: !note.completed } : note
        ));
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const clearCompleted = () => {
        setNotes(notes.filter(note => !note.completed));
    };

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl flex flex-col shadow-2xl overflow-hidden h-fit max-h-[400px]">
            <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#1c2128]">
                <div className="flex items-center gap-3">
                    <Pencil className="w-4 h-4 text-neon-green" />
                    <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Notas_Rápidas</h3>
                </div>
                {notes.some(n => n.completed) && (
                    <button
                        onClick={clearCompleted}
                        className="text-[8px] font-mono text-gray-500 hover:text-red-400 uppercase tracking-tighter transition-colors"
                    >
                        Limpiar completadas
                    </button>
                )}
            </div>

            <form onSubmit={addNote} className="p-3 border-b border-[#30363d]/50 bg-[#0d1117]/30">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Añadir nota rápida..."
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-2 px-4 pr-10 text-xs text-gray-300 font-sans focus:border-neon-green/50 outline-none transition-all placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neon-green hover:scale-110 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {notes.length === 0 ? (
                    <div className="py-8 text-center text-gray-600 italic font-mono text-[10px] uppercase tracking-widest">
                        Sin notas pendientes
                    </div>
                ) : (
                    notes.map(note => (
                        <div
                            key={note.id}
                            className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${note.completed
                                    ? 'bg-black/20 border-transparent opacity-50'
                                    : 'bg-[#1c2128]/50 border-[#30363d] hover:border-[#444c56]'
                                }`}
                        >
                            <button
                                onClick={() => toggleNote(note.id)}
                                className={`transition-transform active:scale-90 ${note.completed ? 'text-neon-green' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {note.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </button>

                            <span className={`flex-1 text-xs transition-all duration-300 ${note.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                                {note.text}
                            </span>

                            <button
                                onClick={() => deleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
