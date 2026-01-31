/**
 * useVisits Hook - React Query
 * Hook para gerenciar visitas com cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitsService } from '@/services/supabase';
import type { Visit } from '@/types';

/**
 * Hook para listar visitas
 */
export const useVisits = (filters?: Parameters<typeof visitsService.getVisits>[0]) => {
  return useQuery({
    queryKey: ['visits', filters],
    queryFn: () => visitsService.getVisits(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos (mais frequente)
  });
};

/**
 * Hook para buscar uma visita específica
 */
export const useVisit = (id: string) => {
  return useQuery({
    queryKey: ['visits', id],
    queryFn: () => visitsService.getVisit(id),
    enabled: !!id,
  });
};

/**
 * Hook para buscar visitas de hoje
 */
export const useTodayVisits = () => {
  return useQuery({
    queryKey: ['visits', 'today'],
    queryFn: () => visitsService.getTodayVisits(),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
  });
};

/**
 * Hook para buscar próximas visitas
 */
export const useUpcomingVisits = () => {
  return useQuery({
    queryKey: ['visits', 'upcoming'],
    queryFn: () => visitsService.getUpcomingVisits(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

/**
 * Hook para criar uma visita
 */
export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof visitsService.createVisit>[0]) =>
      visitsService.createVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] }); // Invalidar atividades também
    },
  });
};

/**
 * Hook para atualizar uma visita
 */
export const useUpdateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Visit> }) =>
      visitsService.updateVisit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visits', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};

/**
 * Hook para cancelar uma visita
 */
export const useCancelVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      visitsService.cancelVisit(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};

/**
 * Hook para confirmar uma visita
 */
export const useConfirmVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => visitsService.confirmVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};

/**
 * Hook para completar uma visita
 */
export const useCompleteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      visitsService.completeVisit(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};

/**
 * Hook para deletar uma visita
 */
export const useDeleteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => visitsService.deleteVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
};
