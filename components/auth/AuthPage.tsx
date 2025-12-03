import React, { useState } from 'react';
import { login, register } from '../../services/authService';
import { Button, InputGroup } from '../ui/Elements';
import { Activity, ArrowRight, Lock, Mail, User as UserIcon, Check, Star } from 'lucide-react';
import { User } from '../../types';

interface AuthPageProps {
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Data, Step 2: Plan (Register only)
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('free');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && step === 1) {
       if (!name || !email || !password) {
         setError('Preencha todos os campos.');
         return;
       }
       setStep(2);
       return;
    }

    setLoading(true);
    setError('');

    try {
      let user;
      if (mode === 'login') {
        user = await login(email, password);
      } else {
        user = await register(name, email, password, selectedPlan);
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
      setLoading(false);
    }
  };

  const PlanCard = ({ id, name, price, features, recommended }: any) => (
    <div 
      onClick={() => setSelectedPlan(id)}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col h-full ${
        selectedPlan === id 
        ? 'bg-brand-blue/10 border-brand-blue shadow-lg shadow-brand-blue/10' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yield text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          Recomendado
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h4 className={`font-bold ${selectedPlan === id ? 'text-brand-blue' : 'text-white'}`}>{name}</h4>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
           selectedPlan === id ? 'bg-brand-blue border-brand-blue' : 'border-gray-500'
        }`}>
          {selectedPlan === id && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <p className="text-xl font-bold text-white mb-3">€{price}<span className="text-xs font-normal text-gray-400">/mês</span></p>
      <ul className="space-y-2 text-xs text-gray-300 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex gap-2">
            <Check className="w-3 h-3 text-brand-blue shrink-0" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-yield/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-4xl bg-brand-surface/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden animate-scale-in flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel - Form */}
        <div className="flex-1 p-8 md:p-12 z-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-white">IMOVALUE</span>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 font-display">
              {mode === 'login' ? 'Bem-vindo de volta.' : step === 1 ? 'Crie a sua conta.' : 'Escolha o seu plano.'}
            </h2>
            <p className="text-gray-400">
              {mode === 'login' 
                ? 'Insira os seus dados para aceder à dashboard.' 
                : step === 1 ? 'Comece a analisar investimentos hoje.' : 'Selecione a ferramenta ideal para si.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && step === 2 ? (
              // STEP 2: PLAN SELECTION
              <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <PlanCard 
                  id="free" name="Free" price="0"
                  features={["5 Créditos Iniciais", "Cálculos Básicos", "PDF Simples"]}
                />
                <PlanCard 
                  id="pro" name="Pro" price="9,90"
                  features={["100 Créditos", "Flip Calculator", "PDF Premium"]}
                />
                <PlanCard 
                  id="premium" name="Premium" price="19,00"
                  features={["Ilimitado", "AI Assistant", "Branding"]}
                  recommended
                />
              </div>
            ) : (
              // STEP 1: USER DATA
              <div className="animate-fade-in space-y-4">
                {mode === 'register' && (
                  <InputGroup 
                    label="Nome Completo"
                    value={name}
                    onChange={setName}
                    type="text"
                    prefix={<UserIcon className="w-4 h-4" />}
                    placeholder="Ex: João Silva"
                  />
                )}
                
                <InputGroup 
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  prefix={<Mail className="w-4 h-4" />}
                  placeholder="nome@empresa.com"
                />
                
                <InputGroup 
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  type="password"
                  prefix={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
               {step === 2 && (
                 <Button type="button" variant="secondary" onClick={() => setStep(1)} className="px-4">
                   Voltar
                 </Button>
               )}
               <Button 
                variant="primary" 
                className="w-full h-12 text-base shadow-xl shadow-brand-blue/10 hover:shadow-brand-blue/30" 
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === 'login' ? 'Entrar' : step === 1 ? 'Continuar' : 'Finalizar Registo'} 
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {mode === 'login' ? "Ainda não tem conta?" : "Já tem uma conta?"}{' '}
              <button 
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setStep(1);
                  setError('');
                }}
                className="text-brand-blue font-medium hover:text-white transition-colors"
              >
                {mode === 'login' ? "Registar agora" : "Fazer Login"}
              </button>
            </p>
          </div>
        </div>

        {/* Right Panel - Visual */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-brand-blue/20 to-brand-black relative items-center justify-center p-12 border-l border-white/5">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
           <div className="relative z-10 text-center">
              <div className="mb-6 inline-flex p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-bounce-slow">
                 <Activity className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Potencialize Negócios.</h3>
              <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                "Desde que comecei a usar o IMOVALUE, a minha taxa de fecho aumentou 30% graças aos relatórios detalhados."
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
                <div className="bg-brand-black/50 p-3 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400">Cálculos Hoje</p>
                  <p className="text-xl font-bold text-white">1.240</p>
                </div>
                <div className="bg-brand-black/50 p-3 rounded-xl border border-white/5">
                   <p className="text-xs text-gray-400">Investidores</p>
                   <p className="text-xl font-bold text-brand-yield">+850</p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
