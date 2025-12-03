import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-brand-surface border border-brand-yield/20 shadow-2xl rounded-xl p-4 flex items-center gap-3 backdrop-blur-xl">
        <div className="w-8 h-8 rounded-full bg-brand-yield/20 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-brand-yield" />
        </div>
        <div>
          <h4 className="font-medium text-white text-sm">Sucesso</h4>
          <p className="text-xs text-gray-400">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};