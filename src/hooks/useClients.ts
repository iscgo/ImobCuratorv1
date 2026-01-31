/**
 * useClients Hook - React Query
 * Hook para gerenciar clientes com cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services/supabase';
import type { Client } from '@/types';

/**
 * Hook para listar clientes
 */
export const useClients = (filters?: Parameters<typeof clientsService.getClients>[0]) => {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsService.getClients(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para buscar um cliente específico
 */
export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getClient(id),
    enabled: !!id,
  });
};

/**
 * Hook para buscar clientes arquivados
 */
export const useArchivedClients = () => {
  return useQuery({
    queryKey: ['clients', 'archived'],
    queryFn: () => clientsService.getArchivedClients(),
  });
};

/**
 * Hook para estatísticas de clientes
 */
export const useClientStats = () => {
  return useQuery({
    queryKey: ['clients', 'stats'],
    queryFn: () => clientsService.getClientStats(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para criar um cliente
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) =>
      clientsService.createClient(data),
    onSuccess: () => {
      // Invalidar queries de clientes para refetch
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook para atualizar um cliente
 */
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientsService.updateClient(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cliente específico e lista
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook para deletar (arquivar) um cliente
 */
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook para restaurar um cliente arquivado
 */
export const useRestoreClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.restoreClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
