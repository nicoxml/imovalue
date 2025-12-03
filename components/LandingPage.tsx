import React, { useState, useEffect } from 'react';
import { Activity, ChevronRight, BarChart3, Brain, FileText, ArrowUpRight, ShieldCheck, Zap, Check, MessageSquare, TrendingUp, Lock, Star, Quote } from 'lucide-react';
import { PremiumButton } from './ui/premium/Button';
import { PremiumCard } from './ui/premium/Card';
import { Reveal } from './ui/premium/Reveal';
import { SimpleMarquee } from './ui/premium/Marquee';
import { PremiumLogo } from './ui/premium/Logo';
import { CalculatorCarousel } from './ui/premium/Carousel';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onEnterDemo }) => {
  // Typewriter State
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    "com a Precisão da IA.",
    "Mais Lucrativas.",
    "Baseadas em Dados.",
    "Em Tempo Recorde."
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      // Speed Logic
      if (isDeleting) {
        setTypingSpeed(40); // Faster deletion
      } else {
        setTypingSpeed(100); // Normal typing
      }

      if (!isDeleting && text === fullText) {
        // Finished typing, pause before delete
        setTimeout(() => setIsDeleting(true), 2000);
        setTypingSpeed(2000); // Pause duration handled by timeout, but strict mode safety
      } else if (isDeleting && text === '') {
        // Finished deleting, move to next
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Pause before typing next
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-blue selection:text-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-yield/5 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-brand-black/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo(0, 0)}>
            <PremiumLogo />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors relative group">
              Funcionalidades
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('ai')} className="hover:text-white transition-colors relative group">
              Inteligência Artificial
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors relative group">
              Preços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
          <div className="flex gap-4">
            <button onClick={onEnterApp} className="text-sm font-medium text-white hover:text-brand-blue transition-colors">
              Login
            </button>
            <PremiumButton onClick={onEnterApp} variant="primary" className="py-2 px-4 text-sm inline-flex">
              Começar Agora
            </PremiumButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-yield animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-medium text-brand-insight uppercase tracking-wider">Nova Versão 2.0 com IA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight mb-8 leading-[1.1] text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Decisões Imobiliárias <br />
            <span className="text-brand-blue block sm:inline">{text}</span>
            <span className="animate-pulse text-brand-blue">|</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
            A calculadora mais visionária de Portugal. Automatize análises de investimento,
            gere relatórios premium e maximize o ROI com o poder dos dados.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Reveal delay={0.3} className="w-full sm:w-auto">
              <PremiumButton onClick={onEnterApp} variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg inline-flex group justify-center">
                Aceder Gratuitamente <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </PremiumButton>
            </Reveal>
            <Reveal delay={0.4} className="w-full sm:w-auto">
              <PremiumButton onClick={onEnterDemo} variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg inline-flex justify-center">
                Ver Demo
              </PremiumButton>
            </Reveal>
          </div>

          {/* Hero Visual - Dashboard Mockup */}
          <div className="mt-16 sm:mt-20 relative animate-scale-in px-2 sm:px-0" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-brand-blue/20 blur-[60px] sm:blur-[100px] rounded-full opacity-20 animate-pulse-slow"></div>
            <CalculatorCarousel />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-6 bg-brand-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <Reveal>
                <span className="text-brand-blue font-semibold tracking-wider uppercase text-sm mb-2 block">Funcionalidades</span>
                <h2 className="text-3xl md:text-5xl font-bold font-display text-white">Ferramentas de Elite.</h2>
                <p className="text-gray-400 mt-4 text-lg">Um ecossistema completo para fechar negócios com confiança e dados.</p>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="hidden md:block">
              <PremiumButton onClick={onEnterApp} variant="secondary" className="inline-flex">Explorar Tudo</PremiumButton>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={Brain}
              title="IMOVALUE AI"
              desc="Assistente inteligente que analisa riscos, sugere preços e identifica oportunidades de investimento em segundos."
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Cálculos Precisos"
              desc="IMT, Imposto de Selo, Yield e ROI calculados automaticamente com base nas tabelas fiscais de 2025."
              delay={0.2}
            />
            <FeatureCard
              icon={FileText}
              title="Relatórios PDF"
              desc="Exporte análises profissionais com a sua marca para impressionar clientes e parceiros."
              delay={0.3}
            />
            <FeatureCard
              icon={ArrowUpRight}
              title="Fix & Flip"
              desc="Simulador dedicado para investidores de reabilitação, controlando custos de obras e margens de revenda."
              delay={0.4}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Gestão de Risco"
              desc="Alertas automáticos sobre viabilidade financeira e exposição ao risco em cada operação."
              delay={0.5}
            />
            <FeatureCard
              icon={Zap}
              title="Comparador"
              desc="Compare múltiplos imóveis lado a lado para tomar a melhor decisão baseada em métricas."
              delay={0.6}
            />
          </div>

          <div className="mt-8 md:hidden text-center">
            <PremiumButton onClick={onEnterApp} variant="secondary" className="inline-flex w-full justify-center">Explorar Tudo</PremiumButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-brand-black border-t border-white/5 overflow-hidden">
        <Reveal className="text-center mb-12 px-4">
          <h2 className="text-2xl font-bold text-white mb-2">A escolha dos profissionais</h2>
          <p className="text-gray-400">Junte-se à elite do imobiliário em Portugal</p>
        </Reveal>

        <SimpleMarquee speed={40} className="py-4">
          <TestimonialCard
            name="Ricardo Silva"
            role="Consultor Imobiliário"
            text="O IMOVALUE transformou a forma como apresento propostas. Os clientes ficam impressionados com a precisão dos dados."
          />
          <TestimonialCard
            name="Ana Martins"
            role="Investidora"
            text="A calculadora de Flip é essencial para o meu negócio. Consigo prever margens com exatidão antes de fazer uma oferta."
          />
          <TestimonialCard
            name="Carlos Santos"
            role="Gestor de Ativos"
            text="A análise de risco da IA salvou-me de dois maus negócios este mês. Vale cada cêntimo."
          />
          <TestimonialCard
            name="Sofia Costa"
            role="Mediadora"
            text="Os relatórios PDF são incríveis. A minha marca pessoal nunca esteve tão forte."
          />
          <TestimonialCard
            name="Pedro Ferreira"
            role="Investidor"
            text="Finalmente uma ferramenta que entende a fiscalidade portuguesa. O cálculo de mais-valias é perfeito."
          />
        </SimpleMarquee>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-16 sm:py-24 px-6 relative overflow-hidden bg-brand-surface/30">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 skew-x-12 transform origin-top-right hidden lg:block"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="animate-slide-up order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6">
                <Brain className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Neural Engine 2.0</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6">
                O seu analista <br />
                <span className="text-brand-blue">disponível 24/7.</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed">
                Não é apenas uma calculadora. O IMOVALUE utiliza modelos de linguagem avançados para interpretar dados financeiros e oferecer recomendações estratégicas como um consultor sénior.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-black border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-yield/10 group-hover:border-brand-yield/20 transition-colors">
                    <TrendingUp className="text-brand-yield" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Análise Preditiva</h3>
                    <p className="text-sm text-gray-400">Projeção de valorização e cashflow baseada em cenários otimistas e conservadores.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-black border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-insight/10 group-hover:border-brand-insight/20 transition-colors">
                    <MessageSquare className="text-brand-insight" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Smart Chat</h3>
                    <p className="text-sm text-gray-400">Faça perguntas complexas como "Como melhorar o ROI deste T2?" e obtenha respostas imediatas.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-brand-black border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-alert/10 group-hover:border-brand-alert/20 transition-colors">
                    <Lock className="text-brand-alert" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Deteção de Risco</h3>
                    <p className="text-sm text-gray-400">Alertas automáticos para yields insustentáveis ou exposição excessiva ao crédito.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <PremiumButton onClick={onEnterApp} variant="primary" className="inline-flex w-full sm:w-auto justify-center">
                  Testar Inteligência Artificial
                </PremiumButton>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative animate-scale-in delay-300 order-1 lg:order-2">
              <div className="absolute -inset-4 bg-brand-blue/20 blur-3xl rounded-full opacity-40 animate-pulse-slow"></div>
              <div className="bg-brand-black border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden hover:scale-[1.02] transition-transform duration-500">
                {/* Chat UI Mockup */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white shrink-0">U</div>
                    <div className="bg-brand-blue rounded-2xl rounded-tl-none p-3 text-sm text-white max-w-[85%]">
                      Este investimento no Porto com yield de 4% é seguro?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center shadow-lg shadow-brand-blue/20 shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-brand-surface border border-white/5 rounded-2xl rounded-tr-none p-4 text-sm text-gray-300 max-w-[90%] shadow-lg">
                      <p className="mb-2"><span className="text-brand-yield font-bold">Análise:</span> O yield de 4% está abaixo da média atual para o Porto (5.5%).</p>
                      <p className="mb-2">Considere negociar o valor de compra em -10% para atingir um yield líquido mais saudável de 4.8%, ou explore o mercado de Alojamento Local onde a zona permite.</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="text-xs bg-brand-yield/10 text-brand-yield px-2 py-1 rounded border border-brand-yield/20">Risco Médio</span>
                        <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/10">Longo Prazo</span>
                      </div>
                    </div>
                  </div>
                  {/* Typing Indicator */}
                  <div className="flex gap-2 ml-11">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-6 relative bg-brand-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <span className="text-brand-blue font-semibold tracking-wider uppercase text-sm mb-2 block">Investimento</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">Planos Flexíveis.</h2>
            <p className="text-gray-400 text-lg">Escolha a ferramenta certa para o seu nível de investimento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <PricingCard
              title="Free"
              price="0"
              features={[
                "5 Cálculos / mês",
                "Calculadora de Compra",
                "Calculadora de Arrendamento",
                "PDFs com marca d'água"
              ]}
              buttonText="Começar Grátis"
              onAction={onEnterApp}
              delay={0.1}
            />

            {/* Pro Plan */}
            <PricingCard
              title="Pro"
              price="9,90"
              period="/ mês"
              features={[
                "Cálculos Ilimitados",
                "Todas as Calculadoras (Flip, Venda)",
                "PDFs Completos",
                "Comparador de Imóveis"
              ]}
              highlight
              buttonText="Subscrever Pro"
              onAction={onEnterApp}
              delay={0.2}
            />

            {/* Premium Plan */}
            <PricingCard
              title="Premium"
              price="19,00"
              period="/ mês"
              isPremium
              features={[
                "Tudo do plano Pro",
                "IMOVALUE AI Assistant",
                "Personalização da Marca (Branding)",
                "Histórico Ilimitado",
                "Dashboard Avançado"
              ]}
              buttonText="Tornar-se Premium"
              onAction={onEnterApp}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 sm:py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">Pronto para elevar o nível?</h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 px-4">
            Junte-se a milhares de consultores e investidores que usam o IMOVALUE para dominar o mercado.
          </p>
          <PremiumButton onClick={onEnterApp} variant="primary" className="px-10 py-5 text-lg shadow-xl shadow-brand-blue/20 inline-flex hover:scale-105 transition-transform w-full sm:w-auto justify-center">
            Começar Gratuitamente
          </PremiumButton>
          <p className="mt-6 text-sm text-gray-500">Sem cartão de crédito necessário.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-600 text-sm bg-brand-black">
        <p>&copy; 2024 IMOVALUE. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: any) => (
  <Reveal delay={delay} variant="fade-in-up">
    <PremiumCard className="h-full">
      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6 border border-brand-blue/20">
        <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </PremiumCard>
  </Reveal>
);

const TestimonialCard = ({ name, role, text }: any) => (
  <div className="w-[350px] p-6 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-sm mx-4 flex flex-col justify-between h-[200px]">
    <div>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-brand-yield fill-brand-yield" />)}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed italic">"{text}"</p>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <div className="text-white font-medium text-sm">{name}</div>
        <div className="text-gray-500 text-xs">{role}</div>
      </div>
    </div>
  </div>
);

const PricingCard = ({ title, price, period, features, highlight, isPremium, buttonText, onAction, delay = 0 }: any) => (
  <div
    className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col relative group animate-scale-in hover:-translate-y-2 ${isPremium
      ? 'bg-gradient-to-b from-brand-surface to-brand-blue/10 border-brand-blue/50 shadow-2xl shadow-brand-blue/10 z-10'
      : highlight
        ? 'bg-brand-surface border-brand-blue/20 hover:border-brand-blue/40 hover:bg-brand-surface/80 shadow-lg'
        : 'bg-brand-surface/30 border-white/5 hover:bg-brand-surface/50'
      }`}
    style={{ animationDelay: `${delay}s` }}
  >
    {isPremium && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg shadow-brand-blue/20 animate-pulse-slow">
        Recomendado
      </div>
    )}

    <div className="mb-8">
      <h3 className={`text-lg font-medium mb-2 ${isPremium ? 'text-brand-blue' : 'text-gray-300'}`}>{title}</h3>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold text-white font-display">€ {price}</span>
        {period && <span className="text-gray-500 mb-1">{period}</span>}
      </div>
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feat: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
          <div className={`p-0.5 rounded-full ${isPremium ? 'bg-brand-blue/20' : 'bg-gray-800'}`}>
            <Check className={`w-3.5 h-3.5 ${isPremium ? 'text-brand-blue' : 'text-gray-500'}`} />
          </div>
          {feat}
        </li>
      ))}
    </ul>

    <PremiumButton
      onClick={onAction}
      variant={isPremium ? 'primary' : 'secondary'}
      className="w-full justify-center inline-flex"
    >
      {buttonText}
    </PremiumButton>
  </div>
);