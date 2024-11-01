import React from 'react';
import { FullLayout } from '@/components/layout';

interface Props {
    children: React.ReactNode;
}

export function generateMetadata() {
    return {
        title: 'Nhóm của bạn | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({ children }) => {
    return <FullLayout>{children}</FullLayout>;
};

export default GroupLayout;
