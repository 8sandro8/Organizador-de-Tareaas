import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSelector({ className = '' }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((lang) => lang.code === i18nInstance.language) || LANGUAGES[0];

  const handleChangeLanguage = useCallback((langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest('.language-selector')) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className={`relative language-selector ${className}`} onClick={handleClickOutside}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#484f58] transition-all duration-200 group"
        title={t('common.language')}
      >
        <span className="text-lg leading-none">{currentLang.flag}</span>
        <span className="text-xs font-mono text-gray-400 group-hover:text-gray-300 transition-colors">
          {currentLang.code.toUpperCase()}
        </span>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-40 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150
                ${lang.code === currentLang.code
                  ? 'bg-[#21262d] text-white'
                  : 'text-gray-400 hover:bg-[#21262d] hover:text-white'
                }
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className="text-[10px] text-gray-600 font-mono uppercase">{lang.code}</span>
              </div>
              {lang.code === currentLang.code && (
                <svg
                  className="w-4 h-4 ml-auto text-neon-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
