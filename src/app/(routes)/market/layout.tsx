import React from 'react';
import { Navbar } from '@/components/layout';
import Sidebar from './_components/Sidebar';
import { CategoryService } from '@/lib/services';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MarketLayout: React.FC<Props> = async ({ children }) => {
    const categories = await CategoryService.getCategories();

    return (
        <div>
            <Navbar />
            <div className="relative left-1/2 flex h-[calc(100vh-56px)] min-w-[80%] max-w-[1876px] -translate-x-1/2 justify-between rounded-xl bg-transparent p-2 md:min-w-full">
                <Sidebar categories={categories} />
                <div className="flex flex-1 items-center justify-center rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default MarketLayout;
