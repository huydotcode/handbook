import { FullLayout } from '@/components/layout';
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
        <FullLayout>
            <Sidebar />
            <div
                className={
                    'ml-[300px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 md:ml-0'
                }
            >
                {children}
            </div>
        </FullLayout>
    );
};
export default MarketLayout;
