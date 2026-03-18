import { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Plus, Trash2, Edit2, Check, Save } from 'lucide-react';

export default function SubjectManagerModal({ isOpen, onClose, onUpdate }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', code: '', icon: '' });
    const [newForm, setNewForm] = useState({ name: '', code: '', icon: '📚' });

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
        }
    }, [isOpen]);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects');
            setSubjects(res.data);
        } catch (err) {
            console.error("Error fetching subjects:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/subjects', newForm);
            setNewForm({ name: '', code: '', icon: '📚' });
            fetchSubjects();
            onUpdate();
        } catch (err) {
            console.error("Error adding subject:", err);
        }
    };

    const handleUpdateSubject = async (id) => {
        try {
            await api.put(`/subjects/${id}`, editForm);
            setEditingId(null);
            fetchSubjects();
            onUpdate();
        } catch (err) {
            console.error("Error updating subject:", err);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm("¿Seguro que quieres borrar este módulo? Se borrarán sus tareas asociadas.")) return;
        try {
            await api.delete(`/subjects/${id}`);
            fetchSubjects();
            onUpdate();
        } catch (err) {
            console.error("Error deleting subject:", err);
        }
    };

    const startEditing = (subj) => {
        setEditingId(subj.id);
        setEditForm({ name: subj.name, code: subj.code, icon: subj.icon || '📚' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-neon-blue/20">
                <div className="p-6 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]/50">
                    <h2 className="text-xl font-mono font-bold text-white flex items-center gap-3">
                        <Edit2 className="w-5 h-5 text-neon-blue" />
                        GESTOR DE MÓDULOS
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-[#30363d] rounded-xl transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Add New Subject */}
                    <div className="bg-black/40 border border-[#30363d] p-4 rounded-2xl">
                        <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">Añadir Nuevo Módulo</h3>
                        <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <input
                                type="text"
                                placeholder="Nombre (ej: Programación)"
                                className="sm:col-span-5 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm focus:border-neon-blue outline-none transition-colors"
                                value={newForm.name}
                                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Código (ej: 08)"
                                className="sm:col-span-3 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm focus:border-neon-blue outline-none transition-colors upper"
                                value={newForm.code}
                                onChange={e => setNewForm({ ...newForm, code: e.target.value.toUpperCase() })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Icono"
                                className="sm:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm text-center focus:border-neon-blue outline-none transition-colors"
                                value={newForm.icon}
                                onChange={e => setNewForm({ ...newForm, icon: e.target.value })}
                            />
                            <button
                                type="submit"
                                className="sm:col-span-2 bg-neon-blue text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <div className="sm:col-span-12 text-[10px] text-gray-500 font-mono mt-2 pl-2 border-l-2 border-[#30363d]">
                                <span className="text-neon-blue">💡 Tip Iconos:</span> Usa Emojis del teclado en <kbd className="bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">Win + .</kbd> (Windows) o <kbd className="bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">Cmd + Ctrl + Espacio</kbd> (Mac)
                            </div>
                        </form>
                    </div>

                    {/* Subject List */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Módulos Existentes</h3>
                        {loading ? (
                            <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>
                        ) : subjects.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-[#30363d] rounded-2xl text-gray-600 text-xs font-mono italic">No hay módulos registrados</div>
                        ) : (
                            subjects.map(subj => (
                                <div key={subj.id} className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-2xl group transition-all hover:border-gray-600">
                                    {editingId === subj.id ? (
                                        <div className="flex-1 grid grid-cols-12 gap-2">
                                            <input
                                                className="col-span-6 bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs outline-none"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <input
                                                className="col-span-3 bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs outline-none"
                                                value={editForm.code}
                                                onChange={e => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                                            />
                                            <input
                                                className="col-span-3 bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs outline-none text-center"
                                                value={editForm.icon}
                                                onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-xl w-8 text-center">{subj.icon || '📚'}</span>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white uppercase">{subj.name}</div>
                                                <div className="text-[10px] font-mono text-neon-blue/60 tracking-wider">CODE: {subj.code}</div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex gap-1">
                                        {editingId === subj.id ? (
                                            <button onClick={() => handleUpdateSubject(subj.id)} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"><Check className="w-4 h-4" /></button>
                                        ) : (
                                            <button onClick={() => startEditing(subj)} className="p-2 bg-neon-blue/10 text-neon-blue rounded-lg hover:bg-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
                                        )}
                                        <button onClick={() => handleDeleteSubject(subj.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
