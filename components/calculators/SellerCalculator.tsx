import React, { useState, useRef, useMemo } from 'react';
import { PremiumCard } from '../ui/premium/Card';
import { PremiumInput } from '../ui/premium/Input';
import { PremiumButton } from '../ui/premium/Button';
import { AnimatedNumber } from '../ui/premium/AnimatedNumber';
import { Reveal } from '../ui/premium/Reveal';
import { PDFExportButton } from '../ui/premium/PDFExportButton';
import { calculateSellerScenario } from '../../services/calculatorService';
import { exportSellerCalculatorPDF } from '../../services/pdfService';
import { validators, validateSellerInputs } from '../../utils/validation';
import { SellerResult, CalculationType, SavedProperty, User } from '../../types';
import { Calculator, Scale, MessageSquare, DollarSign, Play, Download, Info } from 'lucide-react';
import { AIAssistant } from '../ai/AIAssistant';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SellerCalculatorProps {
  onSave: (property: SavedProperty) => void;
  onCalculate: (value: string, label: string, numericValue: number) => void;
  onAttemptCalculate: () => Promise<boolean>;
  user: User;
}

export const SellerCalculator: React.FC<SellerCalculatorProps> = ({ onSave, onCalculate, onAttemptCalculate, user }) => {
  const [price, setPrice] = useState(300000);
  const [commission, setCommission] = useState(5);
  const [result, setResult] = useState<SellerResult | null>(null);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Validation errors
  const [priceError, setPriceError] = useState<string>("");
  const [commissionError, setCommissionError] = useState<string>("");
  const chartRef = useRef<HTMLDivElement>(null);

  // Manual Calculation Trigger
  const handleCalculate = async () => {
    // Validate all inputs
    const validationErrors = validateSellerInputs(
      Number(price),
      Number(commission)
    );

    // Set individual error states
    setPriceError(validationErrors.price || '');
    setCommissionError(validationErrors.commission || '');

    // If there are any errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!onAttemptCalculate || !(await onAttemptCalculate())) return;

    const res = calculateSellerScenario(Number(price), Number(commission));
    setResult(res);
    setActiveScenarioIndex(2); // Reset to "Atual"

    if (onCalculate) {
      onCalculate(`Líquido €${(res.netSale / 1000).toFixed(0)}k`, `Venda(€${(price / 1000).toFixed(0)}k)`, price);
    }
  };

  const handleExportPDF = async () => {
    if (!displayedResult) return; // Ensure there's a result to export
    await exportSellerCalculatorPDF(user);
  };

  const handleSave = () => {
    if (!displayedResult || !onSave) return;
    const name = window.prompt("Nome do Imóvel (ex: T3 Algarve):", `Venda €${displayedResult.salePrice.toLocaleString()} `);
    if (!name) return;

    const property: SavedProperty = {
      id: Date.now().toString(),
      name,
      type: CalculationType.SELLER,
      price: Number(displayedResult.salePrice),
      date: new Date().toLocaleDateString('pt-PT'),
      metrics: [
        { label: 'Valor Líquido', value: displayedResult.netSale.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€', highlight: true, color: 'text-emerald-600' },
        { label: 'Comissão', value: displayedResult.commission.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€' },
        { label: 'IVA Com.', value: displayedResult.commissionVAT.toLocaleString('pt-PT', { maximumFractionDigits: 0 }), subtext: '€' },
      ]
    };
    onSave(property);
    alert('Adicionado ao comparador');
  };

  const handleExportChart = () => {
    if (!chartRef.current) return;
    const svg = chartRef.current.querySelector('svg');
    if (!svg) return;

    // Serialize SVG
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Get dimensions
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    img.onload = () => {
      if (ctx) {
        // Draw background (Brand Surface color) so white text is visible
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');

        // Trigger download
        const a = document.createElement('a');
        a.download = `Cenarios_Venda_${price}.png`;
        a.href = png;
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Helper to generate scenarios
  const generateScenarios = () => {
    if (!result) return [];
    const variations = [-10, -5, 0, 5, 10];
    return variations.map(pct => {
      const newPrice = Number(price) * (1 + pct / 100);
      const res = calculateSellerScenario(newPrice, Number(commission));
      return {
        label: pct === 0 ? 'Atual' : `${pct > 0 ? '+' : ''}${pct}% `,
        price: newPrice,
        net: res.netSale,
        diff: res.netSale - result.netSale
      };
    });
  };

  const scenarios = useMemo(() => result ? generateScenarios() : [], [result, price, commission]);

  // Determine which result to display based on chart selection
  const displayedResult = useMemo(() => {
    if (!result) return null;
    // If a scenario is active, recalculate full details for that scenario's price
    if (activeScenarioIndex !== null && scenarios[activeScenarioIndex]) {
      return calculateSellerScenario(scenarios[activeScenarioIndex].price, Number(commission));
    }
    return result;
  }, [result, activeScenarioIndex, scenarios, commission]);

  // Is the displayed result different from the base calculation?
  const isScenarioActive = activeScenarioIndex !== null && activeScenarioIndex !== 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative">
      <div className="lg:col-span-5 space-y-6">
        <PremiumCard>
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dados da Venda</h2>
          </div>
          <div className="space-y-4">
            <PremiumInput
              label="Preço de Venda"
              prefix="€"
              value={price}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setPrice(val);
                setResult(null);
                setActiveScenarioIndex(null);
                const validation = validators.price(val);
                setPriceError(validation.error || "");
              }}
              type="number"
              formatNumber
              error={priceError}
            />
            <div className="mb-6">
              <PremiumInput
                label="Comissão"
                suffix="%"
                value={commission}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setCommission(val);
                  setResult(null);
                  setActiveScenarioIndex(null);
                  const validation = validators.commission(val);
                  setCommissionError(validation.error || "");
                }}
                type="number"
                error={commissionError}
              />
            </div>
          </div>

          <PremiumButton onClick={handleCalculate} variant="primary" icon={<Play className="w-4 h-4" />} className="w-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 mt-6">
            Calcular Líquido
          </PremiumButton>
        </PremiumCard>

        {displayedResult && (
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
        {!displayedResult && (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50 min-h-[400px]">
            <DollarSign className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">Quanto vai receber?</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Clique em calcular para ver o valor líquido da venda após comissões e impostos.</p>
          </div>
        )}

        {displayedResult && (
          <div id="seller-calculator-results" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Reveal delay={0.1}>
                <PremiumCard className={`bg-gradient-to-br from-white dark:from-slate-900 border transition-all duration-300 ${isScenarioActive ? 'to-blue-50 dark:to-blue-900/20 border-blue-200 dark:border-blue-800' : 'to-emerald-50 dark:to-emerald-900/20 border-emerald-100 dark:border-emerald-800'} p-5`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs mb-1 tracking-wide uppercase font-semibold ${isScenarioActive ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"} `}>
                        {isScenarioActive ? `Valor Líquido (Cenário ${scenarios[activeScenarioIndex!].label})` : "Valor Líquido Estimado"}
                      </p>
                      <p className={`text-3xl font-bold font-display tracking-tight drop-shadow-sm ${isScenarioActive ? "text-blue-700 dark:text-blue-400" : "text-emerald-700 dark:text-emerald-400"} `}>
                        € <AnimatedNumber value={displayedResult.netSale} format={(v) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} />
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Após comissões e impostos</p>
                    </div>
                    {isScenarioActive && (
                      <button
                        onClick={() => setActiveScenarioIndex(2)}
                        className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-1 rounded text-slate-700 dark:text-slate-300 flex items-center gap-1"
                      >
                        Restaurar
                      </button>
                    )}
                  </div>
                </PremiumCard>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <PremiumCard>
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-4">Detalhamento de Custos {isScenarioActive && <span className="text-blue-600 dark:text-blue-400 text-xs ml-2 font-bold uppercase tracking-wider">Simulado</span>}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 dark:text-slate-400">Valor de Venda</span>
                    <span className="font-bold text-slate-900 dark:text-white">€ {displayedResult.salePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 dark:text-slate-400">Comissão ({Number(commission)}%)</span>
                    <span className="font-bold text-red-500 dark:text-red-400">- € {displayedResult.commission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 dark:text-slate-400">IVA s/ Comissão (23%)</span>
                    <span className="font-bold text-red-500 dark:text-red-400">- € {displayedResult.commissionVAT.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-2"></div>
                  <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Líquido a Receber</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">€ {displayedResult.netSale.toLocaleString()}</span>
                  </div>
                </div>
              </PremiumCard>
            </Reveal>

            <Reveal delay={0.3}>
              <PremiumCard>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-700 dark:text-slate-300">Análise de Cenários (+/-)</h3>
                    <div className="group relative">
                      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-white rounded hidden group-hover:block z-20">
                        Clique nas barras ou na tabela para simular o resultado nestes preços.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PDFExportButton onClick={handleExportChart} />
                  </div>
                </div>

                {/* Chart */}
                <div ref={chartRef} className="h-64 w-full mb-6 min-w-0 bg-white dark:bg-slate-900 rounded-lg">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={scenarios}>
                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'var(--tooltip-border, #E2E8F0)', borderRadius: '8px', color: 'var(--tooltip-text, #0F172A)' }}
                        formatter={(value: number) => [`€ ${value.toLocaleString()} `, 'Líquido']}
                        cursor={{ fill: 'var(--tooltip-cursor, #f1f5f9)' }}
                      />
                      <Bar
                        dataKey="net"
                        radius={[4, 4, 0, 0]}
                        onClick={(data, index) => setActiveScenarioIndex(index)}
                        cursor="pointer"
                      >
                        {scenarios.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === activeScenarioIndex ? '#2563EB' : (entry.label === 'Atual' ? '#60A5FA' : '#CBD5E1')}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse min-w-[300px]">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-2 pl-2">Variação</th>
                        <th className="pb-2 text-right">Preço Venda</th>
                        <th className="pb-2 text-right">Valor Líquido</th>
                        <th className="pb-2 text-right pr-2">Impacto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((s, i) => (
                        <tr
                          key={i}
                          className={`
                            border-b border-slate-50 dark:border-slate-800 last:border-0 transition-all duration-300 cursor-pointer
                            ${i === activeScenarioIndex
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600 dark:border-l-blue-400'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-l-transparent'
                            }
                          `}
                          onClick={() => setActiveScenarioIndex(i)}
                        >
                          <td className={`py-3 pl-2 font-medium ${s.label === 'Atual' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} `}>{s.label}</td>
                          <td className="py-3 text-right text-slate-600 dark:text-slate-400">€ {s.price.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</td>
                          <td className={`py-3 text-right font-bold ${i === activeScenarioIndex ? 'text-blue-700 dark:text-blue-300 text-base' : 'text-slate-900 dark:text-white'} `}>€ {s.net.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}</td>
                          <td className={`py-3 pr-2 text-right font-medium ${s.diff > 0 ? 'text-emerald-600 dark:text-emerald-400' : s.diff < 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-400'} `}>
                            {s.diff !== 0 ? `${s.diff > 0 ? '+' : ''}€ ${s.diff.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} ` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PremiumCard>
            </Reveal>
          </div>
        )}
      </div>

      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        contextData={{ ...displayedResult, price: displayedResult?.salePrice, commission }}
        contextLabel="Venda de Imóvel"
      />
    </div >
  );
};