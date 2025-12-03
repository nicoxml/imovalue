import React, { useState } from 'react';
import { PremiumCard } from '../ui/premium/Card';
import { PremiumInput } from '../ui/premium/Input';
import { PremiumButton } from '../ui/premium/Button';
import { PDFExportButton } from '../ui/premium/PDFExportButton';
import { AnimatedNumber } from '../ui/premium/AnimatedNumber';
import { Reveal } from '../ui/premium/Reveal';
import { calculateFlipScenario } from '../../services/calculatorService';
import { exportFlipCalculatorPDF } from '../../services/pdfService';
import { validators, validateFlipInputs } from '../../utils/validation';
import { FlipResult, CalculationType, SavedProperty, User } from '../../types';
import { RefreshCw, Scale, MessageSquare, Play } from 'lucide-react';
import { AIAssistant } from '../ai/AIAssistant';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';


interface FlipCalculatorProps {
  onSave: (property: SavedProperty) => void;
  onCalculate: (value: string, label: string, numericValue: number) => void;
  onAttemptCalculate: () => Promise<boolean>;
  user: User;
}

export const FlipCalculator: React.FC<FlipCalculatorProps> = ({ onSave, onCalculate, onAttemptCalculate, user }) => {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [renovationCost, setRenovationCost] = useState(30000);
  const [sellingPrice, setSellingPrice] = useState(280000);
  const [result, setResult] = useState<FlipResult | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Validation errors
  const [purchasePriceError, setPurchasePriceError] = useState<string>("");
  const [renovationError, setRenovationError] = useState<string>("");
  const [sellingPriceError, setSellingPriceError] = useState<string>("");

  // Manual Calculation Trigger
  const handleExportPDF = async () => {
    if (!result) return;
    await exportFlipCalculatorPDF(user);
  };
  const handleCalculate = async () => {
    // Validate all inputs
    const validationErrors = validateFlipInputs(
      Number(purchasePrice),
      Number(renovationCost),
      Number(sellingPrice)
    );

    // Set individual error states
    setPurchasePriceError(validationErrors.purchasePrice || '');
    setRenovationError(validationErrors.renovationCost || '');
    setSellingPriceError(validationErrors.sellingPrice || '');

    // If there are any errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!onAttemptCalculate || !(await onAttemptCalculate())) return;

    const res = calculateFlipScenario(Number(purchasePrice), Number(renovationCost), Number(sellingPrice));
    setResult(res);
    if (onCalculate) {
      onCalculate(`ROI ${res.roi.toFixed(1)}% `, `Flip(Invest: €${(res.totalInvestment / 1000).toFixed(0)}k)`, res.totalInvestment);
    }
  };

  const handleSave = () => {
    if (!result || !onSave) return;
    const name = window.prompt("Nome do Projeto (ex: Flip T2):", `Flip €${purchasePrice.toLocaleString()} `);
    if (!name) return;

    const property: SavedProperty = {
      id: Date.now().toString(),
      name,
      type: CalculationType.FLIP,
      price: Number(purchasePrice),
      date: new Date().toLocaleDateString('pt-PT'),
      metrics: [
        { label: 'Lucro Líquido', value: result.netProfit.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€', highlight: true, color: result.netProfit > 0 ? 'text-emerald-600' : 'text-red-600' },
        { label: 'ROI', value: result.roi.toFixed(1), subtext: '%' },
        { label: 'Invest. Total', value: result.totalInvestment.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€' },
        { label: 'Venda', value: sellingPrice.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€' },
      ]
    };
    onSave(property);
    alert('Adicionado ao comparador');
  };

  const chartData = result ? [
    { name: 'Compra', value: result.purchasePrice, color: '#3B82F6' },
    { name: 'Obras', value: result.renovationCost, color: '#8B5CF6' },
    { name: 'Custos Compra', value: result.buyingCosts, color: '#64748B' },
    { name: 'Custos Venda', value: result.sellingCosts, color: '#F59E0B' },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">
      <div className="lg:col-span-5 space-y-6">
        <PremiumCard>
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fix & Flip</h2>
          </div>
          <div className="space-y-4">
            <PremiumInput
              label="Preço de Compra"
              prefix="€"
              value={purchasePrice}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setPurchasePrice(val);
                setResult(null);
                const validation = validators.price(val);
                setPurchasePriceError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={purchasePriceError}
            />
            <PremiumInput
              label="Custo de Obras"
              prefix="€"
              value={renovationCost}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setRenovationCost(val);
                setResult(null);
                const validation = validators.price(val, 0, 1000000);
                setRenovationError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={renovationError}
            // tooltip="Este valor pode ser uma estimativa geral (ex: 500€/m²) ou o total do orçamento detalhado." 
            />
            <div className="mb-6">
              <PremiumInput
                label="Preço de Revenda"
                prefix="€"
                value={sellingPrice}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setSellingPrice(val);
                  setResult(null);
                  const validation = validators.price(val);
                  setSellingPriceError(validation.error || "");
                }}
                type="number"
                formatNumber
                error={sellingPriceError}
              />
            </div>
          </div>

          <PremiumButton onClick={handleCalculate} variant="primary" icon={<Play className="w-4 h-4" />} className="w-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mt-6">
            Calcular Lucro
          </PremiumButton>
        </PremiumCard>

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PremiumButton onClick={handleSave} variant="secondary" icon={<Scale className="w-4 h-4" />} className="w-full justify-center">
              Comparar
            </PremiumButton>
            <PremiumButton onClick={() => setIsAssistantOpen(true)} variant="outline" icon={<MessageSquare className="w-4 h-4" />} className="w-full justify-center">
              AI Assistant
            </PremiumButton>
            <PDFExportButton onClick={handleExportPDF} className="w-full justify-center" />
          </div>
        )}
      </div>

      <div className="lg:col-span-7 space-y-6">
        {!result && (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50 min-h-[400px]">
            <RefreshCw className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">Simular Flip</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Introduza custos e preço de revenda, depois clique em calcular para ver o ROI.</p>
          </div>
        )}

        {result && (
          <div id="flip-calculator-results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Reveal delay={0.1}>
                <PremiumCard className={`bg-white dark:bg-slate-900 border h-full ${result.netProfit > 0 ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'} p-5`}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Lucro Líquido Estimado</p>
                  <p className={`text-3xl font-bold font-display tracking-tight drop-shadow-sm ${result.netProfit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} `}>
                    € <AnimatedNumber value={result.netProfit} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Após custos e impostos</p>
                </PremiumCard>
              </Reveal>
              <Reveal delay={0.2}>
                <PremiumCard className="h-full p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">ROI do Projeto</p>
                  <p className={`text-3xl font-bold font-display tracking-tight drop-shadow-sm ${result.roi > 15 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'} `}>
                    <AnimatedNumber value={result.roi} />%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Retorno sobre Investimento</p>
                </PremiumCard>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Reveal delay={0.3}>
                <PremiumCard className="h-full">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">Estrutura Financeira</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-500 dark:text-slate-400">Preço de Revenda</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">€ {result.sellingPrice.toLocaleString()}</span>
                    </div>

                    <div className="pl-4 space-y-2 border-l-2 border-slate-100 dark:border-slate-700 ml-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Custo Aquisição + Impostos</span>
                        <span className="text-slate-700 dark:text-slate-300">- € {(result.purchasePrice + result.buyingCosts).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Obras</span>
                        <span className="text-slate-700 dark:text-slate-300">- € {result.renovationCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Comissão Venda (Est. 5%)</span>
                        <span className="text-slate-700 dark:text-slate-300">- € {result.sellingCosts.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-2"></div>

                    <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Margem Líquida</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">€ {result.netProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </PremiumCard>
              </Reveal>

              {/* Cost Structure Chart */}
              <Reveal delay={0.4}>
                <PremiumCard className="h-full">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">Estrutura de Custos</h3>
                  <div className="h-40 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <RePieChart>
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
                            <Cell key={`cell - ${index} `} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'var(--tooltip-border, #E2E8F0)', borderRadius: '8px', color: 'var(--tooltip-text, #0F172A)' }}
                          formatter={(value: number) => `€ ${value.toLocaleString()} `}
                        />
                      </RePieChart>
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
          </div>
        )}
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        contextData={{ ...result, purchasePrice, renovationCost, sellingPrice }}
        contextLabel="Projeto Fix & Flip"
      />
    </div >
  );
};
