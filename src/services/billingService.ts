/**
 * Billing Service - Stripe Integration
 * Gerenciamento de planos e pagamentos
 */

import { supabase } from '@/lib/supabase';

export const billingService = {
  /**
   * Cria uma sessão de checkout do Stripe
   */
  async createCheckoutSession(priceId?: string): Promise<{ url: string }> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Chamar Edge Function do Supabase
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          email: user.email,
          priceId: priceId || process.env.VITE_STRIPE_PRICE_ID,
          successUrl: `${window.location.origin}/#/settings?tab=billing&success=true`,
          cancelUrl: `${window.location.origin}/#/settings?tab=billing&canceled=true`,
        },
      });

      if (error) {
        console.error('❌ Erro ao criar checkout session:', error);
        throw error;
      }

      console.log('✅ Checkout session criada:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Erro no billing service:', error);
      throw new Error(`Falha ao criar checkout: ${error.message}`);
    }
  },

  /**
   * Cria uma sessão do Customer Portal
   */
  async createPortalSession(): Promise<{ url: string }> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId: user.id,
          returnUrl: `${window.location.origin}/#/settings?tab=billing`,
        },
      });

      if (error) {
        console.error('❌ Erro ao criar portal session:', error);
        throw error;
      }

      console.log('✅ Portal session criada:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Erro no billing service:', error);
      throw new Error(`Falha ao abrir portal: ${error.message}`);
    }
  },

  /**
   * Verifica o plano atual do usuário
   */
  async getCurrentPlan() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('users')
      .select('plan, searches_used, max_searches')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar plano:', error);
      throw error;
    }

    return {
      plan: data.plan,
      searchesUsed: data.searches_used,
      maxSearches: data.max_searches,
      canSearch: data.plan === 'PRO' || data.searches_used < data.max_searches,
    };
  },

  /**
   * Upgrade para Pro
   */
  async upgradeToPro(): Promise<{ url: string }> {
    // Por enquanto, redireciona para criar checkout
    // No futuro, pode ter lógica mais complexa
    return this.createCheckoutSession();
  },

  /**
   * Verificar se precisa upgrade
   */
  async needsUpgrade(): Promise<boolean> {
    const plan = await this.getCurrentPlan();
    return plan.plan === 'FREE' && !plan.canSearch;
  },
};
