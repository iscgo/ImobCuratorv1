/**
 * useProperties Hook - React Query
 * Hook para gerenciar propriedades com cache e mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesService } from '@/services/supabase';
import type { Property } from '@/types';

/**
 * Hook para listar propriedades
 */
export const useProperties = (filters?: Parameters<typeof propertiesService.getProperties>[0]) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertiesService.getProperties(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para buscar uma propriedade específica
 */
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => propertiesService.getProperty(id),
    enabled: !!id,
  });
};

/**
 * Hook para buscar propriedades de um cliente
 */
export const useClientProperties = (clientId: string) => {
  return useQuery({
    queryKey: ['properties', 'client', clientId],
    queryFn: () => propertiesService.getClientProperties(clientId),
    enabled: !!clientId,
  });
};

/**
 * Hook para criar uma propriedade
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) =>
      propertiesService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook para criar múltiplas propriedades (bulk)
 */
export const useCreateProperties = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (properties: Omit<Property, 'id' | 'created_at' | 'updated_at'>[]) =>
      propertiesService.createProperties(properties),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook para atualizar uma propriedade
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      propertiesService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook para deletar uma propriedade
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook para associar propriedade a cliente
 */
export const useLinkPropertyToClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, clientId }: { propertyId: string; clientId: string }) =>
      propertiesService.linkPropertyToClient(propertyId, clientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'client', variables.clientId] });
    },
  });
};

/**
 * Hook para remover associação propriedade-cliente
 */
export const useUnlinkPropertyFromClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, clientId }: { propertyId: string; clientId: string }) =>
      propertiesService.unlinkPropertyFromClient(propertyId, clientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'client', variables.clientId] });
    },
  });
};

/**
 * Hook para busca de texto completo
 */
export const useSearchProperties = (searchText: string) => {
  return useQuery({
    queryKey: ['properties', 'search', searchText],
    queryFn: () => propertiesService.searchProperties(searchText),
    enabled: searchText.length > 2,
  });
};
