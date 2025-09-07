'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSidebarCollapse } from '@/context/SidebarContext';
import { useOutsideAlerter } from '@/hooks';
import useBreakPoint, { Breakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

interface Props {
    collapseBreakpoints?: Breakpoint[];
    children: React.ReactNode;
}

const SidebarCollapse: React.FC<Props> = ({
    children,
    collapseBreakpoints = ['sm', 'md', 'lg'],
}) => {
    const { breakpoint } = useBreakPoint();
    const sidebarRef = useRef(null);
    const isMobile = collapseBreakpoints.includes(breakpoint);
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarCollapse();
    useOutsideAlerter(sidebarRef, () => setIsSidebarOpen(false), isMobile);

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile, setIsSidebarOpen]);

    return (
        <div
            className={cn(
                'no-scrollbar fixed left-0 top-[56px] z-10 h-[calc(100vh-56px)] w-[300px] max-w-screen border-r-2 bg-secondary-1 p-2 transition-transform duration-300 ease-in-out dark:border-none dark:bg-dark-secondary-1',
                {
                    'translate-x-0': isSidebarOpen,
                    '-translate-x-full': !isSidebarOpen && isMobile,
                }
            )}
            ref={sidebarRef}
        >
            <div className="relative flex h-full flex-col p-2">
                <Button
                    className={cn(
                        'absolute -right-[60px] top-4 z-50 hidden rounded-l-none rounded-r-md bg-secondary-2 shadow-xl transition-all duration-300 ease-in-out dark:bg-dark-secondary-2',
                        {
                            'md:block': collapseBreakpoints.includes('md'),
                            'lg:block': collapseBreakpoints.includes('lg'),
                            'sm:block': collapseBreakpoints.includes('sm'),
                            'xl:block': collapseBreakpoints.includes('xl'),
                        }
                    )}
                    variant={'secondary'}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Icons.Menu className="h-5 w-5" />
                </Button>

                {children}
            </div>
        </div>
    );
};
export default SidebarCollapse;
