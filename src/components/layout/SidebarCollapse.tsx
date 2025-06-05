'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSidebarCollapse } from '@/context/SidebarContext';
import useBreakPoint from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

interface Props {
    children: React.ReactNode;
}

const SidebarCollapse: React.FC<Props> = ({ children }) => {
    const { breakpoint } = useBreakPoint();
    const isMobile = breakpoint === 'sm' || breakpoint === 'md';
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarCollapse();

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
        >
            <div className="relative flex h-full flex-col p-2">
                <Button
                    className={cn(
                        'absolute -right-[60px] top-4 z-50 hidden rounded-l-none rounded-r-md bg-secondary-2 shadow-xl transition-all duration-300 ease-in-out dark:bg-dark-secondary-2 md:flex'
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
