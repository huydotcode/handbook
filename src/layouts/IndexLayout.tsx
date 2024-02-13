import { Container } from '@mui/material';
import React from 'react';

interface Props {
    containerClassName?: string;
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <>
            {/* border-r-2 */}
            {Left && (
                <aside className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-[20%] justify-start transition-all duration-300 dark:border-none lg:w-[10%] md:hidden">
                    {Left}
                </aside>
            )}

            {Center && (
                <div className="mx-auto w-[600px] max-w-[100vw] lg:w-[500px]">
                    {Center}
                </div>
            )}

            {/* Flex */}
            {Right && (
                <aside className="fixed right-0 top-[72px] h-[calc(100vh-72px)] w-[20%] justify-end transition-all duration-300 dark:border-none lg:w-[10%] md:hidden">
                    {Right}
                </aside>
            )}
        </>
    );
};
export default IndexLayout;
