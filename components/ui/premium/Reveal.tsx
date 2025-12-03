import React, { useRef } from 'react';
import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'fade-in' | 'fade-in-up' | 'slide-in-right' | 'blur-in' | 'scale-in';
    delay?: number;
    duration?: number;
    once?: boolean;
    threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({
    children,
    className,
    variant = 'fade-in-up',
    delay = 0,
    duration = 0.5,
    once = true,
    threshold = 0.2
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: threshold });

    const variants = {
        'fade-in': {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        },
        'fade-in-up': {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        },
        'slide-in-right': {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        },
        'blur-in': {
            hidden: { opacity: 0, filter: 'blur(10px)' },
            visible: { opacity: 1, filter: 'blur(0px)' }
        },
        'scale-in': {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[variant]}
            transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={twMerge(className)}
        >
            {children}
        </motion.div>
    );
};
