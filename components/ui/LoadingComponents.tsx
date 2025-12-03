import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-6 space-y-3">
                        <div className="h-4 bg-white/10 rounded w-2/3"></div>
                        <div className="h-8 bg-white/10 rounded w-full"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                ))}
            </div>

            {/* Chart skeleton */}
            <div className="bg-white/5 rounded-xl p-6">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-white/10 rounded"></div>
            </div>
        </div>
    );
};

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`${sizeClasses[size]} border-2 border-brand-blue/30 border-t-brand-blue rounded-full`}
            />
            {message && (
                <p className="text-sm text-gray-400">{message}</p>
            )}
        </div>
    );
};
