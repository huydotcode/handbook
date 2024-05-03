import { getGroup } from '@/lib/actions/group.action';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from '../_components/Header';
import { getAuthSession } from '@/lib/auth';

interface Props {
    params: {
        groupId: string;
    };
    children: React.ReactNode;
}

const GroupLayout: React.FC<Props> = async ({
    params: { groupId },
    children,
}) => {
    const group = (await getGroup({ groupId })) as IGroup;
    if (!group) redirect('/groups');

    const session = await getAuthSession();
    if (!session?.user) return redirect('/');

    // Kiểm tra đã tham gia nhóm chưa
    const isMember = group.members.some(
        (member) => member._id === session.user.id
    );
    if (!isMember) return redirect('/groups');

    return (
        <div className="w-full pl-[200px] md:pl-0">
            <div className="w-full">
                <Header group={group} />
                <main className="mt-4 min-h-[150vh]">{children}</main>
            </div>
        </div>
    );
};
export default GroupLayout;
