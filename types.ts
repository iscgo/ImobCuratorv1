
export enum VisitStatus {
  REQUESTED = 'REQUESTED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PropertyStatus {
  NEW = 'NEW',
  LIKED = 'LIKED',
  DISCARDED = 'DISCARDED',
  VISIT_REQUESTED = 'VISIT_REQUESTED'
}

export enum ReputationLevel {
  ELITE = 'ELITE',      // 3+ vendas seguidas (Muito Boa)
  GOOD = 'GOOD',        // 1-2 vendas (Boa/Normal)
  NEUTRAL = 'NEUTRAL',  // Sem histórico recente ou misto
  RISK = 'RISK'         // 4+ perdas seguidas (Má)
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  locationInterest: string;
  budget: string;
  status: 'Searching' | 'Visiting' | 'Offer Made' | 'Closed' | 'Inactive' | 'Archived';
  lastActivity: string;
  unreadCount?: number;
  attentionNeeded?: boolean; // Para clientes "Em Atraso"
  proposalSent?: boolean;
  archivedDate?: string; // Para clientes antigos
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  url?: string; // Link original do anúncio
  tags: string[];
  status: PropertyStatus;
  agentNote?: string;
}

export interface Activity {
  id: string;
  type: 'inquiry' | 'visit' | 'contract' | 'system';
  title: string;
  description: string;
  time: string;
  isUrgent?: boolean;
}

export interface Visit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  address: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  date: string; // ISO Date YYYY-MM-DD
  time: string;
  status: VisitStatus;
  notes?: string;
  timeline?: {
    status: VisitStatus;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface Notification {
  id: string;
  type: 'agenda' | 'feedback_like' | 'feedback_dislike' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  agency: 'Independent' | 'Remax' | 'KW' | 'Era' | 'Century21' | 'Private' | 'Other';
  licenseNumber?: string;
  email: string;
  phone: string;
  avatar: string;
  micrositeUrl: string;
  passwordHash: string; // Mock password check
  plan: 'Free' | 'Pro';
  searchesUsed: number;
  maxSearches: number; // 2 for Free, Infinity for Pro
  settings: {
    notifications: boolean;
    language: 'pt-PT' | 'pt-BR' | 'en' | 'fr';
  };
  reputation: {
    level: ReputationLevel;
    winStreak: number;
    lossStreak: number;
  }
}