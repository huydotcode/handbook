import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const ASIDE_WIDTH = 'w-[300px] md:w-fit';

const className = cn(
    'fixed top-[56px] h-screen transition-all duration-300 dark:border-none md:hidden',
    ASIDE_WIDTH
);

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <div className="mt-2">
            {Left && <aside className={cn(className, 'left-0')}>{Left}</aside>}

            {Center && (
                <div
                    className={cn('mx-auto w-135 md:w-full', {
                        'mx-0 w-[800px]': !Right,
                    })}
                >
                    {Center}
                </div>
            )}

            {Right && (
                <aside className={cn(className, 'right-0')}>{Right}</aside>
            )}
        </div>
    );
};
export default IndexLayout;
