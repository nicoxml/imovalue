// Plan feature definitions and limits
export const PLAN_FEATURES = {
    free: {
        name: 'Free',
        maxCalculations: 5,
        calculators: ['buyer', 'rental'], // Only basic calculators
        pdfExport: false,
        pdfWatermark: true,
        aiAssistant: false,
        comparison: false,
        advancedDashboard: false,
        branding: false,
        historyLimit: 10,
    },
    pro: {
        name: 'Pro',
        maxCalculations: -1, // Unlimited
        calculators: ['buyer', 'rental', 'seller', 'flip'], // All calculators
        pdfExport: true,
        pdfWatermark: false,
        aiAssistant: false,
        comparison: true,
        advancedDashboard: false,
        branding: false,
        historyLimit: -1, // Unlimited
    },
    premium: {
        name: 'Premium',
        maxCalculations: -1, // Unlimited
        calculators: ['buyer', 'rental', 'seller', 'flip'], // All calculators
        pdfExport: true,
        pdfWatermark: false,
        aiAssistant: true,
        comparison: true,
        advancedDashboard: true,
        branding: true, // Custom branding in PDFs
        historyLimit: -1, // Unlimited
    },
} as const;

export type PlanType = keyof typeof PLAN_FEATURES;

// Helper to check if a feature is available for a plan
export const hasFeature = (plan: PlanType, feature: keyof typeof PLAN_FEATURES.free): boolean => {
    return PLAN_FEATURES[plan][feature] as boolean;
};

// Helper to check if a calculator is available for a plan
export const hasCalculator = (plan: PlanType, calculatorId: string): boolean => {
    return (PLAN_FEATURES[plan].calculators as readonly string[]).includes(calculatorId);
};

// Stripe Price IDs (from environment)
export const STRIPE_PRICES = {
    pro: import.meta.env.STRIPE_PRO_PRICE_ID || 'price_1SXQXBQmbQ33PKw9wkTDDmvV',
    premium: import.meta.env.STRIPE_PREMIUM_PRICE_ID || 'price_1SXQXUQmbQ33PKw93axmBN3D',
} as const;
