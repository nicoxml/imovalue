import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'left' | 'right';
    speed?: number;
    pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
    children,
    className,
    direction = 'left',
    speed = 50,
    pauseOnHover = true
}) => {
    return (
        <div className={twMerge("group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]", className)}>
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: direction === 'left' ? "-100%" : "0%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                    repeatType: "loop"
                }}
                className={twMerge("flex shrink-0 justify-around [gap:var(--gap)] min-w-full", pauseOnHover && "group-hover:[animation-play-state:paused]")}
                style={{
                    // Framer motion loop might be tricky with width calculation. 
                    // Using CSS animation is often smoother for marquees.
                    // But let's try a simple CSS keyframe approach via style or tailwind arbitrary values if possible.
                    // Actually, for a perfect loop, we need two copies of children.
                }}
            >
                {/* We need to duplicate children for seamless loop */}
                {children}
                {children}
            </motion.div>
            {/* Second copy for the loop */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: direction === 'left' ? "-100%" : "0%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                    repeatType: "loop"
                }}
                className={twMerge("flex shrink-0 justify-around [gap:var(--gap)] min-w-full", pauseOnHover && "group-hover:[animation-play-state:paused]")}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

// Better implementation using CSS for the loop to avoid JS frame issues
export const SimpleMarquee: React.FC<MarqueeProps> = ({
    children,
    className,
    direction = 'left',
    speed = 20, // seconds
    pauseOnHover = true
}) => {
    return (
        <div className={twMerge("group flex overflow-hidden user-select-none gap-4", className)}
            style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' } as any}>
            <div
                className={twMerge("flex shrink-0 justify-around gap-4 min-w-full animate-scroll", pauseOnHover && "group-hover:[animation-play-state:paused]")}
                style={{
                    animationDirection: direction === 'left' ? 'normal' : 'reverse',
                    animationDuration: `${speed}s`
                }}
            >
                {children}
            </div>
            <div
                className={twMerge("flex shrink-0 justify-around gap-4 min-w-full animate-scroll", pauseOnHover && "group-hover:[animation-play-state:paused]")}
                style={{
                    animationDirection: direction === 'left' ? 'normal' : 'reverse',
                    animationDuration: `${speed}s`
                }}
            >
                {children}
            </div>
        </div>
    );
};
