import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Check } from 'lucide-react';

interface PDFExportButtonProps {
    onClick: () => void;
    className?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ onClick, className }) => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'folding' | 'done'>('idle');

    const handleClick = async () => {
        if (status !== 'idle') return;

        setStatus('scanning');

        // Simulate scan duration
        setTimeout(() => {
            setStatus('folding');
            // Simulate fold duration
            setTimeout(() => {
                setStatus('done');
                onClick();
                // Reset
                setTimeout(() => {
                    setStatus('idle');
                }, 2000);
            }, 600);
        }, 1500);
    };

    return (
        <button
            onClick={handleClick}
            className={`relative group overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 min-w-[140px] shadow-sm hover:shadow-md ${className}`}
            disabled={status !== 'idle'}
        >
            <div className="relative px-4 py-2 flex items-center gap-2 z-10">
                <AnimatePresence mode='wait'>
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-medium">Exportar</span>
                        </motion.div>
                    )}

                    {status === 'scanning' && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-medium">Gerando...</span>
                        </motion.div>
                    )}

                    {status === 'folding' && (
                        <motion.div
                            key="folding"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                            <FileText className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-medium">Processando...</span>
                        </motion.div>
                    )}

                    {status === 'done' && (
                        <motion.div
                            key="done"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                        >
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Pronto!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Laser Scan Effect */}
            {status === 'scanning' && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-blue-500/10 z-0"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <div className="absolute right-0 top-0 h-full w-[2px] bg-blue-500 shadow-[0_0_10px_#3B82F6]"></div>
                </motion.div>
            )}

            {/* Paper Fold Effect (Simulated with clip-path or scale) */}
            {status === 'folding' && (
                <motion.div
                    className="absolute inset-0 bg-white/10 z-0"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0, transformOrigin: 'top' }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </button>
    );
};
