import { getGroup } from '@/lib/actions/group.action';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from '../_components/Header';

interface Props {
    params: {
        id: string;
    };
    children: React.ReactNode;
}

const layout: React.FC<Props> = async ({
    params: { id: groupId },
    children,
}) => {
    const { data } = await getGroup({ groupId });
    if (!data) redirect('/groups');

    return (
        <div className="min-h-[100vh-56px] w-full">
            <div className="w-full">
                <Header group={data} />
                <main className="mt-4">{children}</main>
            </div>
        </div>
    );
};
export default layout;
