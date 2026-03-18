import { useTranslation } from 'react-i18next';

/**
 * ViewToggle - Componente para alternar entre vista Stats y Calendario
 * Extraído de Dashboard.jsx para mejorar modularidad
 */
function ViewToggle({ showCalendar, onToggle }) {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(false)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
            !showCalendar
              ? 'bg-[#21262d] border-neon-green text-neon-green'
              : 'border-[#30363d] text-gray-500 hover:text-gray-300'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
            showCalendar
              ? 'bg-[#21262d] border-neon-purple text-neon-purple'
              : 'border-[#30363d] text-gray-500 hover:text-gray-300'
          }`}
        >
          {t('dashboard.tasks', { defaultValue: 'Calendario' })}
        </button>
      </div>
    </div>
  )
}

export default ViewToggle