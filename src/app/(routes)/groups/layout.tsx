import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

export function generateMetadata() {
    return {
        title: 'Nhóm của bạn | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({ children }) => {
    return <>{children}</>;
};

export default GroupLayout;
