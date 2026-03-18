import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, ShieldCheck, Check, Trash2, ExternalLink, Filter, Search, ChevronRight, RefreshCcw, Square, CheckSquare, Trash, FileText, Clipboard, Activity, ArrowLeft, BookOpen } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onDeleteTasks, filter, setFilter, searchTerm: externalSearchTerm, setSearchTerm: setExternalSearchTerm, onOpenDetails, theme = 'cyberpunk', selectedSubjectForFilter, setSelectedSubjectForFilter, subjects = [] }) {
    const { t } = useTranslation(['tasks', 'common', 'dashboard']);
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: null, id: null, ids: null });
    const [localSearch, setLocalSearch] = useState('');
    const isSanidad = theme === 'sanidad';

    // Debounce para el search - espera 300ms antes de actualizar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (setExternalSearchTerm) {
                setExternalSearchTerm(localSearch);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, setExternalSearchTerm]);

    // Sincronizar con searchTerm externo al inicio
    useEffect(() => {
        if (externalSearchTerm !== undefined) {
            setLocalSearch(externalSearchTerm);
        }
    }, []);

    const filterOptions = useMemo(() => isSanidad ? [
        { id: 'ALL', label: t('tasks.types.all', { defaultValue: 'Todas' }), color: 'bg-slate-600' },
        { id: 'CLASE', label: 'Clases', color: 'bg-[#007FFF]' },
        { id: 'EJERCICIO', label: 'Ejercicios', color: 'bg-purple-500' },
        { id: 'EXAMEN', label: 'Exámenes', color: 'bg-red-500' },
        { id: 'PILDORAS', label: 'Píldoras', color: 'bg-amber-500' },
        { id: 'APUNTES', label: 'Apuntes', color: 'bg-green-500' },
        { id: 'COMPLETADOS', label: t('tasks.types.completed', { defaultValue: 'Completados' }), color: 'bg-green-500 text-white font-semibold' },
    ] : [
        { id: 'ALL', label: t('tasks.types.all', { defaultValue: 'TODAS' }), color: 'bg-gray-700' },
        { id: 'CLASE', label: 'CLASES', color: 'bg-neon-blue' },
        { id: 'EJERCICIO', label: 'EJERCICIOS', color: 'bg-neon-purple' },
        { id: 'EXAMEN', label: 'EXÁMENES', color: 'bg-red-500' },
        { id: 'PILDORAS', label: 'PÍLDORAS', color: 'bg-yellow-500' },
        { id: 'APUNTES', label: 'APUNTES', color: 'bg-neon-green/80' },
        { id: 'COMPLETADOS', label: 'COMPLETADOS', color: 'bg-neon-green text-black font-black' },
    ], [isSanidad, t]);

    const styles = useMemo(() => ({
        container: isSanidad
            ? 'bg-white border border-slate-200 rounded-[1.25rem] h-[70vh] flex flex-col shadow-xl overflow-hidden'
            : 'bg-[#161b22] border border-[#30363d] rounded-2xl h-[70vh] flex flex-col shadow-2xl overflow-hidden relative',
        header: isSanidad
            ? 'p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50'
            : 'p-4 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]/50 backdrop-blur-md',
        headerIcon: isSanidad
            ? 'w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center'
            : 'w-8 h-8 bg-[#0d1117] border border-[#30363d] rounded-lg flex items-center justify-center',
        headerTitle: isSanidad
            ? 'text-sm font-semibold text-slate-700 tracking-wide uppercase'
            : 'text-xs font-mono font-bold text-white tracking-widest uppercase',
        headerSubtitle: isSanidad
            ? 'text-[10px] text-slate-400 font-medium'
            : 'text-neon-blue opacity-50 text-xs',
        searchInput: isSanidad
            ? 'w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 pl-11 text-sm text-slate-700 outline-none focus:border-[#007FFF] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400'
            : 'w-full bg-[#161b22] border border-[#30363d] rounded-xl p-2 pl-9 text-[11px] font-mono text-white outline-none focus:border-neon-blue/50 transition-all placeholder:text-gray-700',
        filterBtn: isSanidad
            ? 'px-4 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap shadow-sm'
            : 'px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border whitespace-nowrap',
        taskContainer: isSanidad
            ? 'group flex gap-3 pb-3 border border-transparent last:border-0 hover:bg-slate-50 px-4 py-4 rounded-2xl cursor-pointer'
            : 'group flex gap-3 pb-3 border border-transparent last:border-0 hover:bg-[#161b22] px-3 py-4 rounded-xl cursor-pointer',
        checkbox: isSanidad
            ? 'w-6 h-6 border-2 border-slate-300 rounded-lg flex items-center justify-center transition-all bg-white'
            : 'w-5 h-5 border-2 rounded flex items-center justify-center transition-all',
        checkboxSelected: isSanidad
            ? 'bg-[#007FFF] border-[#007FFF] text-white'
            : 'bg-neon-blue border-neon-blue text-black',
        taskCheckbox: isSanidad
            ? 'w-6 h-6 border-2 border-slate-300 rounded-lg flex items-center justify-center transition-all bg-white'
            : 'w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all',
        taskCheckboxDone: isSanidad
            ? 'bg-green-500 border-green-500 text-white scale-90'
            : 'bg-neon-green border-neon-green text-black scale-90',
        taskCheckboxExam: isSanidad
            ? 'border-red-500 bg-red-50'
            : 'border-red-500 bg-red-500/10',
        taskCheckboxDefault: isSanidad
            ? 'border-slate-300 hover:border-[#007FFF] bg-white'
            : 'border-[#30363d] hover:border-neon-blue bg-[#0d1117]',
        typeBadge: isSanidad
            ? 'text-[9px] text-white px-2 py-1 rounded-full font-semibold uppercase tracking-tight'
            : 'text-[8px] text-black px-2 py-0.5 rounded-md font-black uppercase tracking-tighter',
        typeBadgeExam: isSanidad ? 'bg-red-500 shadow-sm' : 'bg-red-500',
        typeBadgeEjercicio: 'bg-purple-500',
        typeBadgePildoras: 'bg-amber-500',
        typeBadgeApuntes: 'bg-green-500',
        typeBadgeClase: 'bg-[#007FFF]',
        taskTitle: isSanidad
            ? 'text-base text-slate-700 font-medium leading-tight'
            : 'text-[15px] sm:text-[16px] text-gray-200 leading-tight',
        taskTitleDone: isSanidad
            ? 'font-semibold text-green-600'
            : 'font-bold text-neon-green/90',
        taskMeta: isSanidad
            ? 'text-xs text-slate-400 font-medium'
            : 'text-[10px] text-gray-600 font-bold tracking-tighter',
        linkBtn: isSanidad
            ? 'h-full flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#007FFF] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#007FFF] hover:text-white transition-all shadow-sm'
            : 'h-full flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-black shadow-lg shadow-neon-blue/5',
        footer: isSanidad
            ? 'p-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md'
            : 'p-3 border-t border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md',
    }), [isSanidad]);

    useEffect(() => {
        setSelectedIds([]);
    }, [filter]);

    // Obtener asignaturas que tienen contenido en el filtro actual
    const subjectsWithContent = useMemo(() => {
        if (!tasks || tasks.length === 0) return [];
        if (!subjects || subjects.length === 0) return [];
        
        const subjectIdsWithContent = new Set();
        
        tasks.forEach(task => {
            if (!task || !task.subject || !task.subject.id) return;
            
            const subjectIdStr = String(task.subject.id);
            
            if (filter === 'ALL') {
                subjectIdsWithContent.add(subjectIdStr);
            } else if (filter === 'COMPLETADOS') {
                if (task.isCompleted) {
                    subjectIdsWithContent.add(subjectIdStr);
                }
            } else {
                if (!task.isCompleted && task.type === filter) {
                    subjectIdsWithContent.add(subjectIdStr);
                }
            }
        });
        
        return subjects.filter(s => subjectIdsWithContent.has(String(s.id)));
    }, [filter, tasks, subjects]);

    // Determinar si mostrar la vista de asignaturas
    const showSubjectsView = !selectedSubjectForFilter && subjectsWithContent.length > 0;

    const handleSubjectSelect = useCallback((subjectId) => {
        if (setSelectedSubjectForFilter) {
            setSelectedSubjectForFilter(subjectId);
        }
    }, [setSelectedSubjectForFilter]);

    const handleBackToSubjects = useCallback(() => {
        if (setSelectedSubjectForFilter) {
            setSelectedSubjectForFilter(null);
        }
    }, [setSelectedSubjectForFilter]);

    const handleFilterChange = useCallback((newFilter) => {
        setFilter(newFilter);
        if (setSelectedSubjectForFilter) {
            setSelectedSubjectForFilter(null);
        }
    }, [setFilter, setSelectedSubjectForFilter]);

    const handleSelectAll = useCallback(() => {
        if (selectedIds.length === tasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tasks.map(t => t.id));
        }
    }, [selectedIds.length, tasks]);

    const handleToggleSelect = useCallback((e, id) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteSelected = useCallback(() => {
        if (selectedIds.length > 0) {
            setDeleteConfirm({ 
                show: true, 
                type: 'multi', 
                id: null, 
                ids: selectedIds,
                message: t('tasks.confirmDelete.multiMessage', { count: selectedIds.length })
            });
        }
    }, [selectedIds.length, t]);

    const handleConfirmDelete = useCallback(() => {
        if (deleteConfirm.type === 'multi' && deleteConfirm.ids) {
            onDeleteTasks(deleteConfirm.ids);
            setSelectedIds([]);
        } else if (deleteConfirm.type === 'single' && deleteConfirm.id) {
            onDeleteTask(deleteConfirm.id);
        }
        setDeleteConfirm({ show: false, type: null, id: null, ids: null, message: '' });
    }, [deleteConfirm, onDeleteTasks, onDeleteTask]);

    const handleCancelDelete = useCallback(() => {
        setDeleteConfirm({ show: false, type: null, id: null, ids: null, message: '' });
    }, []);

    const handleDeleteTask = useCallback((taskId, taskTitle) => {
        setDeleteConfirm({ 
            show: true, 
            type: 'single', 
            id: taskId, 
            ids: null,
            message: t('tasks.confirmDelete.singleMessage')
        });
    }, [t]);

    const getTypeBadgeClass = useCallback((type) => {
        switch (type) {
            case 'EXAMEN': return styles.typeBadgeExam;
            case 'EJERCICIO': return isSanidad ? 'bg-purple-500' : 'bg-neon-purple';
            case 'PILDORAS': return isSanidad ? 'bg-amber-500' : 'bg-yellow-500';
            case 'APUNTES': return isSanidad ? 'bg-green-500' : 'bg-neon-green/80';
            default: return isSanidad ? styles.typeBadgeClase : 'bg-neon-blue';
        }
    }, [styles, isSanidad]);

    const getTypeLabel = useCallback((type) => {
        if (isSanidad) {
            return type;
        }
        return type === 'EXAMEN' ? 'CRITICAL_THREAT' : type;
    }, [isSanidad]);

    const renderTask = useCallback((task) => {
        const isUrgent = new Date(task.date) <= new Date(new Date().setHours(48));
        const isSelected = selectedIds.includes(task.id);
        const selectedClass = isSelected 
            ? (isSanidad ? 'bg-blue-50 border-blue-200' : 'bg-neon-blue/5 border-neon-blue/20 ring-1 ring-neon-blue/10')
            : '';
        const examClass = task.type === 'EXAMEN' && !task.isCompleted
            ? (isSanidad ? 'border-red-200 bg-red-50' : 'critical-threat-pulse border-red-500/30')
            : (isSanidad ? 'border-slate-100' : 'border-b-[#30363d]/30');
        
        return (
            <div
                key={task.id}
                className={`${styles.taskContainer} ${selectedClass} ${examClass}`}
                onClick={() => onOpenDetails(task)}
            >
                <button
                    onClick={(e) => handleToggleSelect(e, task.id)}
                    className="mt-0.5 relative z10 shrink-0"
                >
                    <div className={`${isSelected ? styles.checkboxSelected : styles.checkbox} ${isSanidad ? 'rounded-lg' : ''}`}>
                        {isSelected && <Check className={isSanidad ? 'w-4 h-4' : 'w-3.5 h-3.5 stroke-[4px]'} />}
                    </div>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                    className="mt-0.5 relative z10 shrink-0"
                >
                    <div className={`${task.isCompleted ? (isSanidad ? styles.taskCheckboxDone : styles.taskCheckboxDone) : task.type === 'EXAMEN' ? styles.taskCheckboxExam : styles.taskCheckboxDefault} ${styles.taskCheckbox}`}>
                        {task.isCompleted && <Check className={isSanidad ? 'w-4 h-4' : 'w-3.5 h-3.5 stroke-[4px]'} />}
                        {!task.isCompleted && task.type === 'EXAMEN' && <div className={`${isSanidad ? 'w-2 h-2 bg-red-500' : 'w-1.5 h-1.5 bg-red-500'} rounded-full`} />}
                    </div>
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`${styles.typeBadge} ${getTypeBadgeClass(task.type)}`}>
                            {getTypeLabel(task.type)}
                        </span>
                        <span className={styles.taskMeta} title={task.subject?.name}>
                            {task.subject?.code} - <span className={isSanidad ? 'text-slate-500' : 'text-gray-400'}>{task.subject?.name}</span>
                        </span>
                        {!task.isCompleted && (
                            <div className="flex items-center gap-1 ml-1">
                                <div className={`w-1 h-1 rounded-full ${
                                    task.type === 'EXAMEN' ? 'bg-red-500' :
                                    task.type === 'PILDORAS' ? 'bg-amber-500' :
                                    task.type === 'APUNTES' ? 'bg-green-500' : (isSanidad ? 'bg-[#007FFF]' : 'bg-neon-blue')
                                }`}></div>
                                <span className={`text-[7px] font-black uppercase ${isSanidad ? 'text-slate-400 tracking-wide' : 'opacity-80 tracking-widest'} ${
                                    task.type === 'EXAMEN' ? 'text-red-500' :
                                    task.type === 'PILDORAS' ? 'text-amber-500' :
                                    task.type === 'APUNTES' ? 'text-green-500' : (isSanidad ? 'text-[#007FFF]' : 'text-neon-blue')
                                }`}>
                                    {t('tasks.list.active')}
                                </span>
                            </div>
                        )}
                        {task.duration && (
                            <span className={`${isSanidad ? 'text-xs bg-slate-100 border border-slate-200 text-slate-500 px-2 py-1 rounded-lg' : 'text-[8px] bg-[#161b22] border border-[#30363d] text-gray-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono'}`}>
                                <Activity className={isSanidad ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} /> {task.duration}
                            </span>
                        )}
                        {task.resumePoint && (
                            <span className={`${isSanidad ? 'text-xs bg-blue-50 border border-blue-100 text-[#007FFF] px-2 py-1 rounded-lg font-medium' : 'text-[8px] bg-neon-blue/10 border border-neon-blue/20 text-neon-blue px-1.5 py-0.5 rounded flex items-center gap-1 font-bold'}`}>
                                <RefreshCcw className={isSanidad ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} /> {t('tasks.list.resume')} {task.resumePoint}
                            </span>
                        )}
                        {isUrgent && !task.isCompleted && (
                            <span className={`text-[7px] ${isSanidad ? 'text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-full font-semibold' : 'text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded-md uppercase font-bold'}`}>
                                {t('tasks.list.urgent')}
                            </span>
                        )}
                        <div className="flex flex-col items-end ml-auto text-[10px] leading-tight shrink-0 min-w-[60px]">
                            <span className={`uppercase ${isSanidad ? 'opacity-60 text-slate-400 font-medium' : 'opacity-60 text-gray-500 font-bold'}`}>
                                {task.isCompleted ? t('tasks.list.completed') : t('tasks.list.created')}
                            </span>
                            <span className={`font-bold ${task.isCompleted ? (isSanidad ? 'text-green-600' : 'text-neon-green/80') : (isSanidad ? 'text-slate-400' : 'text-gray-700')}`}>
                                {task.isCompleted && task.completedAt
                                    ? new Date(task.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                    : task.date ? new Date(task.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '--/--'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 pr-8 sm:pr-0">
                        <p className={`${styles.taskTitle} ${task.isCompleted ? styles.taskTitleDone : ''}`}>
                            {task.title}
                        </p>
                    </div>
                    {task.isCompleted && task.completionNote && (
                        <div className={`mt-2 ${isSanidad ? 'bg-green-50 border-l-4 border-green-300 px-4 py-3 rounded-r-lg' : 'bg-neon-green/5 border-l-2 border-neon-green/30 px-3 py-2 rounded-r-lg'}`}>
                            <p className={`${isSanidad ? 'text-sm text-green-700 font-medium leading-relaxed' : 'text-[11px] text-neon-green/80 font-mono leading-relaxed italic'}`}>
                                <span className={`font-bold ${isSanidad ? 'text-green-800' : 'uppercase tracking-tighter mr-1'}`}>
                                    {t('tasks.details.completionNote')}:
                                </span>
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
                        className={styles.linkBtn}
                    >
                        <ExternalLink className={isSanidad ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                        <span>{isSanidad ? t('tasks.details.openLink') : t('tasks.list.launch')}</span>
                    </a>
                )}

                <button
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteTask(task.id, task.title);
                    }}
                    className={`${isSanidad ? 'opacity-100 sm:opacity-0 group-hover:opacity-100 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-center' : 'opacity-100 sm:opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all self-center relative z10 shrink-0'}`}
                >
                    <Trash2 className={isSanidad ? 'w-5 h-5 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-4 sm:h-4'} />
                </button>

                {!isSanidad && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-neon-blue rounded-full"></div>
                )}
            </div>
        );
    }, [styles, getTypeBadgeClass, getTypeLabel, handleToggleSelect, isSanidad, onToggleTask, onOpenDetails, selectedIds, task, t, handleDeleteTask]);

    const renderContent = () => {
        if (showSubjectsView) {
            const filterLabel = filterOptions.find(f => f.id === filter)?.label || filter;
            return (
                <div className="space-y-3">
                    <div className={`text-center py-3 mb-4 ${isSanidad ? 'bg-blue-50 border border-blue-100 rounded-xl' : 'bg-[#161b22] border border-[#30363d] rounded-xl'}`}>
                        <p className={`text-xs font-semibold ${isSanidad ? 'text-[#007FFF]' : 'text-neon-blue'}`}>
                            {t('tasks.list.selectSubject')} ({filterLabel})
                        </p>
                    </div>
                    {subjectsWithContent.map(subject => (
                        <div
                            key={subject.id}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`${styles.taskContainer} ${isSanidad ? 'hover:border-blue-200 hover:bg-blue-50' : 'hover:border-neon-blue/30 hover:bg-[#161b22]'}`}
                        >
                            <div className={`${isSanidad ? 'w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center' : 'w-10 h-10 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-center'}`}>
                                <BookOpen className={`${isSanidad ? 'w-5 h-5 text-[#007FFF]' : 'w-5 h-5 text-neon-blue'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`${isSanidad ? 'text-sm font-semibold text-slate-700' : 'text-sm font-bold text-white'}`}>
                                        {subject.name}
                                    </span>
                                    <span className={`${isSanidad ? 'text-xs text-slate-400' : 'text-[10px] text-gray-500 font-mono'}`}>
                                        {subject.code}
                                    </span>
                                </div>
                                <p className={`${isSanidad ? 'text-xs text-slate-400' : 'text-[10px] text-gray-600 font-mono'}`}>
                                    {tasks.filter(t => {
                                        if (!t || !t.subject) return false;
                                        if (String(t.subject.id) !== String(subject.id)) return false;
                                        if (filter === 'ALL') return true;
                                        if (filter === 'COMPLETADOS') return t.isCompleted;
                                        return !t.isCompleted && t.type === filter;
                                    }).length} {t('tasks.list.elements')}
                                </p>
                            </div>
                            <ChevronRight className={`${isSanidad ? 'w-5 h-5 text-slate-300' : 'w-5 h-5 text-gray-600'}`} />
                        </div>
                    ))}
                </div>
            );
        }

        if (selectedSubjectForFilter) {
            return (
                <div className="space-y-3">
                    <button
                        onClick={handleBackToSubjects}
                        className={`flex items-center gap-2 w-full mb-4 py-2 px-3 rounded-xl transition-colors ${
                            isSanidad 
                                ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-[#007FFF]' 
                                : 'bg-[#161b22] border border-[#30363d] text-gray-400 hover:border-neon-blue/30 hover:text-neon-blue'
                        }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-semibold">{t('tasks.list.backToSubjects')}</span>
                    </button>
                    {tasks.length === 0 ? (
                        <div className={`text-center mt-16 py-10 border-2 border-dashed ${isSanidad ? 'border-slate-200 bg-slate-50' : 'border-[#30363d]' } rounded-3xl`}>
                            <ShieldCheck className={`w-12 h-12 mx-auto ${isSanidad ? 'text-green-400 opacity-40 mb-3' : 'opacity-10 mb-3'} ${isSanidad ? '' : 'text-neon-blue'}`} />
                            <p className={`text-xs uppercase tracking-[0.2em] ${isSanidad ? 'text-slate-400' : ''}`}>{t('tasks.list.noTasksCategory')}</p>
                        </div>
                    ) : (
                        tasks.map(task => renderTask(task))
                    )}
                </div>
            );
        }

        if (tasks.length === 0) {
            return (
                <div className={`text-center mt-16 py-10 border-2 border-dashed ${isSanidad ? 'border-slate-200 bg-slate-50' : 'border-[#30363d]' } rounded-3xl`}>
                    <ShieldCheck className={`w-12 h-12 mx-auto ${isSanidad ? 'text-green-400 opacity-40 mb-3' : 'opacity-10 mb-3'} ${isSanidad ? '' : 'text-neon-blue'}`} />
                    <p className={`text-xs uppercase tracking-[0.2em] ${isSanidad ? 'text-slate-400' : ''}`}>{t('tasks.list.noTasks')}</p>
                </div>
            );
        }

        return tasks.map(task => renderTask(task));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className="flex items-center gap-3">
                    <div className={styles.headerIcon}>
                        {isSanidad ? <Clipboard className="w-5 h-5 text-[#007FFF]" /> : <Terminal className="w-4 h-4 text-neon-blue" />}
                    </div>
                    <div>
                        <h2 className={styles.headerTitle}>
                            {t('tasks.list.title')} 
                            <span className={styles.headerSubtitle}> {isSanidad ? 'v5.0' : t('tasks.list.subtitle')}</span>
                        </h2>
                    </div>
                </div>
                {!isSanidad && (
                    <div className="flex gap-1.5 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-50"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-50"></div>
                    </div>
                )}
            </div>

            {tasks.length > 0 && (
                <div className={isSanidad ? 'bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between' : 'bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between'}>
                    <button
                        onClick={handleSelectAll}
                        className={`flex items-center gap-2 ${isSanidad ? 'text-sm font-medium text-slate-500 hover:text-[#007FFF]' : 'text-[10px] font-mono font-bold text-gray-500 hover:text-neon-blue'} transition-colors`}
                    >
                        {selectedIds.length === tasks.length ? <CheckSquare className={isSanidad ? 'w-5 h-5' : 'w-3.5 h-3.5'} /> : <Square className={isSanidad ? 'w-5 h-5' : 'w-3.5 h-3.5'} />}
                        <span>{selectedIds.length === tasks.length ? t('tasks.list.deselectAll') : t('tasks.list.selectAll')}</span>
                    </button>

                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className={`flex items-center gap-2 ${isSanidad ? 'bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-500 hover:text-white transition-all' : 'bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-1 rounded-lg text-[10px] font-mono font-black hover:bg-red-500 hover:text-white transition-all'}`}
                        >
                            <Trash className={isSanidad ? 'w-4 h-4' : 'w-3 h-3'} />
                            <span>{t('tasks.list.deleteSelected')} {selectedIds.length}</span>
                        </button>
                    )}
                </div>
            )}

            <div className={isSanidad ? 'bg-white p-4 border-b border-slate-100' : 'bg-[#0d1117] p-3 border-b border-[#30363d]'}>
                <div className="relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isSanidad ? 'text-slate-400 group-focus-within:text-[#007FFF]' : 'text-gray-600 group-focus-within:text-neon-blue'} transition-colors`} />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder={t('tasks.list.searchPlaceholder')}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={isSanidad ? 'bg-white p-3 border-b border-slate-100 flex gap-2 overflow-x-auto' : 'bg-[#0d1117] p-2 border-b border-[#30363d] flex gap-2 overflow-x-auto no-scrollbar custom-scrollbar'}>
                {filterOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => handleFilterChange(opt.id)}
                        className={`${styles.filterBtn} ${filter === opt.id
                            ? `${opt.color} text-white border-transparent shadow-lg ${isSanidad ? '' : 'shadow-white/5'}`
                            : isSanidad ? 'text-slate-500 border-slate-200 hover:border-slate-300' : 'text-gray-500 border-gray-800 hover:border-gray-600'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${isSanidad ? 'font-sans text-sm' : 'font-mono text-sm'} custom-scrollbar`}>
                {renderContent()}
            </div>

            <div className={styles.footer}>
                <div className={`flex items-center justify-between ${isSanidad ? 'text-slate-400 text-xs font-medium' : 'text-gray-600 text-[9px] font-mono font-bold uppercase tracking-widest'}`}>
                    <div className="flex items-center gap-2">
                        <Filter className={isSanidad ? 'w-4 h-4' : 'w-3 h-3'} />
                        <div className="flex items-center gap-1">
                            <span>{t('tasks.list.total')}: {tasks.length}</span>
                            {selectedIds.length > 0 && (
                                <span className={isSanidad ? 'text-[#007FFF] ml-2 font-semibold' : 'text-neon-blue ml-2'}>
                                    | {t('tasks.list.selected')}: {selectedIds.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 ${isSanidad ? 'text-[#007FFF] cursor-help' : 'text-neon-blue cursor-help'}`}>
                        <ChevronRight className={isSanidad ? 'w-4 h-4' : 'w-3 h-3'} />
                        <span>{t('tasks.list.systemReady')}</span>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={t('tasks.confirmDelete.title')}
                message={deleteConfirm.message || t('tasks.confirmDelete.singleMessage')}
                confirmText={t('tasks.confirmDelete.confirm')}
                cancelText={t('tasks.confirmDelete.cancel')}
                type="danger"
            />
        </div>
    );
}