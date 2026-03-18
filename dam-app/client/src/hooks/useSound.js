import { useCallback } from 'react';

const sounds = {
    click: null, // Deshabilitado - Mixkit URLs returning 403
    success: null,
    warning: null,
    kernel: null,
    task_check: null,
    delete_action: null,
    modal_open: null
};

export default function useSound() {
    const playSound = useCallback((type) => {
        // Sonidos deshabilitados temporalmente para evitar errores
        // TODO: Implementar sonidos locales o usar Web Audio API
    }, []);

    return { playSound };
}
