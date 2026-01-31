
import { Activity, Client, Property, PropertyStatus, VisitStatus, Visit, ReputationLevel, Notification, UserProfile } from './types';

export const CURRENT_USER: UserProfile = {
  name: "",
  role: "Consultor Imobiliário",
  agency: "",
  email: "",
  phone: "",
  avatar: "",
  micrositeUrl: "",
  licenseNumber: "",
  passwordHash: "",
  plan: 'Free',
  searchesUsed: 0,
  maxSearches: 2,
  settings: {
    notifications: true,
    language: 'pt-PT'
  },
  reputation: {
    level: ReputationLevel.GOOD,
    winStreak: 0,
    lossStreak: 0
  }
};

export const MOCK_NOTIFICATIONS: Notification[] = [];

// Clientes "Ativos"
export const MOCK_CLIENTS: Client[] = [];

// Clientes Antigos (Arquivo Morto) - Apenas acessíveis via Search
export const ARCHIVED_CLIENTS: Client[] = [];

export const MOCK_ACTIVITIES: Activity[] = [];

export const MOCK_PROPERTIES: Property[] = [];

export const MOCK_VISIT = null;

export const MOCK_VISITS_LIST: Visit[] = [];