import React, { useState } from 'react';
import { PremiumCard } from '../ui/premium/Card';
import { PremiumInput } from '../ui/premium/Input';
import { PremiumButton } from '../ui/premium/Button';
import { PDFExportButton } from '../ui/premium/PDFExportButton';
import { AnimatedNumber } from '../ui/premium/AnimatedNumber';
import { Reveal } from '../ui/premium/Reveal';
import { calculateBuyerScenario } from '../../services/calculatorService';
import { exportBuyerCalculatorPDF } from '../../services/pdfService';
import { validators } from '../../utils/validation';
import { BuyerResult, CalculationType, SavedProperty, User } from '../../types';
import { Calculator, Scale, MessageSquare, Play } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AIAssistant } from '../ai/AIAssistant';

interface BuyerCalculatorProps {
  onSave: (property: SavedProperty) => void;
  onCalculate: (value: string, label: string, numericValue: number) => void;
  onAttemptCalculate: () => Promise<boolean>;
  user: User;
}

export const BuyerCalculator: React.FC<BuyerCalculatorProps> = ({ onSave, onCalculate, onAttemptCalculate, user }) => {
  // State
  const [price, setPrice] = useState(250000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState<string>("3.50");
  const [years, setYears] = useState(30);
  const [result, setResult] = useState<BuyerResult | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Validation errors
  const [priceError, setPriceError] = useState<string>("");
  const [downPaymentError, setDownPaymentError] = useState<string>("");
  const [rateError, setRateError] = useState<string>("");
  const [yearsError, setYearsError] = useState<string>("");

  // Manual Calculation Trigger
  const handleCalculate = async () => {
    // Check credits first
    if (onAttemptCalculate && !(await onAttemptCalculate())) return;

    const numRate = parseFloat(rate);
    if (isNaN(numRate) || numRate < 0.5 || numRate > 15) {
      setRateError("Taxa deve estar entre 0.5% e 15%");
      return;
    } else {
      setRateError("");
    }

    const res = calculateBuyerScenario(Number(price), Number(downPaymentPct), numRate, Number(years));
    setResult(res);

    if (onCalculate) {
      onCalculate(`€ ${res.monthlyPayment.toFixed(0)}/mês`, `Prestação Habitação`, res.monthlyPayment);
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    await exportBuyerCalculatorPDF(user);
  };

  const handleSave = () => {
    if (!result || !onSave) return;
    const name = window.prompt("Nome do Imóvel (ex: T2 Lisboa):", `Imóvel €${price.toLocaleString()}`);
    if (!name) return;

    const property: SavedProperty = {
      id: Date.now().toString(),
      name,
      type: CalculationType.BUYER,
      price: Number(price),
      date: new Date().toLocaleDateString('pt-PT'),
      metrics: [
        { label: 'Entrada Inicial', value: result.totalUpfront.toFixed(0), subtext: '€', highlight: true },
        { label: 'Prestação Mensal', value: result.monthlyPayment.toFixed(0), subtext: '€' },
        { label: 'IMT + Selo', value: (result.imt + result.stampDuty).toFixed(0), subtext: '€' },
        { label: 'Prazo', value: years, subtext: 'Anos' },
      ]
    };
    onSave(property);
  };

  const chartData = result ? [
    { name: 'Entrada', value: Number(price) * (Number(downPaymentPct) / 100), color: '#3B82F6' },
    { name: 'IMT', value: result.imt, color: '#10B981' },
    { name: 'Selo', value: result.stampDuty, color: '#F59E0B' },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative pb-10">
      <div className="lg:col-span-5 space-y-6">
        <PremiumCard>
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dados da Compra</h2>
          </div>

          <div className="space-y-4">
            <PremiumInput
              label="Preço do Imóvel"
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
            {/* Responsive Inputs: Stack on mobile, Side-by-side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PremiumInput
                label="Entrada"
                suffix="%"
                value={downPaymentPct}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setDownPaymentPct(val);
                  setResult(null);
                  const validation = validators.downPayment(val);
                  setDownPaymentError(validation.error || "");
                }}
                type="number"
                error={downPaymentError}
              />
              <PremiumInput
                label="Prazo"
                suffix="Anos"
                value={years}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setYears(val);
                  setResult(null);
                  const validation = validators.loanTerm(val);
                  setYearsError(validation.error || "");
                }}
                type="number"
                error={yearsError}
              />
            </div>
            <div className="mb-6">
              <PremiumInput
                label="Taxa de Juro (Tan)"
                suffix="%"
                value={rate}
                onChange={(e) => { setRate(e.target.value); setResult(null); }}
                type="number"
                error={rateError}
              />
            </div>
          </div>

          <PremiumButton onClick={handleCalculate} variant="primary" icon={<Play className="w-4 h-4" />} className="w-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mt-6 py-3 text-base">
            Calcular Prestação
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="flex flex-col sm:flex-row gap-3">
            <PremiumButton onClick={handleSave} variant="secondary" icon={<Scale className="w-4 h-4" />} className="w-full justify-center py-3">
              Comparar
            </PremiumButton>
            <PremiumButton onClick={() => setIsAssistantOpen(true)} variant="outline" icon={<MessageSquare className="w-4 h-4" />} className="w-full justify-center py-3">
              AI Assistant
            </PremiumButton>
            <PDFExportButton onClick={handleExportPDF} className="w-full sm:w-auto justify-center py-3" />
          </div>
        )}
      </div>

      <div className="lg:col-span-7 space-y-6">
        {!result && (
          <div className="h-full flex flex-col items-center justify-center p-8 lg:p-12 text-center opacity-50 min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50">
            <Calculator className="w-12 h-12 lg:w-16 lg:h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">Pronto para Calcular</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm lg:text-base">Preencha os dados e clique em calcular para ver a prestação e custos iniciais.</p>
          </div>
        )}

        {result && !rateError && (
          <div id="buyer-calculator-results" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Reveal delay={0.1}>
                <PremiumCard className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-blue-100 dark:border-blue-800 h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Prestação Estimada</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-sm truncate">
                    € <AnimatedNumber value={result.monthlyPayment} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">/mês</p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.2}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Capital Necessário</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white drop-shadow-sm truncate">
                    € <AnimatedNumber value={result.totalUpfront} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">(Entrada + Impostos)</p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.3}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Total Impostos</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-red-600 dark:text-red-400 drop-shadow-sm truncate">
                    € <AnimatedNumber value={result.imt + result.stampDuty} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">IMT + IS</p>
                </PremiumCard>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <PremiumCard className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Distribuição de Capital Inicial</h3>
                </div>
                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <RePieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </Reveal>
          </div>
        )}
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        contextData={{ ...result, price, downPaymentPct, rate, years }}
        contextLabel="Compra Habitação Própria"
      />
    </div >
  );
};