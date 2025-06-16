import { getAuthSession } from '@/lib/auth';
import ConversationService from '@/lib/services/conversation.service';
import GroupService from '@/lib/services/group.service';
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
        const group = await GroupService.getById(groupId);

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
    const group = await GroupService.getById(groupId);
    const conversations = await ConversationService.getByGroupId(groupId);

    if (!group) redirect('/groups');

    const session = await getAuthSession();
    if (!session?.user) return redirect('/');

    const isMember = group.members.some(
        (member) => member.user._id === session.user.id
    );
    const canAccess = isMember || group.type === 'public';

    return (
        <div>
            {canAccess && (
                <Sidebar group={group} conversations={conversations} />
            )}

            <div className="mx-auto w-full max-w-[1000px]">
                <Header group={group} />

                {canAccess && (
                    <main className="mt-4 min-h-[150vh]">{children}</main>
                )}
            </div>
        </div>
    );
};
export default GroupLayout;
