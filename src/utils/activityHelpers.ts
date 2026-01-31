// Helper functions para criar atividades automaticamente

import { Activity } from '../types';
import { addActivity } from './storage';

/**
 * Formata timestamp relativo (ex: "2 minutos atrás")
 */
export const getRelativeTime = (date: Date = new Date()): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  return 'Agora mesmo';
};

/**
 * Cria atividade quando um novo cliente é adicionado
 */
export const createClientAddedActivity = (clientName: string) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'inquiry',
    title: 'Novo Cliente Adicionado',
    description: `${clientName} foi adicionado à sua carteira de clientes.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando uma visita é agendada
 */
export const createVisitScheduledActivity = (clientName: string, propertyTitle: string, date: string) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'visit',
    title: 'Visita Agendada',
    description: `Visita marcada com ${clientName} para ${propertyTitle} no dia ${new Date(date).toLocaleDateString('pt-PT')}.`,
    time: getRelativeTime(),
    isUrgent: true
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando um cliente é arquivado
 */
export const createClientArchivedActivity = (clientName: string) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'system',
    title: 'Cliente Arquivado',
    description: `${clientName} foi movido para o arquivo de clientes inativos.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando uma venda é fechada
 */
export const createDealClosedActivity = (clientName: string, propertyTitle?: string, commission?: number) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'contract',
    title: 'Venda Fechada! 🎉',
    description: `Parabéns! Venda fechada com ${clientName}${propertyTitle ? ` para ${propertyTitle}` : ''}${commission ? `. Comissão estimada: €${commission.toLocaleString()}` : ''}.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando uma oportunidade é perdida
 */
export const createDealLostActivity = (clientName: string, reason?: string) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'system',
    title: 'Oportunidade Perdida',
    description: `Negócio com ${clientName} não foi concretizado${reason ? `: ${reason}` : ''}.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando uma proposta é enviada
 */
export const createProposalSentActivity = (clientName: string, propertyTitle: string) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'inquiry',
    title: 'Proposta Enviada',
    description: `Proposta de ${propertyTitle} enviada para ${clientName}.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};

/**
 * Cria atividade quando um imóvel é adicionado ao portfólio
 */
export const createPropertyAddedActivity = (propertyTitle: string, price: number) => {
  const activity: Activity = {
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'system',
    title: 'Imóvel Adicionado ao Portfólio',
    description: `${propertyTitle} foi adicionado ao seu portfólio por €${price.toLocaleString()}.`,
    time: getRelativeTime(),
    isUrgent: false
  };

  addActivity(activity);
  return activity;
};
