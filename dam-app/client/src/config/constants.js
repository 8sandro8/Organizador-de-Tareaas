export const APP_CONFIG = {
  API_BASE_URL: '/api',
  DEFAULT_USER: 'SANDRO',
  STORAGE_KEYS: {
    LOGGED_IN: 'dam_loggedIn',
    CURRENT_USER: 'dam_currentUser',
    GAMIFICATION: 'dam_gamification'
  }
};

export const USER_PROFILES = {
  SANDRO: {
    id: 'SANDRO',
    name: 'SANDRO',
    subtitle: 'DAM - Desarrollo de Aplicaciones',
    theme: 'cyberpunk',
    color: 'neon-green'
  },
  MI_PAREJA: {
    id: 'MI_PAREJA',
    name: 'BEA',
    subtitle: 'Sanidad - Grado Superior',
    theme: 'sanidad',
    color: 'neon-pink'
  }
};

// Asignaturas para SANDRO (DAM)
export const SUBJECTS_SANDRO = [
  { id: 'dam-01', code: "01", name: "LENGUAJES DE MARCAS", icon: "🧱", tasks: [], exams: [] },
  { id: 'dam-02', code: "02", name: "DIGITALIZACION APLICADA", icon: "📱", tasks: [], exams: [] },
  { id: 'dam-03', code: "03", name: "ENTORNOS DE DESARROLLO", icon: "🛠️", tasks: [], exams: [] },
  { id: 'dam-04', code: "04", name: "ITINERARIO PERSONAL", icon: "🧭", tasks: [], exams: [] },
  { id: 'dam-05', code: "05", name: "INGLES", icon: "🇬🇧", tasks: [], exams: [] },
  { id: 'dam-06', code: "06", name: "SISTEMAS INFORMATICOS", icon: "🖥️", tasks: [], exams: [] },
  { id: 'dam-07', code: "07", name: "BASES DE DATOS", icon: "🗄️", tasks: [], exams: [] },
  { id: 'dam-08', code: "08", name: "PROGRAMACION", icon: "☕", tasks: [], exams: [] }
];

// Asignaturas para BEA (Sanidad - Grado Superior)
export const SUBJECTS_BEA = [
  { id: 'san-01', code: "01", name: "ANATOMÍA APLICADA", icon: "🫀", tasks: [], exams: [] },
  { id: 'san-02', code: "02", name: "FARMACIA", icon: "💊", tasks: [], exams: [] },
  { id: 'san-03', code: "03", name: "ATENCIÓN SANITARIA", icon: "🏥", tasks: [], exams: [] },
  { id: 'san-04', code: "04", name: "OPERACIONES ADMINISTRATIVAS", icon: "📋", tasks: [], exams: [] }
];

// Función para obtener las asignaturas según el usuario
export const getSubjectsForUser = (userId) => {
  switch (userId) {
    case 'SANDRO':
      return SUBJECTS_SANDRO;
    case 'MI_PAREJA':
      return SUBJECTS_BEA;
    default:
      return SUBJECTS_SANDRO;
  }
};

// Export backward compatibility
export const DEFAULT_SUBJECTS = SUBJECTS_SANDRO;
