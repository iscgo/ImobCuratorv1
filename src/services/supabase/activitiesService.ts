/**
 * Activities Service - Supabase Integration
 * Gerenciamento de timeline de atividades
 */

import { supabase } from '@/lib/supabase';
import type { Activity } from '@/types';

export const activitiesService = {
  /**
   * Lista todas as atividades do usuário atual
   */
  async getActivities(filters?: {
    clientId?: string;
    type?: string;
    isUrgent?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('activities')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });

    // Filtros
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.isUrgent !== undefined) {
      query = query.eq('is_urgent', filters.isUrgent);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar atividades:', error);
      throw error;
    }

    return { data: data as Activity[], count };
  },

  /**
   * Cria uma nova atividade
   */
  async createActivity(activityData: {
    client_id?: string;
    type: 'inquiry' | 'visit' | 'contract' | 'system';
    title: string;
    description: string;
    is_urgent?: boolean;
  }) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        ...activityData,
        user_id: user.id,
        is_urgent: activityData.is_urgent || false,
      })
      .select(`
        *,
        client:clients(*)
      `)
      .single();

    if (error) {
      console.error('❌ Erro ao criar atividade:', error);
      throw error;
    }

    console.log('✅ Atividade criada:', data);
    return data as Activity;
  },

  /**
   * Busca atividades recentes (últimas 10)
   */
  async getRecentActivities(limit: number = 10) {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Erro ao buscar atividades recentes:', error);
      throw error;
    }

    return data as Activity[];
  },

  /**
   * Busca atividades urgentes
   */
  async getUrgentActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('is_urgent', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar atividades urgentes:', error);
      throw error;
    }

    return data as Activity[];
  },

  /**
   * Busca atividades de um cliente específico
   */
  async getClientActivities(clientId: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar atividades do cliente:', error);
      throw error;
    }

    return data as Activity[];
  },

  /**
   * Deleta uma atividade
   */
  async deleteActivity(id: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar atividade:', error);
      throw error;
    }

    console.log('✅ Atividade deletada');
  },

  /**
   * Limpa atividades antigas (mais de 90 dias)
   */
  async cleanupOldActivities() {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('activities')
      .delete()
      .lt('created_at', ninetyDaysAgo)
      .select('id');

    if (error) {
      console.error('❌ Erro ao limpar atividades antigas:', error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} atividades antigas deletadas`);
    return data?.length || 0;
  },
};
