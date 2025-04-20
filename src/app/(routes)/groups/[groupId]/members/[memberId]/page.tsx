import { getAuthSession } from '@/lib/auth';
import axiosInstance from '@/lib/axios';
import { getGroupByGroupId } from '@/lib/actions/group.action';
import { InfinityPostComponent } from '@/components/post';
import { getUserByUserId } from '@/lib/actions/user.action';
import { notFound, redirect } from 'next/navigation';
import ActionMember from '@/app/(routes)/groups/_components/ActionMember';

interface Props {
    params: Promise<{ memberId: string; groupId: string }>;
}

const MemberPage = async ({ params }: Props) => {
    const { memberId, groupId } = await params;
    const session = await getAuthSession();
    const user = await getUserByUserId({
        userId: memberId,
    });
    const group = (await getGroupByGroupId({
        groupId,
    })) as IGroup;
    const member = group.members.find((member) => member.user._id === memberId);

    if (!group || !user) return notFound();
    if (!member) {
        redirect(`/groups/${groupId}/members`);
    }

    const isAdmin =
        group.members.find((member) => member.user._id === session?.user.id)
            ?.role === 'admin';

    const isShowAction = isAdmin && memberId !== session?.user.id;

    return (
        <div>
            {isShowAction && <ActionMember member={member} group={group} />}

            <InfinityPostComponent
                className={'mt-6'}
                groupId={groupId}
                userId={memberId}
                showCreatePost={false}
                title={`Các bài viết của thành viên ${user.name}`}
                type={'post-by-member'}
            />
        </div>
    );
};

export default MemberPage;
