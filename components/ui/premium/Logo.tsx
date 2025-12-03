import React from 'react';
import { motion } from 'framer-motion';

export const PremiumLogo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.div
                className="relative w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-yield rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-brand-blue/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Scan Line Animation */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-[2px] bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Icon */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white z-20"
                >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4 8 4v14" />
                    <path d="M17 21v-8.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V21" />
                </svg>

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none"></div>
            </motion.div>

            <div className="ml-3 flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-white">
                    IMO<span className="text-brand-yield">VALUE</span>
                </span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">
                    Real Estate AI
                </span>
            </div>
        </div>
    );
};
