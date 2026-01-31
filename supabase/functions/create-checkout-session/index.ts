/**
 * Supabase Edge Function: create-checkout-session
 * Cria uma sessão de checkout do Stripe
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, email, priceId, successUrl, cancelUrl } = await req.json();

    // Validar inputs
    if (!userId || !email) {
      throw new Error('userId e email são obrigatórios');
    }

    // ID do preço Pro (criar no Stripe Dashboard)
    const STRIPE_PRICE_ID = priceId || Deno.env.get('STRIPE_PRO_PRICE_ID') || 'price_...';<br/>
    console.log('🔧 Criando checkout session para:', email);

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: userId,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get('origin')}/success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/canceled`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    console.log('✅ Checkout session criada:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout session:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
