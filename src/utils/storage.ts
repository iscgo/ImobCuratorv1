// Sistema centralizado de storage para dados da aplicação

import { Client, Visit, Property, Activity } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'imobcurator_clients',
  VISITS: 'imobcurator_visits',
  PROPERTIES: 'imobcurator_properties',
  ACTIVITIES: 'imobcurator_activities'
} as const;

// ===== CLIENTS =====

export const getClients = (): Client[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading clients:', error);
    return [];
  }
};

export const saveClients = (clients: Client[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients:', error);
  }
};

export const addClient = (client: Client) => {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
};

export const updateClient = (clientId: string, updates: Partial<Client>) => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === clientId);

  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates };
    saveClients(clients);
  }
};

export const deleteClient = (clientId: string) => {
  const clients = getClients();
  saveClients(clients.filter(c => c.id !== clientId));
};

// ===== VISITS =====

export const getVisits = (): Visit[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VISITS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading visits:', error);
    return [];
  }
};

export const saveVisits = (visits: Visit[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  } catch (error) {
    console.error('Error saving visits:', error);
  }
};

export const addVisit = (visit: Visit) => {
  const visits = getVisits();
  visits.push(visit);
  saveVisits(visits);
};

export const updateVisit = (visitId: string, updates: Partial<Visit>) => {
  const visits = getVisits();
  const index = visits.findIndex(v => v.id === visitId);

  if (index !== -1) {
    visits[index] = { ...visits[index], ...updates };
    saveVisits(visits);
  }
};

export const deleteVisit = (visitId: string) => {
  const visits = getVisits();
  saveVisits(visits.filter(v => v.id !== visitId));
};

// ===== PROPERTIES =====

export const getProperties = (): Property[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading properties:', error);
    return [];
  }
};

export const saveProperties = (properties: Property[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  } catch (error) {
    console.error('Error saving properties:', error);
  }
};

export const addProperty = (property: Property) => {
  const properties = getProperties();
  properties.push(property);
  saveProperties(properties);
};

export const updateProperty = (propertyId: string, updates: Partial<Property>) => {
  const properties = getProperties();
  const index = properties.findIndex(p => p.id === propertyId);

  if (index !== -1) {
    properties[index] = { ...properties[index], ...updates };
    saveProperties(properties);
  }
};

export const deleteProperty = (propertyId: string) => {
  const properties = getProperties();
  saveProperties(properties.filter(p => p.id !== propertyId));
};

// ===== ACTIVITIES =====

export const getActivities = (): Activity[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading activities:', error);
    return [];
  }
};

export const saveActivities = (activities: Activity[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activities:', error);
  }
};

export const addActivity = (activity: Activity) => {
  const activities = getActivities();
  activities.unshift(activity); // Add to beginning
  saveActivities(activities);
};

// ===== UTILITY FUNCTIONS =====

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.VISITS);
  localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem('imobcurator_deals');
  localStorage.removeItem('imobcurator_reputation');
  localStorage.removeItem('imobcurator_reputation_month');
};
