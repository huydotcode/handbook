import React from 'react';
import Sidebar from './_components/Sidebar';
import { CategoryService } from '@/lib/services';
import { FullLayout, Container } from '@/components/layout';

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
        <FullLayout>
            <Sidebar categories={categories} />
            <Container direction={'right'}>{children}</Container>
        </FullLayout>
    );
};
export default MarketLayout;
