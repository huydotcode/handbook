import React from 'react';
import { Navbar } from '@/components/layout';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MarketLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};
export default MarketLayout;
