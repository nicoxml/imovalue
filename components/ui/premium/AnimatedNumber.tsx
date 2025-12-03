import React, { useEffect, useRef } from 'react';
import { useSpring, useMotionValue, useTransform, motion } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    format?: (value: number) => string;
    className?: string;
    springOptions?: {
        stiffness?: number;
        damping?: number;
        mass?: number;
    };
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    format = (v) => Math.round(v).toString(),
    className,
    springOptions = { stiffness: 100, damping: 30, mass: 1 }
}) => {
    const spring = useSpring(value, springOptions);
    const display = useTransform(spring, (current) => format(current));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{display}</motion.span>;
};
