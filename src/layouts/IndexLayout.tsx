import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const className =
    'fixed top-[72px] h-[calc(100vh-72px)] w-[20%] transition-all duration-300 dark:border-none md:hidden';

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <>
            {Left && <aside className={cn(className, 'left-0')}>{Left}</aside>}

            {Center && <div className="mx-auto w-[600px]">{Center}</div>}

            {Right && (
                <aside className={cn(className, 'right-0')}>{Right}</aside>
            )}
        </>
    );
};
export default IndexLayout;
