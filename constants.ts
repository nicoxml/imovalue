import { LucideIcon, Calculator, Home, TrendingUp, RefreshCw, PieChart, Scale, Crown } from 'lucide-react';
import { CalculationType } from './types';

// Portugal IMT Bands 2024 (Simplified for Demo - Continente HPP)
export const IMT_BANDS = [
  { limit: 101917, rate: 0, deduction: 0 },
  { limit: 139412, rate: 0.02, deduction: 2038.34 },
  { limit: 187261, rate: 0.05, deduction: 6220.70 },
  { limit: 316772, rate: 0.07, deduction: 9965.86 },
  { limit: 633453, rate: 0.08, deduction: 13133.64 },
  { limit: 1102920, rate: 0.06, deduction: 0 }, // Single rate logic applies here in reality but simplified for tiers
  { limit: Infinity, rate: 0.075, deduction: 0 } // Above 1M is usually flat 7.5% depending on interpretation
];

export const NAV_ITEMS: { id: string; label: string; icon: LucideIcon; type?: CalculationType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: PieChart },
  { id: 'comparison', label: 'Comparar', icon: Scale },
  { id: 'buyer', label: 'Comprar', icon: Home, type: CalculationType.BUYER },
  { id: 'rental', label: 'Arrendar', icon: TrendingUp, type: CalculationType.RENTAL },
  { id: 'flip', label: 'Fix & Flip', icon: RefreshCw, type: CalculationType.FLIP },
  { id: 'seller', label: 'Vender', icon: Calculator, type: CalculationType.SELLER },
];

export const PLAN_LIMITS = {
  free: 5,
  pro: 100,
  premium: -1 // Unlimited
};