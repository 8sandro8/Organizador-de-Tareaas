import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Book, Bell, Monitor } from 'lucide-react';

export default function Timer({ onFinish, isFocusMode, onToggleFocus }) {
    const [seconds, setSeconds] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState('25');
    const timerRef = useRef(null);

    const modes = {
        pomodoro: { label: 'Estudio', time: 25 * 60, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', icon: Book },
        shortBreak: { label: 'Descanso', time: 5 * 60, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', icon: Coffee },
        longBreak: { label: 'Largo', time: 15 * 60, color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', icon: Coffee }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(modes[mode].time);
    };

    const changeMode = (m) => {
        setMode(m);
        setIsActive(false);
        setSeconds(modes[m].time);
        setEditMinutes(Math.floor(modes[m].time / 60).toString());
    };

    const handleTimeSubmit = (e) => {
        e.preventDefault();
        const mins = parseInt(editMinutes);
        if (!isNaN(mins) && mins > 0) {
            setSeconds(mins * 60);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (isActive && seconds > 0) {
            timerRef.current = setInterval(() => {
                setSeconds((s) => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            if (onFinish) onFinish();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, seconds, onFinish]);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const CurrentIcon = modes[mode].icon;

    return (
        <div className={`bg-[#161b22] border rounded-2xl p-4 shadow-2xl relative overflow-hidden transition-all duration-500 ${isFocusMode ? 'border-neon-blue shadow-neon-blue/20 scale-110' : 'border-[#30363d] h-fit'}`}>
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 blur-[40px] transition-all duration-500 ${modes[mode].bg}`}></div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${modes[mode].bg} ${modes[mode].border}`}>
                        <CurrentIcon className={`w-3 h-3 ${modes[mode].color}`} />
                    </div>
                    <h2 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest opacity-80">Timer_Stud</h2>
                </div>
                {!isFocusMode && (
                    <div className="flex flex-wrap gap-1 justify-end">
                        {Object.entries(modes).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => changeMode(key)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${mode === key
                                    ? `${config.bg} ${config.color} ${config.border}`
                                    : 'text-gray-600 border-transparent hover:text-gray-400'
                                    }`}
                            >
                                {config.label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center mb-4 relative py-2">
                {isEditing ? (
                    <form onSubmit={handleTimeSubmit} className="flex items-center justify-center gap-2">
                        <input
                            autoFocus
                            type="number"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            onBlur={handleTimeSubmit}
                            className="bg-[#0d1117] border border-neon-blue/30 rounded-lg w-20 text-center text-3xl font-black font-mono text-white outline-none"
                        />
                        <span className="text-xs text-gray-500 font-mono">MIN</span>
                    </form>
                ) : (
                    <div
                        onClick={() => { if (!isFocusMode) { setIsEditing(true); setIsActive(false); } }}
                        className={`font-black font-mono tracking-tighter transition-all duration-300 cursor-pointer ${isFocusMode ? 'text-7xl text-neon-blue' : 'text-5xl hover:scale-105 active:scale-95'} ${isActive ? 'text-white' : 'text-gray-500'}`}
                        title={isFocusMode ? "" : "Haz clic para editar tiempo"}
                    >
                        {formatTime(seconds)}
                    </div>
                )}
                {seconds === 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 flex items-center gap-2 text-neon-green font-mono text-[8px] animate-bounce">
                        <Bell className="w-2.5 h-2.5" /> ¡SESIÓN OK!
                    </div>
                )}
            </div>

            <div className={`flex items-center justify-center gap-3 relative ${isFocusMode ? 'mt-8' : ''}`}>
                <button
                    onClick={toggleTimer}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isActive
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-neon-blue text-black hover:scale-105 shadow-lg shadow-neon-blue/20'
                        }`}
                >
                    {isActive ? (
                        <><Pause className="w-4 h-4" /> PAUSA</>
                    ) : (
                        <><Play className="w-4 h-4 fill-current" /> INICIAR</>
                    )}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-3 bg-[#21262d] text-gray-500 rounded-xl hover:text-white transition-all border border-[#30363d]"
                    title="Reiniciar"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={onToggleFocus}
                    className={`p-2.5 rounded-xl transition-all border ${isFocusMode
                        ? 'bg-neon-blue/20 border-neon-blue text-neon-blue animate-pulse'
                        : 'bg-[#21262d] border-[#30363d] text-gray-500 hover:text-neon-blue hover:border-neon-blue/50'}`}
                    title={isFocusMode ? "Salir de Enfoque Profundo" : "Activar Enfoque Profundo"}
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
