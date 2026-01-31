/**
 * useActivities Hook - React Query
 * Hook para gerenciar atividades com cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesService } from '@/services/supabase';
import type { Activity } from '@/types';

/**
 * Hook para listar atividades
 */
export const useActivities = (filters?: Parameters<typeof activitiesService.getActivities>[0]) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => activitiesService.getActivities(filters),
    staleTime: 1000 * 60, // 1 minuto
  });
};

/**
 * Hook para buscar atividades recentes
 */
export const useRecentActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: ['activities', 'recent', limit],
    queryFn: () => activitiesService.getRecentActivities(limit),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 2, // Refetch a cada 2 minutos
  });
};

/**
 * Hook para buscar atividades urgentes
 */
export const useUrgentActivities = () => {
  return useQuery({
    queryKey: ['activities', 'urgent'],
    queryFn: () => activitiesService.getUrgentActivities(),
    staleTime: 1000 * 30, // 30 segundos
    refetchInterval: 1000 * 60, // Refetch a cada minuto
  });
};

/**
 * Hook para buscar atividades de um cliente
 */
export const useClientActivities = (clientId: string) => {
  return useQuery({
    queryKey: ['activities', 'client', clientId],
    queryFn: () => activitiesService.getClientActivities(clientId),
    enabled: !!clientId,
  });
};

/**
 * Hook para criar uma atividade
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof activitiesService.createActivity>[0]) =>
      activitiesService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/**
 * Hook para deletar uma atividade
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activitiesService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

/**
 * Hook para limpar atividades antigas
 */
export const useCleanupOldActivities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activitiesService.cleanupOldActivities(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};
