/**
 * Supabase Edge Function: create-portal-session
 * Cria uma sessão do Stripe Customer Portal
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
    const { userId, returnUrl } = await req.json();

    if (!userId) {
      throw new Error('userId é obrigatório');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar email do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Usuário não encontrado');
    }

    console.log('🔧 Buscando customer Stripe para:', userData.email);

    // Buscar customer no Stripe pelo email
    const customers = await stripe.customers.list({
      email: userData.email,
      limit: 1,
    });

    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('✅ Customer encontrado:', customerId);
    } else {
      // Criar customer se não existir
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { userId },
      });
      customerId = customer.id;
      console.log('✅ Customer criado:', customerId);
    }

    // Criar portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.headers.get('origin')}/settings`,
    });

    console.log('✅ Portal session criada');

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Erro ao criar portal session:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
