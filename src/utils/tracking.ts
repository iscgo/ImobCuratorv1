// Sistema de rastreamento de visualizações de propostas

export interface ClientViewTracking {
  clientId: string;
  clientName: string;
  viewCount: number;
  lastView: string;
}

const STORAGE_KEY = 'imobcurator_client_views';

export const getClientViewsData = (): Record<string, ClientViewTracking> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading client views:', error);
    return {};
  }
};

export const trackClientView = (clientId: string, clientName: string): ClientViewTracking => {
  const data = getClientViewsData();
  const existing = data[clientId] || {
    clientId,
    clientName,
    viewCount: 0,
    lastView: new Date().toISOString()
  };

  data[clientId] = {
    ...existing,
    viewCount: existing.viewCount + 1,
    lastView: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving client views:', error);
  }

  return data[clientId];
};

export const getHottestLead = (): ClientViewTracking | null => {
  const data = getClientViewsData();
  const leads = Object.values(data);

  if (leads.length === 0) return null;

  // Encontrar o lead com mais visualizações nas últimas 48h
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const recentLeads = leads.filter(lead =>
    new Date(lead.lastView) > twoDaysAgo && lead.viewCount >= 3
  );

  if (recentLeads.length === 0) return null;

  return recentLeads.sort((a, b) => b.viewCount - a.viewCount)[0];
};

export const getClientViews = (clientId: string): ClientViewTracking | null => {
  const data = getClientViewsData();
  return data[clientId] || null;
};

export const resetClientViews = (clientId?: string) => {
  if (clientId) {
    const data = getClientViewsData();
    delete data[clientId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};
