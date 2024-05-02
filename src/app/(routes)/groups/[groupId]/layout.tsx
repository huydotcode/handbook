import { getGroup } from '@/lib/actions/group.action';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from '../_components/Header';

interface Props {
    params: {
        groupId: string;
    };
    children: React.ReactNode;
}

const layout: React.FC<Props> = async ({ params: { groupId }, children }) => {
    const { data } = await getGroup({ groupId });
    if (!data) redirect('/groups');

    return (
        <div className="w-full pl-[200px] md:pl-0">
            <div className="w-full">
                <Header group={data} />
                <main className="mt-4 min-h-[150vh]">{children}</main>
            </div>
        </div>
    );
};
export default layout;
