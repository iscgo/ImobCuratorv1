import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, Moon, Bell, Search, Menu, Trophy, Shield, AlertTriangle, 
  X, Clock, Calendar, ThumbsUp, ThumbsDown, User, MapPin, Briefcase, Mail, Phone,
  Archive, ChevronRight, LogOut, Share2, Check
} from 'lucide-react';
import { CURRENT_USER, MOCK_CLIENTS, ARCHIVED_CLIENTS, MOCK_NOTIFICATIONS } from '../constants';
import { ReputationLevel, Client } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, toggleSidebar }) => {
  const navigate = useNavigate();
  
  // STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [shareState, setShareState] = useState<'IDLE' | 'COPIED'>('IDLE');
  
  // Local state for user info to allow immediate updates
  const [userInfo, setUserInfo] = useState({
    name: CURRENT_USER.name,
    avatar: CURRENT_USER.avatar,
    role: CURRENT_USER.role,
    reputation: CURRENT_USER.reputation
  });
  
  // REFS (Click Outside)
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserInfo({
        name: CURRENT_USER.name,
        avatar: CURRENT_USER.avatar,
        role: CURRENT_USER.role,
        reputation: CURRENT_USER.reputation
      });
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  // CLICK OUTSIDE HANDLER
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
        setShareState('IDLE'); // Reset share state when closing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SEARCH LOGIC
  const allClients = [...MOCK_CLIENTS, ...ARCHIVED_CLIENTS];
  const filteredClients = searchQuery.length > 1 
    ? allClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleClientClick = (client: Client) => {
    if (client.status === 'Archived') {
       alert(`Cliente Arquivado: ${client.name}\nAtivo pela última vez em: ${client.lastActivity}\n(Visualização de arquivo em construção)`);
    } else {
       navigate(`/clients/${client.id}`);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleShareProfile = async () => {
      const fullUrl = `https://${CURRENT_USER.micrositeUrl}`;
      const shareData = {
          title: `Perfil de ${userInfo.name}`,
          text: `Confira meu portfólio no ImobCurator: ${fullUrl}`,
          url: fullUrl
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.log('Share canceled');
          }
      } else {
          // Fallback seguro com HTTPS
          navigator.clipboard.writeText(fullUrl);
          setShareState('COPIED');
          setTimeout(() => setShareState('IDLE'), 2000);
      }
  };

  // REPUTATION HELPER
  const getReputationIcon = () => {
    switch (userInfo.reputation.level) {
        case ReputationLevel.ELITE: return <Trophy size={16} className="text-yellow-500 fill-yellow-500" />;
        case ReputationLevel.RISK: return <AlertTriangle size={16} className="text-red-500" />;
        default: return <Shield size={16} className="text-blue-500" />;
    }
  };

  const getReputationText = () => {
    switch (userInfo.reputation.level) {
        case ReputationLevel.ELITE: return "Agente Elite";
        case ReputationLevel.RISK: return "Risco";
        default: return "Confiável";
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-200 relative z-40">
      
      {/* LEFT SIDE: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        
        {/* GLOBAL SEARCH BAR */}
        <div className="hidden md:block relative w-full max-w-md" ref={searchRef}>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 w-full transition-colors duration-200 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30">
            <Search size={18} />
            <input
              type="text"
              placeholder="Pesquisar clientes (Ativos e Arquivo)..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if(searchQuery) setShowSearchResults(true) }}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 dark:placeholder-gray-400 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {showSearchResults && searchQuery.length > 1 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-750 border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 uppercase">
                 Resultados para "{searchQuery}"
              </div>
              
              {filteredClients.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">Nenhum cliente encontrado.</div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {filteredClients.map(client => (
                    <div 
                      key={client.id} 
                      onClick={() => handleClientClick(client)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700/50 last:border-0"
                    >
                      <div className="relative">
                        <img src={client.avatar} alt={client.name} className={`w-10 h-10 rounded-full object-cover ${client.status === 'Archived' ? 'grayscale opacity-70' : ''}`} />
                        {client.status === 'Archived' && (
                          <div className="absolute -bottom-1 -right-1 bg-gray-600 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-800">
                            <Archive size={10} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{client.name}</p>
                          {client.status === 'Archived' && (
                            <span className="text-[10px] font-bold bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">ARQUIVO</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {client.email} • {client.status === 'Archived' ? `Inativo desde ${client.lastActivity}` : client.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Theme, Notifications, Profile */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
               <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-750/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer">Marcar como lidas</span>
               </div>
               <div className="max-h-[400px] overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map(notif => (
                    <div key={notif.id} className={`p-4 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                       <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                             ${notif.type === 'agenda' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 
                               notif.type === 'feedback_like' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                               notif.type === 'feedback_dislike' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                               'bg-gray-100 text-gray-600'}`}>
                             {notif.type === 'agenda' ? <Calendar size={14} /> : 
                              notif.type === 'feedback_like' ? <ThumbsUp size={14} /> :
                              notif.type === 'feedback_dislike' ? <ThumbsDown size={14} /> :
                              <Bell size={14} />}
                          </div>
                          <div>
                             <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{notif.title}</h4>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{notif.message}</p>
                             <p className="text-[10px] text-gray-400 mt-1.5">{notif.time}</p>
                          </div>
                       </div>
                       {notif.actionUrl && (
                          <Link to={notif.actionUrl} onClick={() => setShowNotifications(false)} className="block mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline text-right">
                             Ver Detalhes
                          </Link>
                       )}
                    </div>
                  ))}
               </div>
               <div className="p-3 text-center border-t border-gray-100 dark:border-slate-700">
                  <button className="text-xs font-bold text-gray-500 hover:text-indigo-600">Ver Histórico Completo</button>
               </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

        {/* PROFILE BADGE & CARD */}
        <div className="relative" ref={profileRef}>
          <div 
             onClick={() => setShowProfileCard(!showProfileCard)}
             className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
              <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1.5 mb-0.5">
                    {getReputationIcon()}
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{getReputationText()}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none">{userInfo.name}</p>
              </div>
            <img
              src={userInfo.avatar}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-100 dark:border-slate-700"
            />
          </div>

          {/* BUSINESS CARD POPOVER */}
          {showProfileCard && (
             <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                {/* Header Gradient */}
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-1 bg-white dark:bg-slate-800 rounded-full">
                      <img src={userInfo.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-slate-700" />
                   </div>
                </div>
                
                <div className="pt-12 pb-6 px-6 text-center">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userInfo.name}</h3>
                   <div className="flex items-center justify-center gap-1.5 mt-1">
                      <Briefcase size={12} className="text-indigo-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{userInfo.role}</p>
                   </div>
                   <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {CURRENT_USER.licenseNumber}
                   </div>

                   <div className="mt-6 space-y-3 text-left">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                         <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                           <Briefcase size={14} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-400">Afiliação</p>
                            <p className="font-medium">{CURRENT_USER.agency === 'Independent' ? 'Independente' : CURRENT_USER.agency}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                         <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                           <Mail size={14} />
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="font-medium truncate">{CURRENT_USER.email}</p>
                         </div>
                      </div>
                       <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                         <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                           <Phone size={14} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-400">Telemóvel</p>
                            <p className="font-medium">{CURRENT_USER.phone}</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex gap-2">
                      <Link to="/settings" onClick={() => setShowProfileCard(false)} className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                         Editar
                      </Link>
                      <button 
                        onClick={handleShareProfile}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${shareState === 'COPIED' ? 'bg-green-600 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'}`}
                      >
                         {shareState === 'COPIED' ? <Check size={16} /> : <Share2 size={16} />}
                         {shareState === 'COPIED' ? 'Copiado!' : 'Partilhar'}
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};