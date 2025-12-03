import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Bot, User, BrainCircuit, AlertTriangle } from 'lucide-react';
import { createChatSession, generateRiskAnalysis } from '../../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: any;
  contextLabel: string;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
  isRiskAlert?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, contextData, contextLabel }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contextData) {
      const initAssistant = async () => {
        setIsLoading(true);
        try {
          // 1. Create Chat Session
          const session = createChatSession(`
            O utilizador está a analisar um cenário de ${contextLabel}.
            Dados atuais: ${JSON.stringify(contextData, null, 2)}.
            Forneça insights iniciais e esteja pronto para responder a perguntas sobre otimização e riscos.
            Mantenha um tom profissional, analítico e premium.
          `);
          setChatSession(session);

          // 2. Generate Proactive Risk Analysis
          const riskAnalysis = await generateRiskAnalysis(contextLabel, contextData);

          // 3. Set Initial Messages
          setMessages([
            {
              role: 'model',
              text: `Olá. Analisei os dados deste cenário de ${contextLabel}. Como posso ajudar a otimizar este investimento?`
            },
            {
              role: 'model',
              text: riskAnalysis,
              isRiskAlert: true
            }
          ]);
        } catch (e) {
          setMessages([{ role: 'model', text: 'Erro ao inicializar o assistente. Verifique a API Key.' }]);
        } finally {
          setIsLoading(false);
        }
      };

      // Only initialize if no messages exist yet to avoid reset
      if (messages.length === 0) {
        initAssistant();
      }
    }
  }, [isOpen, contextData, contextLabel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userMsg });

      let fullText = "";
      // Add a placeholder message for streaming
      setMessages(prev => [...prev, { role: 'model', text: "", isTyping: true }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const newArr = [...prev];
            const lastMsg = newArr[newArr.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.text = fullText;
            }
            return newArr;
          });
        }
      }

      // End typing effect
      setMessages(prev => {
        const newArr = [...prev];
        const lastMsg = newArr[newArr.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.isTyping = false;
        }
        return newArr;
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Desculpe, ocorreu um erro ao processar sua solicitação." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight font-display">IMOVALUE AI</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Assistant Pro</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${msg.role === 'user'
              ? 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30'
              : msg.isRiskAlert ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/10'
              }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : msg.isRiskAlert ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-500" />
              )}
            </div>

            {/* Bubble */}
            <div className={`relative max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${msg.role === 'user'
                ? 'bg-blue-50 dark:bg-slate-900 border-blue-100 dark:border-blue-900/30 text-slate-800 dark:text-slate-100 rounded-tr-none'
                : msg.isRiskAlert
                  ? 'bg-red-50 dark:bg-red-900/5 border-red-100 dark:border-red-900/20 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none'
                }`}>
                {msg.isRiskAlert && <p className="text-red-600 dark:text-red-400 font-bold mb-2 text-xs uppercase tracking-wider">Análise de Risco Proativa</p>}
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
                {msg.isTyping && (
                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-blue-600 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block px-1">
                {msg.role === 'user' ? 'Você' : 'IMOVALUE AI'}
              </span>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/10">
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-md">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Faça uma pergunta sobre o imóvel..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-5 pr-14 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm dark:shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};