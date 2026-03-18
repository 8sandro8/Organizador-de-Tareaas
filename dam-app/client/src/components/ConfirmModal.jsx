import { useState } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 duration-200',
    modal: 'bg-[#161b22] border border-[#30363d] rounded-2xl p-6 w-full max-w-md shadow-2xl duration-200',
    icon: {
      danger: 'bg-red-500/10 text-red-500',
      warning: 'bg-yellow-500/10 text-yellow-500',
      info: 'bg-blue-500/10 text-blue-500'
    },
    buttonConfirm: {
      danger: 'bg-red-500 hover:bg-red-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      info: 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${styles.icon[type]}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#30363d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#21262d] border border-[#30363d] text-gray-300 rounded-xl font-medium hover:bg-[#30363d] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${styles.buttonConfirm[type]}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
