/**
 * Visits Service - Supabase Integration
 * Gerenciamento de visitas agendadas
 */

import { supabase } from '@/lib/supabase';
import type { Visit } from '@/types';

export const visitsService = {
  /**
   * Lista todas as visitas do usuário atual
   */
  async getVisits(filters?: {
    status?: string;
    clientId?: string;
    propertyId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('visits')
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .order('date', { ascending: false });

    // Filtros
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.propertyId) {
      query = query.eq('property_id', filters.propertyId);
    }

    if (filters?.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('date', filters.dateTo);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar visitas:', error);
      throw error;
    }

    return { data: data as Visit[], count };
  },

  /**
   * Busca uma visita por ID
   */
  async getVisit(id: string) {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar visita:', error);
      throw error;
    }

    return data as Visit;
  },

  /**
   * Cria uma nova visita
   */
  async createVisit(visitData: {
    property_id: string;
    client_id: string;
    date: string;
    time: string;
    notes?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const timeline = [{
      status: 'REQUESTED',
      timestamp: new Date().toISOString(),
      completed: false,
    }];

    const { data, error } = await supabase
      .from('visits')
      .insert({
        ...visitData,
        user_id: user.id,
        status: 'REQUESTED',
        timeline,
      })
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .single();

    if (error) {
      console.error('❌ Erro ao criar visita:', error);
      throw error;
    }

    console.log('✅ Visita criada:', data);

    // Criar atividade automática
    await supabase.from('activities').insert({
      user_id: user.id,
      client_id: visitData.client_id,
      type: 'visit',
      title: 'Visita Agendada',
      description: `Visita agendada para ${visitData.date} às ${visitData.time}`,
      is_urgent: false,
    });

    return data as Visit;
  },

  /**
   * Atualiza uma visita existente
   */
  async updateVisit(id: string, updates: Partial<Visit>) {
    const { data: currentVisit, error: fetchError } = await supabase
      .from('visits')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar visita:', fetchError);
      throw fetchError;
    }

    // Se o status mudou, adicionar ao timeline
    let newTimeline = currentVisit.timeline || [];
    if (updates.status && updates.status !== currentVisit.status) {
      newTimeline = [
        ...newTimeline,
        {
          status: updates.status,
          timestamp: new Date().toISOString(),
          completed: updates.status === 'COMPLETED',
        },
      ];
    }

    const { data, error } = await supabase
      .from('visits')
      .update({
        ...updates,
        timeline: newTimeline,
      })
      .eq('id', id)
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar visita:', error);
      throw error;
    }

    console.log('✅ Visita atualizada:', data);
    return data as Visit;
  },

  /**
   * Cancela uma visita
   */
  async cancelVisit(id: string, reason?: string) {
    return this.updateVisit(id, {
      status: 'CANCELLED',
      notes: reason,
    });
  },

  /**
   * Confirma uma visita
   */
  async confirmVisit(id: string) {
    return this.updateVisit(id, {
      status: 'CONFIRMED',
    });
  },

  /**
   * Completa uma visita
   */
  async completeVisit(id: string, notes?: string) {
    return this.updateVisit(id, {
      status: 'COMPLETED',
      notes,
    });
  },

  /**
   * Deleta uma visita
   */
  async deleteVisit(id: string) {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar visita:', error);
      throw error;
    }

    console.log('✅ Visita deletada');
  },

  /**
   * Busca visitas de hoje
   */
  async getTodayVisits() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .eq('date', today)
      .order('time', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar visitas de hoje:', error);
      throw error;
    }

    return data as Visit[];
  },

  /**
   * Busca próximas visitas (próximos 7 dias)
   */
  async getUpcomingVisits() {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        client:clients(*),
        property:properties(*)
      `)
      .gte('date', today)
      .lte('date', nextWeek)
      .in('status', ['REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED'])
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar próximas visitas:', error);
      throw error;
    }

    return data as Visit[];
  },
};
