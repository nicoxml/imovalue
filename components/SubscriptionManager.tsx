import React, { useState } from 'react';
import { User } from '../types';
import { PremiumCard } from './ui/premium/Card';
import { PremiumButton } from './ui/premium/Button';
import { Check, Crown, Zap } from 'lucide-react';
import { usePlanFeatures } from '../hooks/usePlanFeatures';
import { createCheckoutSession } from '../services/stripeService';

interface SubscriptionManagerProps {
    user: User;
    onUpdatePlan: (newPlan: 'free' | 'pro' | 'premium') => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user, onUpdatePlan }) => {
    const { plan, features } = usePlanFeatures(user);
    const [isProcessing, setIsProcessing] = useState(false);

    const plans = [
        {
            id: 'free' as const,
            name: 'Free',
            price: '€0',
            icon: Zap,
            color: 'text-gray-400',
            priceId: null,
            features: [
                '5 Cálculos / mês',
                'Calculadora de Compra',
                'Calculadora de Arrendamento',
                'PDFs com marca d\'água',
            ],
        },
        {
            id: 'pro' as const,
            name: 'Pro',
            price: '€9,90',
            period: '/mês',
            icon: Check,
            color: 'text-brand-blue',
            priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_1SXQXBQmbQ33PKw9wkTDDmvV',
            features: [
                'Cálculos ilimitados',
                'Todas as Calculadoras (Flip, Venda)',
                'PDFs Completos',
                'Comparador de Imóveis',
            ],
        },
        {
            id: 'premium' as const,
            name: 'Premium',
            price: '€19,00',
            period: '/mês',
            icon: Crown,
            color: 'text-brand-yield',
            recommended: true,
            priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_1SXQXUQmbQ33PKw93axmBN3D',
            features: [
                'Tudo do plano Pro',
                'IMOVALUE AI Assistant',
                'Personalização de Marca (Branding)',
                'Dashboard Avançado',
                'Histórico Ilimitado',
            ],
        },
    ];

    const handleUpgrade = async (targetPlan: 'free' | 'pro' | 'premium') => {
        if (targetPlan === 'free') {
            // Downgrade to free - this should be handled via Stripe Customer Portal
            alert('Para cancelar a subscrição, use o portal de gestão do Stripe.');
            return;
        }

        const selectedPlan = plans.find(p => p.id === targetPlan);
        if (!selectedPlan?.priceId) {
            alert('Erro: Price ID não configurado para este plano.');
            return;
        }

        setIsProcessing(true);

        try {
            await createCheckoutSession(
                selectedPlan.priceId,
                user.id,
                user.email
            );
            // User will be redirected to Stripe Checkout
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Gerir Subscrição</h2>
                <p className="text-gray-400">Plano atual: <span className="text-brand-blue font-semibold">{plan.toUpperCase()}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((planOption) => {
                    const isCurrentPlan = planOption.id === plan;
                    const Icon = planOption.icon;

                    return (
                        <PremiumCard
                            key={planOption.id}
                            className={`relative ${planOption.recommended ? 'border-brand-yield/50 shadow-xl shadow-brand-yield/10' : ''
                                } ${isCurrentPlan ? 'ring-2 ring-brand-blue' : ''}`}
                        >
                            {planOption.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yield text-brand-black px-4 py-1 rounded-full text-xs font-bold">
                                    RECOMENDADO
                                </div>
                            )}

                            {isCurrentPlan && (
                                <div className="absolute -top-3 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold">
                                    ATUAL
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <Icon className={`w-12 h-12 mx-auto mb-4 ${planOption.color}`} />
                                <h3 className="text-xl font-bold text-white mb-2">{planOption.name}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-white">{planOption.price}</span>
                                    {planOption.period && (
                                        <span className="text-gray-400 text-sm">{planOption.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {planOption.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-brand-yield mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {!isCurrentPlan && (
                                <PremiumButton
                                    onClick={() => handleUpgrade(planOption.id)}
                                    variant={planOption.recommended ? 'primary' : 'secondary'}
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Redirecionando...' : `Mudar para ${planOption.name}`}
                                </PremiumButton>
                            )}

                            {isCurrentPlan && planOption.id !== 'free' && (
                                <PremiumButton
                                    onClick={() => handleUpgrade('free')}
                                    variant="outline"
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    Cancelar Subscrição
                                </PremiumButton>
                            )}
                        </PremiumCard>
                    );
                })}
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-sm text-green-300">
                    <strong>✅ Stripe Ativo:</strong> Os pagamentos são processados de forma segura através do Stripe.
                    Após o pagamento, o seu plano será atualizado automaticamente.
                </p>
            </div>
        </div>
    );
};
