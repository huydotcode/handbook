import { getConversationsByGroupId } from '@/lib/actions/conversation.action';
import { getGroupByGroupId } from '@/lib/actions/group.action';
import { getAuthSession } from '@/lib/auth';
import logger from '@/utils/logger';
import { redirect } from 'next/navigation';
import React from 'react';
import Header from '../_components/Header';
import Sidebar from '../_components/admin/Sidebar';

interface Props {
    params: Promise<{ groupId: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props) {
    try {
        const { groupId } = await params;
        const group = await getGroupByGroupId({ groupId });

        return {
            title: `${group.name} | Nhóm | Handbook`,
        };
    } catch (error) {
        logger({
            message: 'Error get group in layout' + error,
            type: 'error',
        });
    }

    return {
        title: 'Nhóm | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({ params, children }) => {
    const { groupId } = await params;
    const group = (await getGroupByGroupId({ groupId })) as IGroup;
    const conversations = (await getConversationsByGroupId({
        groupId: groupId,
    })) as IConversation[];

    if (!group) redirect('/groups');

    const session = await getAuthSession();
    if (!session?.user) return redirect('/');

    // Kiểm tra đã tham gia nhóm chưa
    const isMember = group.members.some(
        (mem) => mem.user._id === session.user.id
    );
    if (!isMember) return redirect('/groups');

    return (
        <div>
            <Sidebar group={group} conversations={conversations} />

            <div className="first-letter: ml-[300px] px-4 lg:ml-[200px] md:ml-[72px]">
                <div className="w-full">
                    <Header group={group} />

                    <main className="mt-4 min-h-[150vh]">{children}</main>
                </div>
            </div>
        </div>
    );
};
export default GroupLayout;
