import React, { useState, useRef, useEffect } from 'react';
import { CURRENT_USER } from '../constants';
import { User, Mail, Bell, Shield, Globe, CreditCard, ChevronRight, Camera, Save, X, Lock, CheckCircle, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Settings: React.FC = () => {
  // Use Translation Context
  const { language, setLanguage, t } = useLanguage();

  // Local state to manage profile edits
  const [user, setUser] = useState({
    name: CURRENT_USER.name,
    role: CURRENT_USER.role,
    avatar: CURRENT_USER.avatar
  });
  
  // Settings States
  const [notificationsEnabled, setNotificationsEnabled] = useState(CURRENT_USER.settings.notifications);
  const [plan, setPlan] = useState(CURRENT_USER.plan);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  
  // Custom Dropdown State
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  // Click Outside Handler for Language Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({
      old: '',
      new: '',
      confirm: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload - Auto Save
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Update Local State
        setUser(prev => ({ ...prev, avatar: result }));
        // Update Global State Immediately
        CURRENT_USER.avatar = result;
        // Dispatch event for Header
        window.dispatchEvent(new Event('user-profile-updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Text Edits
  const handleSaveProfile = () => {
    setIsEditing(false);
    CURRENT_USER.name = user.name;
    CURRENT_USER.role = user.role;
    window.dispatchEvent(new Event('user-profile-updated'));
  };

  const handleCancelProfile = () => {
    setUser({
        name: CURRENT_USER.name,
        role: CURRENT_USER.role,
        avatar: CURRENT_USER.avatar // Keep avatar as it auto-saves anyway
    });
    setIsEditing(false);
  };

  // Notification Toggle
  const toggleNotifications = () => {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
      CURRENT_USER.settings.notifications = newState;
  };

  // Language Change Custom Handler - USES CONTEXT NOW
  const handleSelectLanguage = (lang: string) => {
      setLanguage(lang as any);
      setIsLanguageOpen(false);
  };

  const getLanguageLabel = (code: string) => {
      switch(code) {
          case 'pt-PT': return 'Português (PT)';
          case 'pt-BR': return 'Português (BR)';
          case 'en': return 'English';
          case 'fr': return 'Français';
          default: return code;
      }
  };

  // Upgrade Plan Mock
  const handleUpgrade = () => {
      const confirm = window.confirm("Deseja atualizar para o Plano Pro (Ilimitado) por €9.99?\n\nPagamento simulado com sucesso.");
      if (confirm) {
          CURRENT_USER.plan = 'Pro';
          CURRENT_USER.maxSearches = Infinity;
          setPlan('Pro');
          setShowPlansModal(false);
          window.dispatchEvent(new Event('user-profile-updated'));
      }
  };

  // Password Logic
  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordForm.old !== CURRENT_USER.passwordHash) {
          alert("A senha antiga está incorreta.");
          return;
      }
      if (passwordForm.new !== passwordForm.confirm) {
          alert("A nova senha e a confirmação não coincidem.");
          return;
      }
      if (passwordForm.new.length < 4) {
          alert("A senha deve ter pelo menos 4 caracteres.");
          return;
      }

      CURRENT_USER.passwordHash = passwordForm.new;
      alert("Senha alterada com sucesso!");
      setShowPasswordModal(false);
      setPasswordForm({ old: '', new: '', confirm: '' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* Header */}
      <div>
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8">
         <div className="relative group">
            <img 
               src={user.avatar} 
               alt="Profile" 
               className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-slate-700 group-hover:opacity-90 transition-opacity"
            />
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleImageChange}
            />
            <button 
               onClick={handleImageClick}
               className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 border-2 border-white dark:border-slate-800 shadow-lg cursor-pointer transition-transform hover:scale-110"
               title="Alterar foto"
            >
               <Camera size={14} />
            </button>
         </div>
         
         <div className="flex-1 text-center md:text-left space-y-1 w-full">
            {isEditing ? (
               <div className="space-y-3 animate-in fade-in">
                  <div>
                     <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Nome</label>
                     <input 
                        type="text" 
                        value={user.name}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                        className="w-full md:w-auto px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Atividade / Cargo</label>
                     <input 
                        type="text" 
                        value={user.role}
                        onChange={(e) => setUser({...user, role: e.target.value})}
                        className="w-full md:w-auto px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                     />
                  </div>
               </div>
            ) : (
               <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{t('role.agent')}</p>
               </>
            )}
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-slate-900 px-3 py-1 rounded-full inline-flex">
               <Mail size={14} />
               <span>{CURRENT_USER.email}</span>
               <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ml-2">Verificado</span>
            </div>
         </div>

         <div className="flex gap-2">
            {isEditing ? (
               <>
                  <button 
                     onClick={handleCancelProfile}
                     className="px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                     <X size={16} /> {t('settings.cancel')}
                  </button>
                  <button 
                     onClick={handleSaveProfile}
                     className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                     <Save size={16} /> {t('settings.save')}
                  </button>
               </>
            ) : (
               <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
               >
                  {t('settings.edit_profile')}
               </button>
            )}
         </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
         {/* Account Settings */}
         <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('settings.account')}</h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
               
               <div 
                  onClick={() => setShowPasswordModal(true)}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-750 cursor-pointer transition-colors"
               >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Shield size={20} />
                     </div>
                     <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t('settings.password')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.password_desc')}</p>
                     </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
               </div>

               <div 
                  onClick={() => setShowPlansModal(true)}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-750 cursor-pointer transition-colors"
               >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <CreditCard size={20} />
                     </div>
                     <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t('settings.subscription')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Plano {plan} ({plan === 'Free' ? `${CURRENT_USER.maxSearches - CURRENT_USER.searchesUsed} pesquisas restantes` : 'Ilimitado'})</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                      {plan === 'Free' && (
                          <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg">
                              Upgrade
                          </span>
                      )}
                      <ChevronRight size={18} className="text-gray-400" />
                  </div>
               </div>

            </div>
         </div>

         {/* App Settings */}
         <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('settings.preferences')}</h3>
            {/* Removed overflow-hidden to let dropdown appear */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700 relative">
               
               <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-750 cursor-pointer transition-colors rounded-t-2xl">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${notificationsEnabled ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-gray-100 text-gray-400'}`}>
                        <Bell size={20} />
                     </div>
                     <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t('settings.notifications')}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notificationsEnabled ? 'Ativadas (Email, Push, WA)' : 'Desativadas'}
                        </p>
                     </div>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled}
                        onChange={toggleNotifications}
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer right-0"
                        style={{ right: notificationsEnabled ? '0' : '50%', borderColor: notificationsEnabled ? '#4F46E5' : '#ccc' }}
                      />
                      <label 
                        onClick={toggleNotifications}
                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                      ></label>
                  </div>
               </div>

               {/* Custom Language Dropdown Row */}
               <div ref={languageRef} className="relative rounded-b-2xl">
                  <div 
                     onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                     className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-750 cursor-pointer transition-colors rounded-b-2xl"
                  >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300">
                           <Globe size={20} />
                        </div>
                        <div>
                           <p className="font-medium text-slate-900 dark:text-white">{t('settings.language')}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                              {getLanguageLabel(language)}
                           </p>
                        </div>
                     </div>
                     <ChevronRight size={18} className={`text-gray-400 transition-transform duration-200 ${isLanguageOpen ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isLanguageOpen && (
                     <div className="absolute top-full right-0 mt-2 w-full md:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                        {['pt-PT', 'pt-BR', 'en', 'fr'].map((lang) => (
                           <button
                              key={lang}
                              onClick={() => handleSelectLanguage(lang)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left
                                 ${language === lang 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                                    : 'text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-750'
                                 }
                              `}
                           >
                              <div className="flex items-center gap-2">
                                  <span className="w-5 text-center">{lang === 'en' ? '🇺🇸' : lang === 'fr' ? '🇫🇷' : lang === 'pt-BR' ? '🇧🇷' : '🇵🇹'}</span>
                                  <span>{getLanguageLabel(lang)}</span>
                              </div>
                              {language === lang && <CheckCircle size={16} />}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

            </div>
         </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
                  <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <X size={20} />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                          <Lock size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.password')}</h3>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Antiga</label>
                          <input 
                              type="password"
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                              value={passwordForm.old}
                              onChange={e => setPasswordForm({...passwordForm, old: e.target.value})}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nova Senha</label>
                          <input 
                              type="password"
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                              value={passwordForm.new}
                              onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar Nova Senha</label>
                          <input 
                              type="password"
                              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                              value={passwordForm.confirm}
                              onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                              required
                          />
                      </div>

                      <button 
                          type="submit"
                          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 mt-4"
                      >
                          Atualizar Senha
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* PLANS MODAL */}
      {showPlansModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
                  <button onClick={() => setShowPlansModal(false)} className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white md:text-gray-500 transition-colors">
                      <X size={24} />
                  </button>

                  {/* Left Side: Marketing */}
                  <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-lg">
                              <Crown size={32} className="text-yellow-300" />
                          </div>
                          <h2 className="text-4xl font-bold mb-4">{t('settings.modal.plans')}</h2>
                          <p className="text-indigo-100 text-lg leading-relaxed">
                              {t('settings.modal.marketing')}
                          </p>
                      </div>
                      <div className="space-y-4 relative z-10 mt-8">
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">{t('settings.modal.unlimited')}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">{t('settings.modal.leads')}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle className="text-green-400" />
                              <span className="font-medium">Microsite Premium</span>
                          </div>
                      </div>
                  </div>

                  {/* Right Side: Plans */}
                  <div className="p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t('settings.modal.choose')}</h3>
                      
                      <div className="space-y-4">
                          {/* Free Plan */}
                          <div className={`border rounded-xl p-4 flex justify-between items-center transition-all ${plan === 'Free' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-slate-700 opacity-60'}`}>
                              <div>
                                  <p className="font-bold text-slate-900 dark:text-white">Starter (Gratuito)</p>
                                  <p className="text-xs text-gray-500">2 pesquisas / mês</p>
                              </div>
                              {plan === 'Free' ? (
                                  <span className="text-sm font-bold text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Atual</span>
                              ) : (
                                  <button onClick={() => { setPlan('Free'); CURRENT_USER.plan = 'Free'; CURRENT_USER.maxSearches = 2; window.dispatchEvent(new Event('user-profile-updated')); setShowPlansModal(false); }} className="text-sm font-medium text-gray-500 hover:text-slate-900">Selecionar</button>
                              )}
                          </div>

                          {/* Pro Plan */}
                          <div className={`border-2 rounded-xl p-6 relative shadow-lg transition-all ${plan === 'Pro' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                              {plan !== 'Pro' && (
                                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                      Recomendado
                                  </div>
                              )}
                              <div className="flex justify-between items-center mb-2">
                                  <p className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">ImobCurator Pro</p>
                                  <p className="font-bold text-2xl text-slate-900 dark:text-white">€9.99<span className="text-sm font-normal text-gray-500">/mês</span></p>
                              </div>
                              <ul className="space-y-2 mb-6">
                                  <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> {t('settings.modal.unlimited')}</li>
                                  <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Gestão de Visitas Avançada</li>
                              </ul>
                              {plan === 'Pro' ? (
                                  <div className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-bold flex items-center justify-center gap-2">
                                      <CheckCircle size={18} /> Plano Ativo
                                  </div>
                              ) : (
                                  <button 
                                      onClick={handleUpgrade}
                                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                  >
                                      <Lock size={16} /> Desbloquear Agora
                                  </button>
                              )}
                          </div>
                      </div>
                      
                      <p className="text-center text-xs text-gray-400 mt-6">
                          Pagamento seguro. Cancele a qualquer momento.
                      </p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};