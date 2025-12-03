import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Calculator, Clock, ChevronRight, Activity, Plus } from 'lucide-react';
import { HistoryItem, User, CalculationType } from '../types';
import { PremiumCard } from './ui/premium/Card';
import { PremiumButton } from './ui/premium/Button';
import { AnimatedNumber } from './ui/premium/AnimatedNumber';
import { Reveal } from './ui/premium/Reveal';

interface DashboardProps {
  onChangeTab: (id: string) => void;
  user: User;
  history: HistoryItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeTab, user, history }) => {

  // Calculate Dynamic KPIs
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const totalCalculations = history.length;
    const totalValueAnalyzed = history.reduce((acc, item) => acc + item.numericValue, 0);

    // Find most frequent type
    const typeCounts = history.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Formatting Top Type Name
    const typeNames: Record<string, string> = {
      [CalculationType.BUYER]: 'Compra',
      [CalculationType.RENTAL]: 'Arrendamento',
      [CalculationType.SELLER]: 'Venda',
      [CalculationType.FLIP]: 'Fix & Flip'
    };

    return {
      totalCalculations,
      totalValueAnalyzed,
      topType: typeNames[topType] || topType
    };
  }, [history]);

  // Prepare Chart Data (Reverse chronological for chart left-to-right)
  const chartData = useMemo(() => {
    return [...history].reverse().map((item, index) => ({
      name: item.date,
      value: item.numericValue,
      idx: index // just for key
    }));
  }, [history]);

  // --- EMPTY STATE ---
  if (history.length === 0) {
    return (
      <div className="animate-fade-in-up space-y-8 min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1">
              Olá, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Bem-vindo à sua nova dashboard.</p>
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
            Sessão Ativa
          </div>
        </div>

        {/* Empty Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Sem dados para mostrar... ainda.</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
            A sua dashboard será atualizada em tempo real assim que começar a realizar simulações de investimento.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <PremiumButton onClick={() => onChangeTab('buyer')} variant="secondary" className="justify-start px-6 h-14 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 group w-full">
              <div className="bg-slate-200 dark:bg-slate-700 p-1.5 rounded-lg mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Calculator className="w-4 h-4" />
              </div>
              Simular Compra
            </PremiumButton>
            <PremiumButton onClick={() => onChangeTab('rental')} variant="secondary" className="justify-start px-6 h-14 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 group w-full">
              <div className="bg-slate-200 dark:bg-slate-700 p-1.5 rounded-lg mr-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              Simular Arrendamento
            </PremiumButton>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE DASHBOARD ---
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Resumo da sua atividade nesta sessão.</p>
        </div>
        <PremiumButton onClick={() => onChangeTab('buyer')} icon={<Plus className="w-4 h-4" />} className="shadow-sm hover:shadow-md">
          Novo Cálculo
        </PremiumButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Reveal delay={0.1}>
          <PremiumCard className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-colors h-full">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <Activity size={64} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cálculos Realizados</p>
              <div className="text-3xl font-bold font-display text-blue-600 dark:text-blue-400">
                <AnimatedNumber value={stats?.totalCalculations || 0} />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Atualizado em tempo real
            </div>
          </PremiumCard>
        </Reveal>

        <Reveal delay={0.2}>
          <PremiumCard className="hover:border-slate-300 dark:hover:border-slate-600 transition-colors h-full">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Valor Total Analisado</p>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                € <AnimatedNumber
                  value={stats?.totalValueAnalyzed || 0}
                  format={(v) => v > 1000000 ? (v / 1000000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k'}
                />
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[70%] rounded-full"></div>
            </div>
          </PremiumCard>
        </Reveal>

        <Reveal delay={0.3}>
          <PremiumCard className="hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors h-full">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Foco Principal</p>
              <div className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                {stats?.topType || "-"}
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Tipo de cálculo mais frequente</p>
          </PremiumCard>
        </Reveal>
      </div>

      {/* Main Charts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal delay={0.4} className="lg:col-span-2">
          <PremiumCard className="min-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Volume de Análise
            </h3>
            <div className="flex-1 w-full min-w-0 h-80">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--tooltip-bg, #FFFFFF)', borderColor: 'var(--tooltip-border, #E2E8F0)', color: 'var(--tooltip-text, #0F172A)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#2563EB' }}
                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
                    formatter={(value: number) => `€ ${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', stroke: '#3B82F6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>
        </Reveal>

        <Reveal delay={0.5}>
          <PremiumCard className="h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Histórico da Sessão
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {history.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === CalculationType.BUYER ? 'bg-blue-500' :
                      item.type === CalculationType.RENTAL ? 'bg-emerald-500' :
                        item.type === CalculationType.FLIP ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{item.summary}</p>
                      <p className="text-[10px] text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.value}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </Reveal>
      </div>
    </div>
  );
};