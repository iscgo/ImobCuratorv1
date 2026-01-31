// Funções para calcular métricas reais dos relatórios

import { getDealsThisMonth, getTotalCommission, PendingFeedback } from './deals';
import { getClients, getVisits } from './storage';

// ===== MONTHLY STATS =====

export interface MonthlyStats {
  month: string;
  totalClients: number;
  salesClosed: number;
  salesLost: number;
  inProgress: number;
  totalRevenue: number;
  conversionRate: number;
}

export const getMonthlyStats = (): MonthlyStats => {
  const now = new Date();
  const monthName = now.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

  const deals = getDealsThisMonth();
  const clients = getClients();

  const salesClosed = deals.filter(d => d.outcome === 'won').length;
  const salesLost = deals.filter(d => d.outcome === 'lost').length;
  const totalDeals = salesClosed + salesLost;

  // Clientes ativos (não arquivados e não "Closed")
  const activeClients = clients.filter(c => c.status !== 'Archived' && c.status !== 'Closed');

  // Clientes em progresso = ativos que ainda não viraram deal
  const dealtClientIds = new Set(deals.map(d => d.clientId));
  const inProgress = activeClients.filter(c => !dealtClientIds.has(c.id)).length;

  const totalRevenue = getTotalCommission(deals);

  const conversionRate = totalDeals > 0
    ? Math.round((salesClosed / totalDeals) * 100)
    : 0;

  return {
    month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
    totalClients: activeClients.length,
    salesClosed,
    salesLost,
    inProgress,
    totalRevenue,
    conversionRate
  };
};

// ===== PENDING FEEDBACK =====

export const getPendingFeedback = (): PendingFeedback[] => {
  const visits = getVisits();
  const clients = getClients();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Visitas que já passaram e ainda estão "COMPLETED" ou "CONFIRMED" mas sem feedback de deal
  const deals = getDealsThisMonth();
  const dealtVisitIds = new Set(
    visits
      .filter(v => deals.some(d => d.clientId === v.clientId))
      .map(v => v.id)
  );

  const pendingVisits = visits.filter(visit => {
    const visitDate = new Date(visit.date);
    visitDate.setHours(0, 0, 0, 0);

    const isPast = visitDate < now;
    const isRelevantStatus = visit.status === 'COMPLETED' || visit.status === 'CONFIRMED';
    const noFeedbackYet = !dealtVisitIds.has(visit.id);

    return isPast && isRelevantStatus && noFeedbackYet;
  });

  return pendingVisits.map(visit => {
    const client = clients.find(c => c.id === visit.clientId);

    return {
      visitId: visit.id,
      clientId: visit.clientId,
      clientName: visit.clientName,
      clientAvatar: visit.clientAvatar || client?.avatar || '',
      propertyId: visit.propertyId,
      propertyTitle: visit.propertyTitle,
      propertyPrice: 'N/A', // Pode buscar do property se tiver
      date: new Date(visit.date).toLocaleDateString('pt-PT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
  });
};
