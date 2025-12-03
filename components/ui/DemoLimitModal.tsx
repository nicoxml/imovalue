import React from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';
import { Button } from './Elements';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvertToSignUp: () => void;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({ isOpen, onClose, onConvertToSignUp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-brand-surface w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-blue/20">
            <Lock className="w-8 h-8 text-brand-blue" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 font-display">Fim da Demonstração</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Você atingiu o limite de 2 cálculos gratuitos do modo de demonstração. 
            Crie uma conta gratuita para continuar a usar o IMOVALUE.
          </p>

          <Button variant="primary" className="w-full h-12 text-base" onClick={onConvertToSignUp}>
            Criar Conta Gratuita <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="mt-4 text-xs text-gray-500">
            Inclui 5 créditos mensais e acesso às ferramentas básicas.
          </p>
        </div>
      </div>
    </div>
  );
};