import React from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("DAM_KERNEL_CRITICAL_FAILURE:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0d1117] text-white font-mono flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-red-500/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                                <ShieldAlert className="w-6 h-6 text-red-500" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tighter">Kernel_Crash</h1>
                        </div>

                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            El sistema ha encontrado un error crítico en el sector de la interfaz. Los logs han sido enviados a la consola del desarrollador.
                        </p>

                        <div className="bg-black/40 border border-[#30363d] rounded-xl p-4 mb-8">
                            <span className="text-[10px] text-red-500 font-bold uppercase block mb-2">Error_Stack:</span>
                            <p className="text-[10px] text-gray-500 break-all">
                                {this.state.error?.toString()}
                            </p>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-red-500 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Reintentar Sincronización
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
