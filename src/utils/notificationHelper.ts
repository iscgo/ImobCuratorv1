// Sistema de notificações para visitas pendentes de feedback

import { Notification } from '../types';
import { getPendingFeedbackCount } from './visitFeedbackHelper';

const NOTIFICATIONS_STORAGE_KEY = 'imobcurator_notifications';

/**
 * Retorna todas as notificações
 */
export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
};

/**
 * Salva notificações
 */
const saveNotifications = (notifications: Notification[]) => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

/**
 * Cria notificação para visitas pendentes de feedback
 */
export const createFeedbackNotification = (count: number): Notification => {
  const notification: Notification = {
    id: `notification-feedback-${Date.now()}`,
    type: 'feedback_like',
    title: 'Visitas Pendentes de Feedback',
    message: `Você tem ${count} visita${count > 1 ? 's' : ''} que precisa${count > 1 ? 'm' : ''} de feedback. Vendeu ou não vendeu?`,
    time: new Date().toISOString(),
    read: false,
    actionUrl: '/reports'
  };

  const notifications = getNotifications();

  // Verificar se já existe notificação similar não lida
  const existingIndex = notifications.findIndex(
    n => n.type === 'feedback_like' && !n.read
  );

  if (existingIndex !== -1) {
    // Atualizar notificação existente
    notifications[existingIndex] = notification;
  } else {
    // Adicionar nova notificação
    notifications.unshift(notification);
  }

  saveNotifications(notifications);
  return notification;
};

/**
 * Marca notificação como lida
 */
export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getNotifications();
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
};

/**
 * Marca todas as notificações como lidas
 */
export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
};

/**
 * Retorna contagem de notificações não lidas
 */
export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};

/**
 * Remove notificação
 */
export const deleteNotification = (notificationId: string) => {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== notificationId);
  saveNotifications(updated);
};

/**
 * Limpa todas as notificações
 */
export const clearAllNotifications = () => {
  saveNotifications([]);
};

/**
 * Verifica se há visitas pendentes e cria notificação se necessário
 */
export const checkAndCreateFeedbackNotifications = () => {
  const pendingCount = getPendingFeedbackCount();

  if (pendingCount > 0) {
    createFeedbackNotification(pendingCount);
    return true;
  }

  return false;
};

/**
 * Cria notificação de agenda para visita próxima
 */
export const createAgendaNotification = (clientName: string, propertyTitle: string, date: string): Notification => {
  const notification: Notification = {
    id: `notification-agenda-${Date.now()}`,
    type: 'agenda',
    title: 'Visita Agendada',
    message: `Visita com ${clientName} para ${propertyTitle} em ${new Date(date).toLocaleDateString('pt-PT')}`,
    time: new Date().toISOString(),
    read: false,
    actionUrl: '/visits'
  };

  const notifications = getNotifications();
  notifications.unshift(notification);
  saveNotifications(notifications);

  return notification;
};
