import React from 'react';
import Sidebar from './_components/Sidebar';
import { CategoryService } from '@/lib/services';
import { FullLayout, Container } from '@/components/layout';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Market | Handbook',
    };
}

const MarketLayout: React.FC<Props> = async ({ children }) => {
    const categories = await CategoryService.getCategories();

    return (
        <FullLayout>
            <Sidebar categories={categories} />
            <div className={'ml-[300px] mt-[56px] min-h-screen bg-secondary-1'}>
                {children}
            </div>
        </FullLayout>
    );
};
export default MarketLayout;
