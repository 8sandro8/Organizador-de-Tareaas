import { useState, useEffect } from 'react';
import { User, Shield, Heart } from 'lucide-react';
import { USER_PROFILES } from '../config/constants';

function LoginScreen({ onLogin }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const users = [
    { ...USER_PROFILES.SANDRO, icon: Shield },
    { ...USER_PROFILES.MI_PAREJA, icon: Heart }
  ];

  useEffect(() => {
    let timer;
    if (selectedUser) {
      setIsLoading(true);
      timer = setTimeout(() => {
        onLogin(selectedUser);
      }, 800);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedUser, onLogin]);

  const handleSelect = (user) => {
    setSelectedUser(user);
  };

  const getColorClasses = (color) => {
    const colors = {
      'neon-green': 'border-neon-green hover:border-neon-green hover:shadow-neon-green/30',
      'neon-pink': 'border-neon-pink hover:border-neon-pink hover:shadow-neon-pink/30'
    };
    return colors[color] || colors['neon-green'];
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#21262d] to-[#0d1117] border border-[#30363d] flex items-center justify-center">
            <User className="w-10 h-10 text-neon-blue" />
          </div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
            ORGANIZADOR<span className="text-neon-blue">_TAREAS</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono">Selecciona tu entorno de trabajo</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => {
            const Icon = user.icon;
            const isSelected = selectedUser?.id === user.id;
            
            return (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                disabled={isLoading}
                className={`
                  relative p-6 rounded-2xl border-2 bg-[#161b22] transition-all duration-300
                  ${getColorClasses(user.color)}
                  ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
                  ${isLoading && isSelected ? 'animate-pulse' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center
                    ${user.id === 'SANDRO' 
                      ? 'bg-neon-green/10 border border-neon-green/30' 
                      : 'bg-neon-pink/10 border border-neon-pink/30'
                    }
                  `}>
                    <Icon className={`w-7 h-7 ${user.id === 'SANDRO' ? 'text-neon-green' : 'text-neon-pink'}`} />
                  </div>
                  
                  <div className="text-left flex-1">
                    <h3 className={`text-xl font-bold font-mono ${
                      user.id === 'SANDRO' ? 'text-neon-green' : 'text-neon-pink'
                    }`}>
                      {user.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{user.subtitle}</p>
                  </div>

                  {isSelected && isLoading && (
                    <div className="absolute right-4">
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className={`absolute bottom-0 left-0 h-1 rounded-b-xl transition-all duration-300 ${
                  user.id === 'SANDRO' ? 'bg-neon-green' : 'bg-neon-pink'
                } ${isSelected ? 'w-full' : 'w-0'}`} />
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-600 text-xs font-mono">
          tus datos se almacenan localmente
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
