export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  targetX?: number;
  targetY?: number;
  color: string;
  size: number;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  type: 'starter' | 'pro';
}

export enum SectionId {
  HERO = 'hero',
  PARSER = 'parser',
  JOURNEY = 'journey',
  PRICING = 'pricing',
}

export type Language = 'pt' | 'br' | 'en' | 'fr';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  notificationsEnabled: boolean;
  language: Language;
  subscription: 'starter' | 'pro';
  searchCount: number;
  reputation: 'Elite' | 'Gold' | 'Silver' | 'Bronze';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  budget: number;
  status: 'active' | 'archived' | 'pending';
  lastInteraction: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  features: string[];
  matchPercentage: number;
  url: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
  date: string;
}