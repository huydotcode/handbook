import React from 'react';
import Sidebar from './_components/Sidebar';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Market | Handbook',
    };
}

const MarketLayout: React.FC<Props> = async ({ children }) => {
    return (
        <>
            <Sidebar />
            <div
                className={
                    'ml-[300px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 lg:ml-0'
                }
            >
                <div
                    className={'mx-auto mt-[64px] max-w-[1400px] px-4 md:px-2'}
                >
                    {children}
                </div>
            </div>
        </>
    );
};
export default MarketLayout;
