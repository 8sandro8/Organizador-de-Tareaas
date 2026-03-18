import React from 'react';
import { Activity, Zap, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const StatsWidget = ({ tasks, subjects }) => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const pendingTasks = safeTasks.length;
    const actionableTasks = safeTasks.filter(t => ['CLASE', 'EJERCICIO', 'PILDORA'].includes(t.type));
    const actionablePendingCount = actionableTasks.length;
    const criticalTasks = safeTasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;

    const efficiency = Math.max(0, 100 - (actionablePendingCount * 5));

    const exportReport = () => {
        const dateStr = new Date().toLocaleDateString();
        let report = `# Reporte Semanal DAM — ${dateStr}\n\n`;
        report += `## Resumen del Sistema\n`;
        report += `- **Tareas Activas:** ${actionablePendingCount}\n`;
        report += `- **Contenido Informativo:** ${pendingTasks - actionablePendingCount}\n`;
        report += `- **Eficiencia:** ${efficiency}%\n`;
        report += `- **Alertas Críticas:** ${criticalTasks}\n\n`;

        report += `## Tareas Pendientes\n`;
        if (safeTasks.length === 0) {
            report += `_No hay tareas pendientes._\n`;
        } else {
            safeTasks.forEach(t => {
                const subject = subjects.find(s => s.id === t.subjectId);
                report += `- [ ] **${t.title}** [${subject?.code || '??'}] - ${t.type} (${t.priority})\n`;
                if (t.link) report += `  - Enlace: ${t.link}\n`;
            });
        }

        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_DAM_${dateStr.replace(/\//g, '-')}.md`;
        a.click();
    };

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-neon-green" />
                    <h3 className="font-mono font-bold text-white text-sm">ESTADO DEL SISTEMA</h3>
                </div>
                <button
                    onClick={exportReport}
                    className="p-1 px-2 bg-[#0d1117] border border-[#30363d] rounded text-[9px] font-mono text-gray-500 hover:text-neon-blue hover:border-neon-blue transition-all flex items-center gap-1 uppercase"
                >
                    <Download className="w-2 h-2" /> Export
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-tighter">Eficiencia</span>
                    <div className="flex items-center justify-between mt-1">
                        <span className={`text-xl font-black font-mono ${efficiency > 70 ? 'text-neon-green' : 'text-yellow-400'}`}>
                            {efficiency}%
                        </span>
                        <Zap className={`w-4 h-4 ${efficiency > 70 ? 'text-neon-green' : 'text-yellow-400'}`} />
                    </div>
                </div>

                <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-tighter">Alertas</span>
                    <div className="flex items-center justify-between mt-1">
                        <span className={`text-xl font-black font-mono ${criticalTasks > 0 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                            {criticalTasks}
                        </span>
                        <AlertTriangle className={`w-4 h-4 ${criticalTasks > 0 ? 'text-red-500' : 'text-gray-600'}`} />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Progreso Global</span>
                    <span className="text-[10px] font-mono text-neon-blue uppercase tracking-tighter">{actionablePendingCount} Pendientes</span>
                </div>
                <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <div
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000"
                        style={{ width: `${Math.max(10, 100 - (actionablePendingCount * 2))}%` }}
                    ></div>
                </div>
            </div>

            <div className="text-[10px] font-mono text-gray-600 text-center italic">
        // Kernel v4.1 - Mobile Optimized
            </div>
        </div>
    );
};

export default StatsWidget;
