import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface PremiumInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'onChange'> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    prefix?: string | React.ReactNode;
    suffix?: string | React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formatNumber?: boolean;
}

const formatNumberValue = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    return parseInt(numbers, 10).toLocaleString('pt-PT');
};

const getRawNumber = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const PremiumInput: React.FC<PremiumInputProps> = ({
    label,
    error,
    icon,
    prefix,
    suffix,
    className,
    formatNumber,
    value,
    onChange,
    type,
    onFocus,
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [hasBeenCleared, setHasBeenCleared] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formatNumber && type === 'number') {
            const rawValue = getRawNumber(e.target.value);
            const formatted = formatNumberValue(rawValue);
            setDisplayValue(formatted);

            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: rawValue
                }
            } as React.ChangeEvent<HTMLInputElement>;

            onChange?.(syntheticEvent);
        } else {
            onChange?.(e);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!hasBeenCleared && type === 'number' && value) {
            setHasBeenCleared(true);
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: ''
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
            setDisplayValue('');
        }
        onFocus?.(e);
    };

    React.useEffect(() => {
        if (formatNumber && type === 'number' && value !== undefined) {
            const formatted = formatNumberValue(String(value));
            setDisplayValue(formatted);
        }
    }, [value, formatNumber, type]);

    const inputValue = formatNumber && type === 'number' ? displayValue : value;

    return (
        <div className="w-full">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <div className="relative group">
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-3 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors z-10">
                            {icon}
                        </div>
                    )}
                    {prefix && (
                        <div className="absolute left-3 text-slate-500 dark:text-slate-400 text-sm z-10 pointer-events-none">
                            {prefix}
                        </div>
                    )}
                    <input
                        className={twMerge(
                            "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm transition-all focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400",
                            icon ? "pl-10" : (prefix ? "pl-8" : ""),
                            suffix ? "pr-10" : "",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            className
                        )}
                        type={formatNumber ? "text" : type}
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute right-3 text-slate-500 text-sm z-10 pointer-events-none">
                            {suffix}
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-600"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};
