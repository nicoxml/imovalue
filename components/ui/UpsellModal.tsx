import React from 'react';
import { X, Sparkles, Check, Lock, Zap } from 'lucide-react';
import { Button } from './Elements';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'free' | 'pro' | 'premium';
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, currentPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-brand-surface w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-blue/20">
            <Lock className="w-8 h-8 text-brand-blue" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 font-display">Limite de Créditos Atingido</h2>
          <p className="text-gray-400 mb-8">
            Você atingiu o limite de cálculos do seu plano <strong>{currentPlan.toUpperCase()}</strong>. 
            Faça upgrade para continuar a analisar o mercado sem limites.
          </p>

          <div className="grid gap-4 mb-8">
            <div className="p-4 rounded-xl border border-brand-yield/30 bg-brand-yield/5 flex items-center justify-between hover:bg-brand-yield/10 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yield/20 flex items-center justify-center text-brand-yield">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Plano Premium</p>
                  <p className="text-xs text-brand-yield font-medium">Ilimitado + IA Assistant</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">€19<span className="text-sm text-gray-400">/mês</span></p>
              </div>
            </div>

             <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Pacote 20 Créditos</p>
                  <p className="text-xs text-gray-400">Uso único</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">€5</p>
              </div>
            </div>
          </div>

          <Button variant="primary" className="w-full" onClick={() => { alert('Redirecionar para Checkout...'); onClose(); }}>
            Atualizar Plano Agora
          </Button>
        </div>
      </div>
    </div>
  );
};
