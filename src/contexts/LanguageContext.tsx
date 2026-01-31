// @refresh reset
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CURRENT_USER } from '../constants';

type Language = 'pt-PT' | 'pt-BR' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'pt-PT': {
    'nav.dashboard': 'Painel',
    'nav.proposal': 'Nova Proposta',
    'nav.clients': 'Clientes',
    'nav.properties': 'Imóveis',
    'nav.visits': 'Visitas',
    'nav.reports': 'Relatórios',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'settings.title': 'Configurações',
    'settings.subtitle': 'Gerencie seu perfil e preferências da conta.',
    'settings.account': 'Conta & Segurança',
    'settings.password': 'Palavra-passe',
    'settings.password_desc': 'Alterar senha',
    'settings.subscription': 'Assinatura',
    'settings.preferences': 'Preferências',
    'settings.notifications': 'Notificações',
    'settings.language': 'Idioma',
    'settings.edit_profile': 'Editar Perfil',
    'settings.cancel': 'Cancelar',
    'settings.save': 'Salvar',
    'settings.modal.plans': 'Planos ImobCurator',
    'settings.modal.marketing': 'Potencialize a sua carreira como Buyer Agent.',
    'settings.modal.unlimited': 'Pesquisas Ilimitadas',
    'settings.modal.leads': 'Acesso a leads exclusivos',
    'settings.modal.choose': 'Escolha seu Plano',
    'role.agent': 'Consultor Imobiliário'
  },
  'pt-BR': {
    'nav.dashboard': 'Painel',
    'nav.proposal': 'Nova Proposta',
    'nav.clients': 'Clientes',
    'nav.properties': 'Imóveis',
    'nav.visits': 'Visitas',
    'nav.reports': 'Relatórios',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'settings.title': 'Configurações',
    'settings.subtitle': 'Gerencie seu perfil e preferências.',
    'settings.account': 'Conta & Segurança',
    'settings.password': 'Senha',
    'settings.password_desc': 'Alterar senha',
    'settings.subscription': 'Assinatura',
    'settings.preferences': 'Preferências',
    'settings.notifications': 'Notificações',
    'settings.language': 'Idioma',
    'settings.edit_profile': 'Editar Perfil',
    'settings.cancel': 'Cancelar',
    'settings.save': 'Salvar',
    'settings.modal.plans': 'Planos ImobCurator',
    'settings.modal.marketing': 'Potencialize sua carreira como Buyer Agent.',
    'settings.modal.unlimited': 'Pesquisas Ilimitadas',
    'settings.modal.leads': 'Acesso a leads exclusivos',
    'settings.modal.choose': 'Escolha seu Plano',
    'role.agent': 'Corretor de Imóveis'
  },
  'en': {
    'nav.dashboard': 'Dashboard',
    'nav.proposal': 'New Proposal',
    'nav.clients': 'Clients',
    'nav.properties': 'Properties',
    'nav.visits': 'Visits',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your profile and account preferences.',
    'settings.account': 'Account & Security',
    'settings.password': 'Password',
    'settings.password_desc': 'Change password',
    'settings.subscription': 'Subscription',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'settings.language': 'Language',
    'settings.edit_profile': 'Edit Profile',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save',
    'settings.modal.plans': 'ImobCurator Plans',
    'settings.modal.marketing': 'Boost your career as a Buyer Agent.',
    'settings.modal.unlimited': 'Unlimited Searches',
    'settings.modal.leads': 'Access to exclusive leads',
    'settings.modal.choose': 'Choose your Plan',
    'role.agent': 'Real Estate Consultant'
  },
  'fr': {
    'nav.dashboard': 'Tableau de bord',
    'nav.proposal': 'Nouvelle Proposition',
    'nav.clients': 'Clients',
    'nav.properties': 'Propriétés',
    'nav.visits': 'Visites',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Se déconnecter',
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez votre profil et vos préférences.',
    'settings.account': 'Compte et Sécurité',
    'settings.password': 'Mot de passe',
    'settings.password_desc': 'Changer le mot de passe',
    'settings.subscription': 'Abonnement',
    'settings.preferences': 'Préférences',
    'settings.notifications': 'Notifications',
    'settings.language': 'Langue',
    'settings.edit_profile': 'Modifier le profil',
    'settings.cancel': 'Annuler',
    'settings.save': 'Sauvegarder',
    'settings.modal.plans': 'Plans ImobCurator',
    'settings.modal.marketing': 'Boostez votre carrière d\'agent.',
    'settings.modal.unlimited': 'Recherches illimitées',
    'settings.modal.leads': 'Accès aux leads exclusifs',
    'settings.modal.choose': 'Choisissez votre plan',
    'role.agent': 'Consultant Immobilier'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(CURRENT_USER.settings.language as Language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    CURRENT_USER.settings.language = lang; // Sync with global user constant
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['pt-PT']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}