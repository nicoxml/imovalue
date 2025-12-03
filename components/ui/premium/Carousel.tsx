import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, RefreshCw, DollarSign, Home } from 'lucide-react';

const cards = [
    {
        id: 'buyer',
        title: 'Comprar',
        icon: Home,
        color: 'from-brand-blue to-blue-600',
        value: '€ 350.000',
        label: 'Preço Máximo'
    },
    {
        id: 'flip',
        title: 'Fix & Flip',
        icon: RefreshCw,
        color: 'from-purple-500 to-pink-600',
        value: '35% ROI',
        label: 'Lucro Estimado'
    },
    {
        id: 'rental',
        title: 'Arrendamento',
        icon: Calculator,
        color: 'from-brand-yield to-emerald-600',
        value: '8.5% Yield',
        label: 'Rentabilidade'
    },
    {
        id: 'seller',
        title: 'Vender',
        icon: DollarSign,
        color: 'from-orange-500 to-red-600',
        value: '€ 28.500',
        label: 'Mais-Valias'
    }
];

export const CalculatorCarousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cards.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[400px] w-full max-w-2xl mx-auto perspective-1000 flex items-center justify-center">
            <AnimatePresence mode='popLayout'>
                {cards.map((card, index) => {
                    // Calculate relative position
                    const offset = (index - activeIndex + cards.length) % cards.length;

                    // Only show 3 cards: active, previous, next
                    if (offset > 1 && offset < cards.length - 1) return null;

                    let x = 0;
                    let scale = 1;
                    let zIndex = 0;
                    let opacity = 1;
                    let rotateY = 0;

                    if (offset === 0) { // Active
                        x = 0;
                        scale = 1.1;
                        zIndex = 10;
                        opacity = 1;
                        rotateY = 0;
                    } else if (offset === 1) { // Next
                        x = 150;
                        scale = 0.8;
                        zIndex = 5;
                        opacity = 0.6;
                        rotateY = -15;
                    } else { // Previous (offset === cards.length - 1)
                        x = -150;
                        scale = 0.8;
                        zIndex = 5;
                        opacity = 0.6;
                        rotateY = 15;
                    }

                    return (
                        <motion.div
                            key={card.id}
                            className={`absolute w-64 h-80 rounded-2xl bg-gradient-to-br ${card.color} p-6 flex flex-col justify-between shadow-2xl border border-white/20 backdrop-blur-md`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                x,
                                scale,
                                zIndex,
                                opacity,
                                rotateY,
                                rotateX: 5
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Glass Shine */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 rounded-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{card.title}</h3>
                                <p className="text-white/80 text-sm">Calculadora Pro</p>
                            </div>

                            <div className="relative z-10 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{card.label}</p>
                                <p className="text-2xl font-bold text-white font-display">{card.value}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Floor Reflection */}
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-brand-blue/20 to-transparent blur-xl rounded-[100%] transform scale-x-150 translate-y-10 -z-10 opacity-50"></div>
        </div>
    );
};
