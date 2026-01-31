/**
 * Clients Service - Supabase Integration
 * Gerenciamento de clientes dos corretores
 */

import { supabase } from '@/lib/supabase';
import type { Client } from '@/types';

export const clientsService = {
  /**
   * Lista todos os clientes do usuário atual
   */
  async getClients(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('clients')
      .select('*')
      .order('last_activity', { ascending: false });

    // Filtros
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      throw error;
    }

    return { data: data as Client[], count };
  },

  /**
   * Busca um cliente por ID
   */
  async getClient(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar cliente:', error);
      throw error;
    }

    return data as Client;
  },

  /**
   * Cria um novo cliente
   */
  async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...clientData,
        user_id: user.id,
        last_activity: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar cliente:', error);
      throw error;
    }

    console.log('✅ Cliente criado:', data);
    return data as Client;
  },

  /**
   * Atualiza um cliente existente
   */
  async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        last_activity: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      throw error;
    }

    console.log('✅ Cliente atualizado:', data);
    return data as Client;
  },

  /**
   * Deleta um cliente (soft delete - arquiva)
   */
  async deleteClient(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        status: 'Archived',
        archived_date: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao arquivar cliente:', error);
      throw error;
    }

    console.log('✅ Cliente arquivado:', data);
    return data as Client;
  },

  /**
   * Deleta permanentemente um cliente
   */
  async hardDeleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar cliente:', error);
      throw error;
    }

    console.log('✅ Cliente deletado permanentemente');
  },

  /**
   * Busca clientes arquivados
   */
  async getArchivedClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', 'Archived')
      .order('archived_date', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar clientes arquivados:', error);
      throw error;
    }

    return data as Client[];
  },

  /**
   * Restaura um cliente arquivado
   */
  async restoreClient(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        status: 'Inactive',
        archived_date: null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao restaurar cliente:', error);
      throw error;
    }

    console.log('✅ Cliente restaurado:', data);
    return data as Client;
  },

  /**
   * Conta clientes por status
   */
  async getClientStats() {
    const { data, error } = await supabase
      .from('clients')
      .select('status');

    if (error) {
      console.error('❌ Erro ao buscar stats:', error);
      throw error;
    }

    const stats = data.reduce((acc: any, client: any) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {});

    return stats;
  },
};
