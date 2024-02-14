import React from 'react';

interface Props {
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <>
            {Left && (
                <aside className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-[200px] justify-start transition-all duration-300 dark:border-none lg:w-[80px] md:hidden">
                    {Left}
                </aside>
            )}

            {Center && <div className="mx-auto w-[600px]">{Center}</div>}

            {Right && (
                <aside className="fixed right-0 top-[72px] h-[calc(100vh-72px)] w-[200px] justify-end transition-all duration-300 dark:border-none lg:w-[80px] md:hidden">
                    {Right}
                </aside>
            )}
        </>
    );
};
export default IndexLayout;
