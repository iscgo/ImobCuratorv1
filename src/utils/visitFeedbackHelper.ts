// Sistema de detecção de visitas pendentes de feedback

import { getVisits } from './storage';
import { getDeals } from './deals';
import { PendingFeedback } from './deals';
import { VisitStatus } from '../types';

/**
 * Detecta visitas que já passaram e precisam de feedback
 * Retorna lista de visitas pendentes com todos os dados necessários
 */
export const getPendingFeedbackVisits = (): PendingFeedback[] => {
  const visits = getVisits();
  const deals = getDeals();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  const pendingVisits: PendingFeedback[] = [];

  for (const visit of visits) {
    // Verificar se a visita já passou
    const visitDate = new Date(visit.date);
    visitDate.setHours(0, 0, 0, 0);

    const isPastVisit = visitDate < today;
    const isCompletedOrConfirmed =
      visit.status === VisitStatus.COMPLETED ||
      visit.status === VisitStatus.CONFIRMED;

    // Verificar se já existe feedback (deal) para esta visita
    const hasFeedback = deals.some(deal =>
      deal.clientId === visit.clientId &&
      deal.propertyId === visit.propertyId
    );

    // Se a visita passou, está completada/confirmada e não tem feedback, adicionar à lista
    if (isPastVisit && isCompletedOrConfirmed && !hasFeedback) {
      pendingVisits.push({
        visitId: visit.id,
        clientId: visit.clientId,
        clientName: visit.clientName,
        clientAvatar: visit.clientAvatar,
        propertyId: visit.propertyId,
        propertyTitle: visit.propertyTitle,
        propertyPrice: `€${visit.propertyImage}`, // Assumindo que o preço está armazenado em algum lugar
        date: visit.date
      });
    }
  }

  // Ordenar por data (mais recentes primeiro)
  pendingVisits.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return pendingVisits;
};

/**
 * Retorna o número de visitas pendentes de feedback
 */
export const getPendingFeedbackCount = (): number => {
  return getPendingFeedbackVisits().length;
};

/**
 * Verifica se uma visita específica precisa de feedback
 */
export const needsFeedback = (visitId: string): boolean => {
  const pendingVisits = getPendingFeedbackVisits();
  return pendingVisits.some(v => v.visitId === visitId);
};

/**
 * Marca visitas antigas como COMPLETED automaticamente
 * (útil para visitas que passaram mas ainda estão como CONFIRMED)
 */
export const autoCompleteOldVisits = () => {
  const visits = getVisits();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let hasChanges = false;

  const updatedVisits = visits.map(visit => {
    const visitDate = new Date(visit.date);
    visitDate.setHours(0, 0, 0, 0);

    // Se a visita passou e ainda está CONFIRMED, mudar para COMPLETED
    if (visitDate < today && visit.status === VisitStatus.CONFIRMED) {
      hasChanges = true;
      return { ...visit, status: VisitStatus.COMPLETED };
    }

    return visit;
  });

  if (hasChanges) {
    const { saveVisits } = require('./storage');
    saveVisits(updatedVisits);
  }

  return hasChanges;
};
