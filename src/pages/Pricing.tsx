/**
 * Pricing Page
 * Página de planos e pricing
 */

import React, { useState } from 'react';
import { Check, Zap, Crown, Loader2 } from 'lucide-react';
import { billingService } from '@/services/billingService';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export const Pricing: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const { url } = await billingService.createCheckoutSession();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      period: 'para sempre',
      icon: Zap,
      features: [
        '2 buscas de imóveis por mês',
        '10 clientes máximo',
        'Gestão básica de visitas',
        'Dashboard com KPIs básicos',
        'Sistema de reputação',
        'Suporte via email',
      ],
      limitations: [
        'Buscas limitadas',
        'Sem upload de imagens',
        'Sem relatórios avançados',
      ],
      cta: 'Plano Atual',
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€10',
      period: 'por mês',
      icon: Crown,
      popular: true,
      features: [
        'Buscas ilimitadas com IA',
        'Clientes ilimitados',
        'Upload de imagens (Cloudinary)',
        'Relatórios avançados',
        'Exportação PDF',
        'Analytics detalhado',
        'Suporte prioritário',
        'Notificações avançadas',
        'Calendário de visitas',
        'WhatsApp integration',
      ],
      cta: 'Upgrade para Pro',
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comece grátis e faça upgrade quando quiser
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={`
                  relative rounded-2xl p-8
                  ${isPro
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl transform scale-105'
                    : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                      🔥 Mais Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6">
                  <Icon className={`h-12 w-12 ${isPro ? 'text-yellow-300' : 'text-blue-500'}`} />
                </div>

                {/* Name & Price */}
                <h3 className={`text-2xl font-bold mb-2 ${isPro ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${isPro ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${isPro ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {' '}{plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isPro ? 'text-green-300' : 'text-green-500'}`} />
                      <span className={`text-sm ${isPro ? 'text-blue-50' : 'text-gray-600 dark:text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Limitations (Free only) */}
                {plan.limitations && (
                  <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Limitações:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={isPro ? handleUpgrade : undefined}
                  disabled={loading || plan.current}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold transition-all
                    ${isPro
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
                    }
                    ${loading ? 'opacity-50 cursor-wait' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {loading && isPro ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Sim! Você pode cancelar sua assinatura Pro a qualquer momento através do Customer Portal.
                Não há taxa de cancelamento.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                O que acontece se eu atingir o limite do plano Free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Você poderá continuar usando todas as funcionalidades, exceto a busca de imóveis com IA.
                Para fazer novas buscas, será necessário fazer upgrade para Pro.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quais métodos de pagamento vocês aceitam?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Aceitamos todos os cartões de crédito e débito através do Stripe: Visa, Mastercard,
                American Express, e outros.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Existe um plano anual com desconto?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Em breve! Estamos preparando um plano anual com 20% de desconto (€96/ano ao invés de €120/ano).
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Pagamento seguro via Stripe
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Cancele quando quiser
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Suporte em português
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
