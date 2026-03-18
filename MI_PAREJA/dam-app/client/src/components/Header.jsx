import { Monitor, Plus, Settings, Flame, Trophy } from 'lucide-react';
import api from '../services/api';

export default function Header({ subjectCount, stability, onOpenAddModal, onOpenSettings, gamification }) {
    const { level = 1, xp = 0, streak = 0 } = gamification || {};
    const xpToNextLevel = level * 1000;
    const xpProgress = (xp / xpToNextLevel) * 100;

    return (
        <header className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d] box-border pt-[env(safe-area-inset-top)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo & Info */}
                <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neon-blue/10 border border-neon-blue/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                            <Monitor className="w-6 h-6 text-neon-blue animate-pulse" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2 uppercase">
                                <span className="text-neon-blue">Administrativa sanitaria</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_#39ff14]"></div>
                                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest leading-none">Kernel_Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamification Center */}
                <div className="flex-1 max-w-xl hidden md:flex items-center gap-6 px-6 border-x border-[#30363d]/50">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-[#30363d]" />
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={113} strokeDashoffset={113 - (113 * xpProgress) / 100} className="text-yellow-500 transition-all duration-1000" style={{ filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.6))' }} />
                            </svg>
                            <span className="text-xs font-black text-white z-10">{level}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest font-black mb-1">Cyber_Level</span>
                            <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden border border-[#30363d]">
                                <div
                                    className="h-full bg-neon-blue shadow-[0_0_10px_#00f0ff88] transition-all duration-500"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                        <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-bounce' : 'text-gray-700'}`} />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-mono text-orange-500/50 uppercase tracking-tighter font-black">Streak</span>
                            <span className="text-xs font-black text-white leading-none">{streak}D</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-end">
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest leading-none mb-1 text-right">System_Stability</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-[#161b22] border border-[#30363d] rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${stability > 50 ? 'bg-neon-green' : 'bg-red-500'}`}
                                    style={{ width: `${stability}%` }}
                                ></div>
                            </div>
                            <span className={`text-[10px] font-mono font-black ${stability > 50 ? 'text-neon-green' : 'text-red-500'}`}>{stability}%</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
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
                        className="p-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-gray-500 hover:text-neon-purple hover:border-neon-purple/50 transition-all group"
                        title="Generar Reporte Semanal"
                    >
                        <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={onOpenSettings}
                        className="p-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-gray-500 hover:text-neon-blue hover:border-neon-blue/50 transition-all group"
                        title="Configuración de Módulos"
                    >
                        <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center gap-3 bg-neon-blue text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="hidden sm:inline">Nueva Tarea</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
