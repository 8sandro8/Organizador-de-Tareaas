import { Monitor, Plus, Settings, Flame, Trophy, Stethoscope, Activity, LogOut } from 'lucide-react';
import api from '../services/api';

export default function Header({ subjectCount, stability, onOpenAddModal, onOpenSettings, gamification, theme = 'cyberpunk', onLogout }) {
    const isSanidad = theme === 'sanidad';
    const { level = 1, xp = 0, streak = 0 } = gamification || {};
    const xpToNextLevel = level * 1000;
    const xpProgress = (xp / xpToNextLevel) * 100;

    const styles = {
        header: isSanidad
            ? 'sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 box-shadow-lg'
            : 'sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d]',
        logoIcon: isSanidad
            ? 'w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-sm'
            : 'w-12 h-12 bg-neon-blue/10 border border-neon-blue/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.1)]',
        logoIconInner: isSanidad
            ? 'w-8 h-8 text-[#007FFF]'
            : 'w-6 h-6 text-neon-blue animate-pulse',
        title: isSanidad
            ? 'text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2'
            : 'text-xl font-black text-white tracking-tighter flex items-center gap-2 uppercase',
        titleAccent: isSanidad
            ? 'text-[#007FFF]'
            : 'text-neon-blue',
        subtitleDot: isSanidad
            ? 'w-2 h-2 rounded-full bg-green-500'
            : 'w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14]',
        subtitleText: isSanidad
            ? 'text-xs font-medium text-slate-500 uppercase tracking-wide leading-none'
            : 'text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest leading-none',
        statsBorder: isSanidad
            ? 'border-x border-slate-200/50'
            : 'border-x border-[#30363d]/50',
        levelLabel: isSanidad
            ? 'text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1'
            : 'text-[8px] font-mono text-gray-600 uppercase tracking-widest font-black mb-1',
        streakLabel: isSanidad
            ? 'text-[10px] font-semibold text-orange-500/70 uppercase tracking-tight'
            : 'text-[8px] font-mono text-orange-500/50 uppercase tracking-tighter font-black',
        stabilityLabel: isSanidad
            ? 'text-xs font-medium text-slate-500 uppercase tracking-wide leading-none mb-1 text-right'
            : 'text-[9px] font-mono text-gray-600 uppercase tracking-widest leading-none mb-1 text-right',
        progressBar: isSanidad
            ? 'w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200'
            : 'w-32 h-1.5 bg-black/40 rounded-full overflow-hidden border border-[#30363d]',
        progressFill: isSanidad
            ? 'h-full bg-gradient-to-r from-[#007FFF] to-[#0ea5e9] transition-all duration-500'
            : 'h-full bg-neon-blue shadow-[0_0_10px_#00f0ff88] transition-all duration-500',
        streakBg: isSanidad
            ? 'flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-100 rounded-2xl'
            : 'flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-xl',
        stabilityBar: isSanidad
            ? 'w-24 h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden'
            : 'w-24 h-1.5 bg-[#161b22] border border-[#30363d] rounded-full overflow-hidden',
        streakValue: isSanidad
            ? 'text-sm font-bold text-slate-800 leading-none'
            : 'text-xs font-black text-white leading-none',
        stabilityValue: isSanidad
            ? 'text-xs font-bold text-slate-700'
            : 'text-[10px] font-mono font-black',
        actionBtn: isSanidad
            ? 'p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-[#007FFF] hover:border-[#007FFF]/30 transition-all group'
            : 'p-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-gray-500 hover:text-neon-purple hover:border-neon-purple/50 transition-all group',
        settingsBtn: isSanidad
            ? 'p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-[#007FFF] hover:border-[#007FFF]/30 transition-all group'
            : 'p-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-gray-500 hover:text-neon-blue hover:border-neon-blue/50 transition-all group',
        addBtn: isSanidad
            ? 'flex items-center gap-3 bg-[#007FFF] text-white px-6 py-3 rounded-2xl font-semibold text-sm uppercase tracking-wide hover:scale-[1.03] active:scale-95 transition-all shadow-lg hover:shadow-[#007FFF]/30 group'
            : 'flex items-center gap-3 bg-neon-blue text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] group',
    };

    return (
        <header className={`sticky top-0 z-40 ${isSanidad ? 'bg-white/90 backdrop-blur-md border-b border-slate-200' : 'bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d]'} box-border pt-[env(safe-area-inset-top)]`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={styles.logoIcon}>
                            {isSanidad ? (
                                <Stethoscope className={styles.logoIconInner} />
                            ) : (
                                <Monitor className={styles.logoIconInner} />
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <h1 className={styles.title}>
                                <span className={styles.titleAccent}>
                                    {isSanidad ? 'SANIDAD' : 'DAM'}
                                </span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={styles.subtitleDot}></div>
                                <span className={styles.subtitleText}>
                                    {isSanidad ? 'Sistema activo' : 'Kernel_Online'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`flex-1 max-w-xl hidden md:flex items-center gap-6 px-6 ${styles.statsBorder}`}>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle 
                                    cx="20" cy="20" r="18" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    fill="transparent" 
                                    className={isSanidad ? 'text-slate-200' : 'text-[#30363d]'} 
                                />
                                <circle 
                                    cx="20" cy="20" r="18" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    fill="transparent" 
                                    strokeDasharray={113} 
                                    strokeDashoffset={113 - (113 * xpProgress) / 100} 
                                    className={isSanidad ? 'text-yellow-500' : 'text-yellow-500'} 
                                    style={{ filter: isSanidad ? 'none' : 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.6))' }} 
                                />
                            </svg>
                            <span className={`text-xs font-black z-10 ${isSanidad ? 'text-slate-700' : 'text-white'}`}>{level}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={styles.levelLabel}>
                                {isSanidad ? 'Nivel' : 'Cyber_Level'}
                            </span>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.streakBg}>
                        <Flame className={`w-5 h-5 ${streak > 0 ? (isSanidad ? 'text-orange-500' : 'text-orange-500 animate-bounce') : (isSanidad ? 'text-slate-300' : 'text-gray-700')}`} />
                        <div className="flex flex-col">
                            <span className={styles.streakLabel}>
                                {isSanidad ? 'Racha' : 'Streak'}
                            </span>
                            <span className={styles.streakValue}>{streak}D</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-end">
                        <span className={styles.stabilityLabel}>
                            {isSanidad ? 'Estabilidad del sistema' : 'System_Stability'}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className={styles.stabilityBar}>
                                <div
                                    className={`h-full transition-all duration-1000 ${stability > 50 ? (isSanidad ? 'bg-green-500' : 'bg-neon-green') : 'bg-red-500'}`}
                                    style={{ width: `${stability}%` }}
                                ></div>
                            </div>
                            <span className={stability > 50 ? (isSanidad ? 'text-green-600 font-semibold' : 'text-neon-green font-black') : 'text-red-500 font-black'}>
                                {stability}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={async () => {
                            try {
                                const response = await api.get('/reports/weekly', { responseType: 'blob' });
                                const blob = response.data;
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `Reporte_${new Date().toLocaleDateString()}.md`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                            } catch (err) {
                                console.error("Report extraction failed:", err);
                            }
                        }}
                        className={styles.actionBtn}
                        title={isSanidad ? 'Generar Reporte Semanal' : 'Generar Reporte Semanal'}
                    >
                        <Trophy className={isSanidad ? 'w-5 h-5' : 'w-4 h-4'} />
                    </button>
                    <button
                        onClick={onLogout}
                        className={styles.actionBtn}
                        title={isSanidad ? 'Cerrar Sesión' : 'Cerrar Sesión'}
                    >
                        <LogOut className={isSanidad ? 'w-5 h-5' : 'w-4 h-4'} />
                    </button>
                    <button
                        onClick={onOpenSettings}
                        className={styles.settingsBtn}
                        title={isSanidad ? 'Configuración de Módulos' : 'Configuración de Módulos'}
                    >
                        <Settings className={isSanidad ? 'w-5 h-5' : 'w-4 h-4'} />
                    </button>
                    <button
                        onClick={onOpenAddModal}
                        className={styles.addBtn}
                    >
                        <Plus className={`w-5 h-5 ${isSanidad ? '' : 'group-hover:rotate-90 transition-transform duration-300'}`} />
                        <span className="hidden sm:inline">
                            {isSanidad ? 'Nueva Tarea' : 'Nueva Tarea'}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
