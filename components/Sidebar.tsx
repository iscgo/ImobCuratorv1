import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Calendar, PieChart, Settings, LogOut, Sparkles, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/' },
    { icon: Sparkles, label: t('nav.proposal'), path: '/import' }, 
    { icon: Users, label: t('nav.clients'), path: '/clients' },
    { icon: Building2, label: t('nav.properties'), path: '/properties' },
    { icon: Calendar, label: t('nav.visits'), path: '/visits' },
    { icon: PieChart, label: t('nav.reports'), path: '/analytics' },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <div className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors duration-200 flex-shrink-0 sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            IC
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white">ImobCurator</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
                isActive
                ? 'bg-gray-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Settings size={20} />
            {t('nav.settings')}
          </NavLink>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut size={20} />
            {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-700">
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <LogOut size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('nav.logout')}?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Tem a certeza que deseja terminar a sessão?
                 </p>
                 <div className="flex gap-3 w-full">
                    <button 
                       onClick={() => setShowLogoutModal(false)}
                       className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                       {t('settings.cancel')}
                    </button>
                    <button 
                       onClick={handleLogoutConfirm}
                       className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                       {t('nav.logout')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};