'use client';
import React from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | undefined;

/*
    '2xl': { max: '1535px' },
    xl: { max: '1200px' },
    lg: { max: '992px' },
    md: { max: '768px' },
    sm: { max: '639px' },
* */

const useBreakPoint = () => {
    const [breakpoint, setBreakpoint] = React.useState<Breakpoint>();

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setBreakpoint(identifyBreakpoint(window.innerWidth));
            };

            window.addEventListener('resize', handleResize);

            handleResize();

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return { breakpoint };
};

export const identifyBreakpoint = (width: number): Breakpoint => {
    if (width >= 1536) return '3xl';
    if (width >= 1200) return '2xl';
    if (width >= 992) return 'xl';
    if (width >= 768) return 'lg';
    if (width >= 640) return 'md';
    return 'sm';
};

export default useBreakPoint;
