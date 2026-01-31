/**
 * Dashboard Service - Supabase Integration
 * KPIs e estatísticas para o dashboard
 */

import { supabase } from '@/lib/supabase';

export const dashboardService = {
  /**
   * Busca estatísticas do dashboard
   */
  async getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar dados em paralelo
    const [
      clientsResult,
      propertiesResult,
      visitsResult,
      activitiesResult,
      userResult,
    ] = await Promise.all([
      // Total de clientes por status
      supabase
        .from('clients')
        .select('status', { count: 'exact' }),

      // Total de propriedades
      supabase
        .from('properties')
        .select('id', { count: 'exact' }),

      // Visitas
      supabase
        .from('visits')
        .select('status, date', { count: 'exact' }),

      // Atividades recentes
      supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),

      // Dados do usuário
      supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single(),
    ]);

    // Processar clientes por status
    const clientsByStatus = clientsResult.data?.reduce((acc: any, client: any) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Processar visitas
    const today = new Date().toISOString().split('T')[0];
    const visitsToday = visitsResult.data?.filter((v: any) => v.date === today) || [];
    const visitsPending = visitsResult.data?.filter((v: any) =>
      v.status === 'REQUESTED' || v.status === 'PENDING_CONFIRMATION'
    ) || [];
    const visitsCompleted = visitsResult.data?.filter((v: any) =>
      v.status === 'COMPLETED'
    ) || [];

    // Calcular stats
    const stats = {
      clients: {
        total: clientsResult.count || 0,
        searching: clientsByStatus['Searching'] || 0,
        visiting: clientsByStatus['Visiting'] || 0,
        offerMade: clientsByStatus['Offer Made'] || 0,
        closed: clientsByStatus['Closed'] || 0,
        inactive: clientsByStatus['Inactive'] || 0,
        archived: clientsByStatus['Archived'] || 0,
      },
      properties: {
        total: propertiesResult.count || 0,
      },
      visits: {
        total: visitsResult.count || 0,
        today: visitsToday.length,
        pending: visitsPending.length,
        completed: visitsCompleted.length,
      },
      recentActivities: activitiesResult.data || [],
      user: userResult.data,
      reputation: userResult.data?.reputation || {
        level: 'NEUTRAL',
        winStreak: 0,
        lossStreak: 0,
      },
      plan: {
        type: userResult.data?.plan || 'FREE',
        searchesUsed: userResult.data?.searches_used || 0,
        maxSearches: userResult.data?.max_searches || 2,
      },
    };

    return stats;
  },

  /**
   * Busca atividades recentes
   */
  async getRecentActivities(limit: number = 10) {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        client:clients(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Erro ao buscar atividades recentes:', error);
      throw error;
    }

    return data;
  },

  /**
   * Atualiza reputação do usuário
   */
  async updateReputation(reputation: {
    level: 'ELITE' | 'GOOD' | 'NEUTRAL' | 'RISK';
    winStreak: number;
    lossStreak: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('users')
      .update({ reputation })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar reputação:', error);
      throw error;
    }

    console.log('✅ Reputação atualizada:', data.reputation);
    return data;
  },

  /**
   * Busca métricas mensais
   */
  async getMonthlyMetrics(month?: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Calcular primeiro e último dia do mês
    const now = month ? new Date(month) : new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // Buscar dados do mês
    const [clientsResult, visitsResult] = await Promise.all([
      // Clientes fechados no mês
      supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .eq('status', 'Closed')
        .gte('updated_at', firstDay)
        .lte('updated_at', lastDay),

      // Visitas completadas no mês
      supabase
        .from('visits')
        .select('*', { count: 'exact' })
        .eq('status', 'COMPLETED')
        .gte('date', firstDay.split('T')[0])
        .lte('date', lastDay.split('T')[0]),
    ]);

    return {
      month: now.toISOString().slice(0, 7),
      dealsClosed: clientsResult.count || 0,
      visitsCompleted: visitsResult.count || 0,
    };
  },
};
