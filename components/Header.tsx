import React, { useState } from 'react';
import { Search, Bell, Share2, Check } from 'lucide-react';
import { THEME, MOCK_NOTIFICATIONS, MOCK_CLIENTS } from '../constants';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredResults = searchTerm.length > 2 
    ? MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleShareProfile = async () => {
    const url = `https://imobcurator.com/u/${user.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: user.name,
                text: `Conheça meu perfil profissional no ImobCurator`,
                url: url
            });
        } catch (err) {
            console.log("Error sharing", err);
        }
    } else {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#030305]/80 backdrop-blur-md border-b border-white/5 z-30 md:pl-64 flex items-center justify-between px-6">
      
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input 
            type="text"
            placeholder="Pesquisar clientes, imóveis (inclui arquivo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
        />
        
        {/* Search Results Dropdown */}
        {searchTerm.length > 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0C] border border-white/10 rounded-xl p-2 shadow-2xl">
                {filteredResults.length > 0 ? (
                    filteredResults.map(client => (
                        <div key={client.id} className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                            <p className="text-white text-sm font-medium">{client.name}</p>
                            <p className="text-xs text-gray-500 flex justify-between">
                                <span>{client.status === 'archived' ? 'Arquivo Morto' : 'Ativo'}</span>
                                <span>{client.lastInteraction}</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">Nenhum resultado encontrado</div>
                )}
            </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <AnimatePresence>
                {showNotifications && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-[#0A0A0C] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-white/5 flex justify-between items-center">
                            <span className="text-sm font-bold text-white">Notificações</span>
                            <button className="text-[10px] text-purple-400 hover:text-purple-300">Marcar todas</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {MOCK_NOTIFICATIONS.map(notif => (
                                <div key={notif.id} className={`p-3 border-b border-white/5 ${!notif.read ? 'bg-purple-900/10' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm text-white font-medium">{notif.title}</h4>
                                        <span className="text-[10px] text-gray-500">{notif.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
            <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors"
            >
                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border border-purple-500/30" />
                <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.role}</p>
                </div>
            </button>

            <AnimatePresence>
                {showProfileMenu && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-[#0A0A0C] border border-white/10 rounded-xl p-4 shadow-2xl"
                    >
                        <div className="text-center mb-4">
                            <img src={user.avatar} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-purple-500" />
                            <h3 className="text-white font-bold">{user.name}</h3>
                            <p className="text-xs text-gray-400 mb-1">{user.role}</p>
                            <div className="flex justify-center gap-1">
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20">{user.reputation}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleShareProfile}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                        >
                            {copiedLink ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                            {copiedLink ? 'Link Copiado!' : 'Partilhar Perfil'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </header>
  );
};