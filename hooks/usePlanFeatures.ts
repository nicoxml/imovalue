import { useMemo } from 'react';
import { User } from '../types';
import { PLAN_FEATURES, hasFeature, hasCalculator } from '../constants/plans';

/**
 * Custom hook to check feature availability based on user's plan
 * @param user - The current user object
 * @returns Object with feature availability checks
 */
export const usePlanFeatures = (user: User | null) => {
    return useMemo(() => {
        if (!user || user.isDemo) {
            // Demo users get free plan features
            return {
                plan: 'free' as const,
                features: PLAN_FEATURES.free,
                canExportPDF: false,
                canUseAI: false,
                canCompare: false,
                canAccessCalculator: (calculatorId: string) => hasCalculator('free', calculatorId),
                hasReachedLimit: user ? user.creditsUsed >= user.maxCredits : false,
                remainingCalculations: user ? Math.max(0, user.maxCredits - user.creditsUsed) : 0,
            };
        }

        const plan = user.plan;
        const features = PLAN_FEATURES[plan];

        return {
            plan,
            features,
            canExportPDF: hasFeature(plan, 'pdfExport'),
            canUseAI: hasFeature(plan, 'aiAssistant'),
            canCompare: hasFeature(plan, 'comparison'),
            canAccessCalculator: (calculatorId: string) => hasCalculator(plan, calculatorId),
            hasReachedLimit: user.maxCredits !== -1 && user.creditsUsed >= user.maxCredits,
            remainingCalculations: user.maxCredits === -1 ? Infinity : Math.max(0, user.maxCredits - user.creditsUsed),
            isSubscriptionActive: user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing',
        };
    }, [user]);
};
