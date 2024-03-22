import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const className =
    'fixed top-[72px] h-screen transition-all duration-300 dark:border-none md:hidden';

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <div className="mt-2">
            {Left && <aside className={cn(className, 'left-0')}>{Left}</aside>}

            {Center && <div className="mx-auto">{Center}</div>}

            {Right && (
                <aside className={cn(className, 'right-0')}>{Right}</aside>
            )}
        </div>
    );
};
export default IndexLayout;
