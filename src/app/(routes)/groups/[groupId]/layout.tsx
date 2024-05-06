import { getGroup } from '@/lib/actions/group.action';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from '../_components/Header';
import { getAuthSession } from '@/lib/auth';
import { GroupService } from '@/lib/services';
import logger from '@/utils/logger';
import { group } from 'console';

interface Props {
    params: {
        groupId: string;
    };
    children: React.ReactNode;
}

export async function generateMetadata({ params: { groupId } }: Props) {
    try {
        const group = await GroupService.getGroup({ groupId });

        return {
            title: `${group.name} | Nhóm | Handbook`,
        };
    } catch (error) {
        logger({
            message: 'Error get group in layout' + error,
            type: 'error',
        });
    }
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
    const isMember = group.members.some((mem) => mem._id === session.user.id);
    if (!isMember) return redirect('/groups');

    return (
        <div className="ml-2 w-full">
            <div className="w-full">
                <Header group={group} />

                <main className="mt-4 min-h-[150vh]">{children}</main>
            </div>
        </div>
    );
};
export default GroupLayout;
