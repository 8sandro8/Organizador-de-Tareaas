import { Calendar, Settings, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function CalendarWidget() {
    // Default to a public Spanish holidays calendar or similar if none provided
    // The user can change this URL
    const [calendarUrl, setCalendarUrl] = useState('https://calendar.google.com/calendar/embed?src=es.spain%23holiday%40group.v.calendar.google.com&ctz=Europe%2FMadrid');
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(calendarUrl);

    const handleSave = (e) => {
        e.preventDefault();
        setCalendarUrl(tempUrl);
        setIsEditing(false);
    };

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
            <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#1c2128]">
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neon-purple" />
                    <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Google_Calendar</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1.5 hover:bg-[#30363d] rounded-lg transition-colors text-gray-500 hover:text-white"
                        title="Configurar URL"
                    >
                        <Settings className="w-3.5 h-4" />
                    </button>
                    <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-[#30363d] rounded-lg transition-colors text-gray-500 hover:text-white"
                        title="Abrir en nueva pestaña"
                    >
                        <ExternalLink className="w-3.5 h-4" />
                    </a>
                </div>
            </div>

            <div className="flex-1 relative bg-[#0d1117]">
                {isEditing ? (
                    <div className="absolute inset-0 z-10 p-6 bg-[#0d1117]/95 backdrop-blur-sm flex flex-col justify-center gap-4">
                        <label className="text-[10px] font-mono text-gray-500 uppercase font-bold">Pegar URL de Inserción (Embed URL):</label>
                        <textarea
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-xs text-gray-300 font-mono focus:border-neon-purple/50 outline-none h-32 resize-none"
                            placeholder="https://calendar.google.com/calendar/embed?src=..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-neon-purple text-black font-black py-2 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                Guardar Config
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-[#30363d] text-gray-500 rounded-xl text-[10px] uppercase tracking-widest hover:text-white"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : null}

                <iframe
                    src={calendarUrl}
                    style={{ border: 0 }}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    className="opacity-90 grayscale-[0.3] invert-[0.05] brightness-90"
                ></iframe>
            </div>
        </div>
    );
}
