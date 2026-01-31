/**
 * useDashboard Hook - React Query
 * Hook para gerenciar dados do dashboard
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/supabase';

/**
 * Hook para buscar estatísticas do dashboard
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
  });
};

/**
 * Hook para buscar atividades recentes do dashboard
 */
export const useDashboardActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'activities', limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
    staleTime: 1000 * 60, // 1 minuto
  });
};

/**
 * Hook para buscar métricas mensais
 */
export const useMonthlyMetrics = (month?: string) => {
  return useQuery({
    queryKey: ['dashboard', 'monthly', month],
    queryFn: () => dashboardService.getMonthlyMetrics(month),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para atualizar reputação
 */
export const useUpdateReputation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reputation: Parameters<typeof dashboardService.updateReputation>[0]) =>
      dashboardService.updateReputation(reputation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
