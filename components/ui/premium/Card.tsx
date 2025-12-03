import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface PremiumCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
    children,
    className,
    onClick,
}) => {
    return (
        <motion.div
            onClick={onClick}
            className={twMerge(
                "relative group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 ease-out hover:shadow-md",
                className
            )}
        >
            {/* Content */}
            <div className="relative h-full rounded-xl p-6">
                {children}
            </div>
        </motion.div>
    );
};
