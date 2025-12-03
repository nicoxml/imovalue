import React from 'react';
import { SavedProperty } from '../../types';
import { Card, Button } from '../ui/Elements';
import { Trash2, Scale, ArrowRight } from 'lucide-react';

interface ComparisonViewProps {
  items: SavedProperty[];
  onRemove: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ items, onRemove, onNavigate }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/20">
          <Scale className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sem Imóveis para Comparar</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Faça uma simulação de Compra ou Arrendamento e clique em "Adicionar ao Comparador" para ver os imóveis aqui.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => onNavigate('buyer')} variant="primary">Simular Compra</Button>
          <Button onClick={() => onNavigate('rental')} variant="secondary">Simular Arrendamento</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Comparador de Imóveis</h2>
          <p className="text-gray-400">Comparação lado a lado das métricas financeiras</p>
        </div>
        <span className="text-sm font-medium text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
          {items.length} Imóveis
        </span>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max">
          {items.map((item) => (
            <Card key={item.id} className="w-[320px] flex-shrink-0 relative group border-t-4 border-t-brand-blue p-0 overflow-hidden hover:border-t-brand-insight transition-all duration-300">
              {/* Header */}
              <div className="p-6 pb-4 bg-gradient-to-b from-brand-surface to-transparent">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                    {item.type === 'RENTAL' ? 'Arrendamento' : 'Compra'}
                  </span>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 truncate" title={item.name}>{item.name}</h3>
                <p className="text-2xl font-display font-bold text-white">€ {item.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>

              {/* Metrics */}
              <div className="p-6 pt-0 space-y-4">
                <div className="h-px bg-white/5 w-full mb-4"></div>
                {item.metrics.map((metric, idx) => (
                  <div key={idx} className="flex justify-between items-center group/metric">
                    <span className="text-sm text-gray-400">{metric.label}</span>
                    <div className="text-right">
                      <span className={`block font-medium ${metric.color || (metric.highlight ? 'text-brand-yield' : 'text-white')}`}>
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value} {metric.subtext && <span className="text-xs text-gray-500 ml-1">{metric.subtext}</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-insight opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};