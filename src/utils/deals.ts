// Sistema de rastreamento de vendas (fechadas e perdidas)

export type DealOutcome = 'won' | 'lost';

export interface Deal {
  id: string;
  clientId: string;
  clientName: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  outcome: DealOutcome;
  date: string; // ISO date
  lossReason?: string; // Motivo se outcome = 'lost'
  reflection?: string; // Reflexão do agente
  commission?: number; // Comissão estimada se outcome = 'won'
}

export interface PendingFeedback {
  visitId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: string;
  date: string; // Data da visita que já passou
}

const DEALS_STORAGE_KEY = 'imobcurator_deals';
const REPUTATION_STORAGE_KEY = 'imobcurator_reputation';
const REPUTATION_MONTH_KEY = 'imobcurator_reputation_month';

// ===== DEALS =====

export const getDeals = (): Deal[] => {
  try {
    const stored = localStorage.getItem(DEALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading deals:', error);
    return [];
  }
};

const saveDeals = (deals: Deal[]) => {
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
  } catch (error) {
    console.error('Error saving deals:', error);
  }
};

export const addDeal = (deal: Omit<Deal, 'id' | 'date'>): Deal => {
  const deals = getDeals();
  const newDeal: Deal = {
    ...deal,
    id: `deal-${Date.now()}`,
    date: new Date().toISOString()
  };

  deals.push(newDeal);
  saveDeals(deals);

  // Update reputation
  updateReputation(deal.outcome === 'won');

  return newDeal;
};

export const getDealsForMonth = (year: number, month: number): Deal[] => {
  const deals = getDeals();
  return deals.filter(deal => {
    const dealDate = new Date(deal.date);
    return dealDate.getFullYear() === year && dealDate.getMonth() === month;
  });
};

export const getDealsThisMonth = (): Deal[] => {
  const now = new Date();
  return getDealsForMonth(now.getFullYear(), now.getMonth());
};

// ===== REPUTATION =====

export interface Reputation {
  winStreak: number;
  lossStreak: number;
}

export const getReputation = (): Reputation => {
  try {
    // Verificar se mudou o mês - se sim, resetar reputação
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const savedMonth = localStorage.getItem(REPUTATION_MONTH_KEY);

    if (savedMonth !== currentMonth) {
      // Novo mês - resetar reputação
      const resetReputation = { winStreak: 0, lossStreak: 0 };
      saveReputation(resetReputation);
      localStorage.setItem(REPUTATION_MONTH_KEY, currentMonth);
      return resetReputation;
    }

    const stored = localStorage.getItem(REPUTATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { winStreak: 0, lossStreak: 0 };
  } catch (error) {
    console.error('Error reading reputation:', error);
    return { winStreak: 0, lossStreak: 0 };
  }
};

const saveReputation = (reputation: Reputation) => {
  try {
    localStorage.setItem(REPUTATION_STORAGE_KEY, JSON.stringify(reputation));
  } catch (error) {
    console.error('Error saving reputation:', error);
  }
};

export const updateReputation = (isWin: boolean): Reputation => {
  const current = getReputation();

  const updated: Reputation = isWin
    ? { winStreak: current.winStreak + 1, lossStreak: 0 }
    : { winStreak: 0, lossStreak: current.lossStreak + 1 };

  saveReputation(updated);

  // Salvar mês atual
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
  localStorage.setItem(REPUTATION_MONTH_KEY, currentMonth);

  return updated;
};

export const resetReputation = () => {
  saveReputation({ winStreak: 0, lossStreak: 0 });
};

// ===== STATS CALCULATORS =====

export const getLossReasons = (deals?: Deal[]): Record<string, number> => {
  const allDeals = deals || getDeals();
  const lostDeals = allDeals.filter(d => d.outcome === 'lost');

  const reasons: Record<string, number> = {};

  lostDeals.forEach(deal => {
    if (deal.lossReason) {
      reasons[deal.lossReason] = (reasons[deal.lossReason] || 0) + 1;
    }
  });

  return reasons;
};

export const getLossReasonsPercentage = (deals?: Deal[]): Array<{ reason: string; percentage: number; count: number }> => {
  const reasons = getLossReasons(deals);
  const total = Object.values(reasons).reduce((sum, count) => sum + count, 0);

  if (total === 0) return [];

  return Object.entries(reasons)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
};

export const getTotalCommission = (deals?: Deal[]): number => {
  const allDeals = deals || getDeals();
  return allDeals
    .filter(d => d.outcome === 'won')
    .reduce((sum, deal) => sum + (deal.commission || 0), 0);
};
