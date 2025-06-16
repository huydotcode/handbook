import ActionMember from '@/app/(routes)/groups/_components/ActionMember';
import { InfinityPostComponent } from '@/components/post';
import { GroupUserRole } from '@/enums/GroupRole';
import { getAuthSession } from '@/lib/auth';
import GroupService from '@/lib/services/group.service';
import UserService from '@/lib/services/user.service';
import { notFound, redirect } from 'next/navigation';

interface Props {
    params: Promise<{ memberId: string; groupId: string }>;
}

const MemberPage = async ({ params }: Props) => {
    const { memberId, groupId } = await params;
    const session = await getAuthSession();
    const user = await UserService.getById(memberId);
    const group = await GroupService.getById(groupId);
    const member = group.members.find((member) => member.user._id === memberId);

    if (!group || !user) return notFound();
    if (!member) {
        redirect(`/groups/${groupId}/members`);
    }

    const isAdmin =
        group.members.find((member) => member.user._id === session?.user.id)
            ?.role === GroupUserRole.ADMIN;

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
