/**
 * Supabase Edge Function: stripe-webhook
 * Processa eventos do Stripe webhook
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('🔔 Webhook recebido:', event.type);

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) {
          console.error('❌ userId não encontrado no session');
          break;
        }

        console.log('✅ Checkout completado para usuário:', userId);

        // Atualizar plano do usuário para PRO
        const { error } = await supabase
          .from('users')
          .update({
            plan: 'PRO',
            max_searches: 999999, // Ilimitado
          })
          .eq('id', userId);

        if (error) {
          console.error('❌ Erro ao atualizar usuário:', error);
        } else {
          console.log('✅ Usuário atualizado para PRO');
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.error('❌ userId não encontrado na subscription');
          break;
        }

        const isActive = subscription.status === 'active';
        const plan = isActive ? 'PRO' : 'FREE';
        const maxSearches = isActive ? 999999 : 2;

        console.log(`📝 Subscription ${isActive ? 'ativa' : 'cancelada'} para usuário:`, userId);

        // Atualizar plano
        const { error } = await supabase
          .from('users')
          .update({
            plan,
            max_searches: maxSearches,
          })
          .eq('id', userId);

        if (error) {
          console.error('❌ Erro ao atualizar usuário:', error);
        } else {
          console.log(`✅ Usuário atualizado para ${plan}`);
        }
        break;
      }

      default:
        console.log('ℹ️ Evento não tratado:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
