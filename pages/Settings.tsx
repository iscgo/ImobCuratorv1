import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserProfile, Language } from '../types';
import { THEME } from '../constants';
import { Camera, Save, X, Globe, CreditCard, Shield, User } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const { t, setLanguage, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  
  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewAvatar(result);
        onUpdateUser({ avatar: result }); // Auto-save avatar as requested
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveProfile = () => {
    onUpdateUser({ name: editName, role: editRole });
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: THEME.fonts.display }}>{t('settings')}</h1>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'profile', icon: User, label: t('profile') },
          { id: 'security', icon: Shield, label: t('security') },
          { id: 'billing', icon: CreditCard, label: t('subscription') },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-8">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <div className="relative group">
                <img src={previewAvatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50" />
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                      placeholder="Nome"
                    />
                    <input 
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                      placeholder="Cargo"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveProfile} className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm flex items-center gap-2"><Save size={14}/> {t('save')}</button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm flex items-center gap-2"><X size={14}/> {t('cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.role}</p>
                    <button onClick={() => setIsEditing(true)} className="mt-2 text-purple-400 text-sm hover:underline">{t('edit_profile')}</button>
                  </div>
                )}
              </div>
            </div>

            {/* Language Selector */}
            <div className="border-t border-white/10 pt-8">
               <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={18}/> {t('language')}</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['pt', 'br', 'en', 'fr'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`p-3 rounded-lg border text-center font-mono uppercase transition-all ${
                        language === lang 
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
               </div>
            </div>
            
            {/* Notifications Toggle */}
             <div className="border-t border-white/10 pt-8 flex items-center justify-between">
                <div>
                   <h4 className="text-white font-bold mb-1">Notificações</h4>
                   <p className="text-gray-500 text-sm">Receber alertas de e-mail e push.</p>
                </div>
                <button 
                  onClick={() => onUpdateUser({ notificationsEnabled: !user.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${user.notificationsEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.notificationsEnabled ? 'left-7' : 'left-1'}`} />
                </button>
             </div>

          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('change_password')}</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('old_password')}</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('new_password')}</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />
            </div>
            <button className="px-6 py-3 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-700 transition-colors">
              {t('save')}
            </button>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="text-center py-8">
            <div className="mb-6 inline-block p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
              <CreditCard size={48} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Plano Atual: {user.subscription.toUpperCase()}</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {user.subscription === 'starter' 
                ? `Você utilizou ${user.searchCount}/2 pesquisas gratuitas este mês.` 
                : 'Acesso ilimitado e prioritário ativo.'}
            </p>

            {user.subscription === 'starter' && (
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20">
                Upgrade para PRO (€ 9.99/mês)
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};