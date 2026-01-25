import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Building2, Calendar, PieChart, Settings, LogOut, Zap, Plus, Layers, Command } from 'lucide-react';
import { THEME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout }) => {
  const { t } = useLanguage();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Grouped Menu Items for better organization
  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { id: 'clients', icon: Users, label: t('clients') },
      ]
    },
    {
      title: 'Operação',
      items: [
        { id: 'import', icon: Zap, label: t('new_proposal') },
        { id: 'properties', icon: Building2, label: t('properties') },
        { id: 'visits', icon: Calendar, label: t('visits') },
      ]
    },
    {
      title: 'Dados',
      items: [
        { id: 'reports', icon: PieChart, label: t('reports') },
      ]
    }
  ];

  return (
    <>
      <aside className="w-20 md:w-64 h-screen fixed left-0 top-0 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 shadow-2xl">
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Command className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white hidden md:block tracking-tighter" style={{ fontFamily: THEME.fonts.display }}>
                IMOB<span className="text-purple-500">OS</span>
            </span>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
            
            {menuGroups.map((group, idx) => (
                <div key={idx}>
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 px-2 hidden md:block">
                        {group.title}
                    </h4>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all relative group ${
                                    currentPage === item.id 
                                    ? 'bg-purple-500/10 text-white' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon size={18} className={currentPage === item.id ? 'text-purple-400' : ''} />
                                <span className={`hidden md:block text-sm ${currentPage === item.id ? 'font-medium' : ''}`}>{item.label}</span>
                                
                                {currentPage === item.id && (
                                    <motion.div 
                                        layoutId="activeSide" 
                                        className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

        </nav>

        {/* System Footer */}
        <div className="p-4 border-t border-white/5 space-y-1 bg-black/20">
            <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    currentPage === 'settings' ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
                <Settings size={18} />
                <span className="hidden md:block text-sm font-medium">{t('settings')}</span>
            </button>
            <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all"
            >
                <LogOut size={18} />
                <span className="hidden md:block text-sm font-medium">{t('logout')}</span>
            </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-sm bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 shadow-2xl"
                >
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: THEME.fonts.display }}>{t('confirm_logout')}</h3>
                    <p className="text-gray-400 mb-6 text-sm">Você precisará fazer login novamente para acessar seus dados.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            onClick={() => {
                                setShowLogoutConfirm(false);
                                onLogout();
                            }}
                            className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};