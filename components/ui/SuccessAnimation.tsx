import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
    message?: string;
    onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
    message = "Cálculo concluído!",
    onComplete
}) => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={onComplete}
            className="flex items-center gap-2 bg-brand-yield/10 border border-brand-yield/20 rounded-lg px-4 py-2 mb-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-6 h-6 bg-brand-yield rounded-full flex items-center justify-center"
            >
                <Check className="w-4 h-4 text-brand-black" />
            </motion.div>
            <span className="text-brand-yield font-medium text-sm">{message}</span>
        </motion.div>
    );
};
