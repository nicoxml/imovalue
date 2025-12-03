import React, { useState } from 'react';
import { PremiumCard } from '../ui/premium/Card';
import { PremiumInput } from '../ui/premium/Input';
import { PremiumButton } from '../ui/premium/Button';
import { PDFExportButton } from '../ui/premium/PDFExportButton';
import { AnimatedNumber } from '../ui/premium/AnimatedNumber';
import { Reveal } from '../ui/premium/Reveal';
import { calculateRentalYield } from '../../services/calculatorService';
import { exportRentalCalculatorPDF } from '../../services/pdfService';
import { validators, validateRentalInputs } from '../../utils/validation';
import { RentalResult, CalculationType, SavedProperty, User } from '../../types';
import { Building2, Scale, MessageSquare, Hammer, Play } from 'lucide-react';
import { AIAssistant } from '../ai/AIAssistant';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RentalCalculatorProps {
  onSave: (property: SavedProperty) => void;
  onCalculate: (value: string, label: string, numericValue: number) => void;
  onAttemptCalculate: () => Promise<boolean>;
  user: User;
}

export const RentalCalculator: React.FC<RentalCalculatorProps> = ({ onSave, onCalculate, onAttemptCalculate, user }) => {
  const [price, setPrice] = useState(200000);
  const [renovation, setRenovation] = useState(15000);
  const [rent, setRent] = useState(800);
  const [expenses, setExpenses] = useState(150);
  const [result, setResult] = useState<RentalResult | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Validation errors
  const [priceError, setPriceError] = useState<string>("");
  const [renovationError, setRenovationError] = useState<string>("");
  const [rentError, setRentError] = useState<string>("");
  const [expensesError, setExpensesError] = useState<string>("");

  // Manual Calculation Trigger
  const handleExportPDF = async () => {
    if (!result) return;
    await exportRentalCalculatorPDF(user);
  };
  const handleCalculate = async () => {
    // Validate all inputs
    const validationErrors = validateRentalInputs(
      Number(price),
      Number(renovation),
      Number(rent),
      Number(expenses)
    );

    // Set individual error states
    setPriceError(validationErrors.price || '');
    setRenovationError(validationErrors.renovation || '');
    setRentError(validationErrors.rent || '');
    // Note: expenses doesn't have a dedicated error state in the component, but validation still checks it

    // If there are any errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!onAttemptCalculate || !(await onAttemptCalculate())) return;

    const res = calculateRentalYield(Number(price), Number(renovation), Number(rent), Number(expenses));
    setResult(res);
    if (onCalculate) {
      onCalculate(`Yield ${res.netYield.toFixed(1)}%`, `Rental(Inv: €${(res.totalInvestment / 1000).toFixed(0)}k)`, res.totalInvestment);
    }
  };

  const handleSave = () => {
    if (!result || !onSave) return;
    const name = window.prompt("Nome do Investimento (ex: T1 Porto):", `Investimento €${price.toLocaleString()}`);
    if (!name) return;

    const property: SavedProperty = {
      id: Date.now().toString(),
      name,
      type: CalculationType.RENTAL,
      price: Number(price),
      date: new Date().toLocaleDateString('pt-PT'),
      metrics: [
        { label: 'Yield Líquido', value: result.netYield.toFixed(2), subtext: '%', highlight: true, color: result.netYield > 5 ? 'text-emerald-600' : 'text-slate-900' },
        { label: 'Yield Bruto', value: result.grossYield.toFixed(2), subtext: '%' },
        { label: 'Invest. Total', value: result.totalInvestment.toFixed(0), subtext: '€' },
        { label: 'Cashflow', value: result.monthlyCashflow.toFixed(0), subtext: '€/mês' },
      ]
    };
    onSave(property);
  };

  // Chart Data for Breakdown
  const chartData = result ? [
    { name: 'Aquisição', value: Number(price), color: '#3B82F6' },
    { name: 'Obras', value: Number(renovation), color: '#8B5CF6' },
    { name: 'Impostos (IMT+IS)', value: result.totalInvestment - Number(price) - Number(renovation), color: '#F59E0B' },
  ].filter(i => i.value > 0) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">
      <div className="lg:col-span-4 space-y-6">
        <PremiumCard>
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dados do Investimento</h2>
          </div>
          <div className="space-y-4">
            <PremiumInput
              label="Preço de Aquisição"
              prefix="€"
              value={price}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setPrice(val);
                setResult(null);
                const validation = validators.price(val);
                setPriceError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={priceError}
            />
            <PremiumInput
              label="Custo Obras (Estimado)"
              prefix="€"
              value={renovation}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setRenovation(val);
                setResult(null);
                const validation = validators.price(val, 0, 1000000);
                setRenovationError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={renovationError}
            />
            <PremiumInput
              label="Renda Mensal Estimada"
              prefix="€"
              value={rent}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setRent(val);
                setResult(null);
                const validation = validators.rent(val);
                setRentError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={rentError}
            />
            <div className="mb-6">
              <PremiumInput
                label="Despesas Mensais (Cond., IMI/12)"
                prefix="€"
                value={expenses}
                onChange={(e) => { setExpenses(Number(e.target.value) || 0); setResult(null); }}
                type="number"
              />
            </div>
          </div>
          <PremiumButton onClick={handleCalculate} variant="primary" icon={<Play className="w-4 h-4" />} className="w-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mt-6">
            Calcular Rentabilidade
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="flex flex-col gap-3">
            <PremiumButton onClick={() => setIsAssistantOpen(true)} variant="outline" icon={<MessageSquare className="w-4 h-4" />} className="w-full justify-center">
              Consultar AI Assistant
            </PremiumButton>
            <PremiumButton onClick={handleSave} variant="secondary" icon={<Scale className="w-4 h-4" />} className="w-full justify-center">
              Adicionar ao Comparador
            </PremiumButton>
            <PDFExportButton onClick={handleExportPDF} className="w-full justify-center" />
          </div>
        )}
      </div>

      <div className="lg:col-span-8">
        {!result && (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50 min-h-[400px]">
            <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">Análise de Investimento</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Insira os valores de compra e renda e clique em calcular para ver o Yield e Cashflow.</p>
          </div>
        )}

        {result && (
          <div id="rental-calculator-results" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Reveal delay={0.1}>
                <PremiumCard className="bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-900/20 border-emerald-100 dark:border-emerald-800 h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Yield Líquido</p>
                  <p className={`text-3xl font-bold font-display tracking-tight drop-shadow-sm ${result.netYield > 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    <AnimatedNumber value={result.netYield} />%
                  </p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.2}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Yield Bruto</p>
                  <p className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                    <AnimatedNumber value={result.grossYield} />%
                  </p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.3}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Cashflow Mensal</p>
                  <p className="text-3xl font-bold font-display tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-sm">
                    € <AnimatedNumber value={result.monthlyCashflow} />
                  </p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.4}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Investimento Total</p>
                  <p className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                    € <AnimatedNumber value={result.totalInvestment / 1000} format={(v) => v.toFixed(1)} />k
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Preço + Obras + Imp.</p>
                </PremiumCard>
              </Reveal>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Reveal delay={0.5}>
                <PremiumCard className="h-full">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">Fluxo Anual Projetado</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-500 dark:text-slate-400">Renda Bruta Anual</span>
                      <span className="font-bold text-slate-900 dark:text-white">€ {(Number(rent) * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-500 dark:text-slate-400">Despesas Anuais</span>
                      <span className="font-bold text-red-500 dark:text-red-400">- € {(Number(expenses) * 12).toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-2"></div>
                    <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">NOI (Net Operating Income)</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">€ {result.annualNOI.toLocaleString()}</span>
                    </div>
                  </div>
                </PremiumCard>
              </Reveal>

              {/* Investment Distribution Chart */}
              <Reveal delay={0.6}>
                <PremiumCard className="h-full">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">Distribuição do Investimento</h3>
                  <div className="h-40 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'var(--tooltip-border, #E2E8F0)', borderRadius: '8px', color: 'var(--tooltip-text, #0F172A)' }}
                          formatter={(value: number) => `€ ${value.toLocaleString()}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {chartData.map(item => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Reveal delay={0.7}>
                <PremiumCard className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 h-full">
                  <Hammer className="text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Peso das Obras</p>
                    <p className="font-bold text-slate-900 dark:text-white">{((Number(renovation) / result.totalInvestment) * 100).toFixed(1)}%</p>
                  </div>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.8}>
                <PremiumCard className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 h-full">
                  <Scale className="text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Rating IMOVALUE</p>
                    <p className={`font-bold ${result.rating === 'Excelente' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>{result.rating}</p>
                  </div>
                </PremiumCard>
              </Reveal>
            </div>
          </div>
        )}
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        contextData={{ ...result, price, renovation, rent, expenses }}
        contextLabel="Investimento para Arrendamento"
      />
    </div>
  );
};
