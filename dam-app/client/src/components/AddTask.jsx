import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Link, AlignLeft, Calendar, Terminal, Shield } from 'lucide-react';

export default function AddTask({ subjects, onAddTask, isOpen, onClose, initialSubjectId }) {
    const { t } = useTranslation(['tasks', 'common']);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState(initialSubjectId || '');
    const [type, setType] = useState('CLASE');
    const [link, setLink] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState('');
    const [resumePoint, setResumePoint] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSubjectId(initialSubjectId || '');
        }
    }, [isOpen, initialSubjectId]);

    const getErrorMessage = useCallback((errorKey) => {
        return t(`tasks.add.errors.${errorKey}`) || errorKey;
    }, [t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError(getErrorMessage('titleRequired'));
            return;
        }
        if (trimmedTitle.length < 3) {
            setError(getErrorMessage('titleMinLength'));
            return;
        }
        if (trimmedTitle.length > 100) {
            setError(getErrorMessage('titleMaxLength'));
            return;
        }
        if (!subjectId) {
            setError(getErrorMessage('selectSubject'));
            return;
        }
        
        // Validar URL si se proporciona
        if (link && link.trim()) {
            try {
                new URL(link);
            } catch {
                setError(getErrorMessage('invalidUrl'));
                return;
            }
        }

        if (isSaving) return;

        setIsSaving(true);
        setError(null);
        
        try {
            await onAddTask({ 
                title: trimmedTitle, 
                subjectId, 
                type, 
                date, 
                link: link.trim(), 
                description: description.trim(), 
                duration: duration.trim(), 
                resumePoint: resumePoint.trim() 
            });
        } catch (err) {
            setError(getErrorMessage('connectionError'));
            setIsSaving(false);
            return;
        }
        
        // Resetear campos
        setTitle('');
        setDescription('');
        setSubjectId('');
        setType('CLASE');
        setLink('');
        setDuration('');
        setResumePoint('');
        
        setIsSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <form onSubmit={handleSubmit} className="relative w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl duration-200">
                <div className="p-5 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-center shadow-lg">
                            <Plus className="w-4 h-4 text-neon-blue" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-neon-blue uppercase">{t('tasks.add.title')}</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="group">
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold group-focus-within:text-neon-blue transition-colors">{t('tasks.add.title')}</label>
                        <input
                            autoFocus
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                            placeholder={t('tasks.add.titlePlaceholder')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">{t('tasks.add.subject')}</label>
                            <select
                                required
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">{t('tasks.add.errors.selectSubject')}</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold">{t('tasks.add.type')}</label>
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
                                <Link className="w-3.5 h-3.5 text-neon-blue" /> {t('tasks.add.externalLink')}
                            </label>
                            <input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                placeholder={t('tasks.add.linkPlaceholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-neon-blue" /> {t('tasks.add.executionDate')}
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
                                <Shield className="w-3.5 h-3.5 text-neon-blue" /> {t('tasks.add.totalDuration')}
                            </label>
                            <input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder={t('tasks.add.durationPlaceholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 text-neon-blue" /> {t('tasks.add.resumePoint')}
                            </label>
                            <input
                                value={resumePoint}
                                onChange={(e) => setResumePoint(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none transition-all placeholder:text-gray-700"
                                placeholder={t('tasks.add.resumePlaceholder')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                            <AlignLeft className="w-3.5 h-3.5 text-neon-blue" /> {t('tasks.add.notes')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-white text-sm focus:border-neon-blue/50 outline-none resize-none transition-all placeholder:text-gray-700"
                            placeholder={t('tasks.add.notesPlaceholder')}
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
                        {isSaving ? t('tasks.add.savingButton') : t('tasks.add.saveButton')}
                    </button>
                </div>
            </form>
        </div>
    );
}