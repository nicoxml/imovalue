import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
// import * as SliderPrimitive from '@radix-ui/react-slider'; // Assuming we might need radix, but I'll build custom for now to avoid dep if possible, or use standard input range styled.
// Actually, standard range input is hard to style perfectly with "elastic bounce".
// I'll use a custom div-based slider with framer-motion drag.

interface PremiumSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
    formatValue?: (value: number) => string;
    className?: string;
}

export const PremiumSlider: React.FC<PremiumSliderProps> = ({
    value,
    min,
    max,
    step = 1,
    onChange,
    label,
    formatValue = (v) => v.toString(),
    className
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-4">
                {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
                <motion.span
                    key={value}
                    initial={{ scale: 1.2, color: '#fff' }}
                    animate={{ scale: 1, color: '#94A3B8' }}
                    className="text-sm font-bold font-mono"
                >
                    {formatValue(value)}
                </motion.span>
            </div>

            <div className="relative h-6 flex items-center select-none touch-none">
                {/* Track Background */}
                <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    {/* Fill */}
                    <motion.div
                        className="h-full bg-brand-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Thumb (Invisible interactive layer + Visible Thumb) */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Visible Thumb with Glow */}
                <motion.div
                    className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] border-2 border-brand-blue pointer-events-none"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{ scale: 1.2 }}
                >
                    <div className="absolute inset-0 rounded-full bg-brand-blue opacity-20 animate-ping" />
                </motion.div>
            </div>
        </div>
    );
};
