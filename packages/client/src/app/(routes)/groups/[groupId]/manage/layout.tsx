import { getAuthSession } from '@/lib/auth';
import GroupService from '@/lib/services/group.service';
import { redirect } from 'next/navigation';

interface Props {
    children: React.ReactNode;
    params: Promise<{ groupId: string }>;
}

const ManageLayout: React.FC<Props> = async ({ children, params }) => {
    const { groupId } = await params;
    const session = await getAuthSession();
    const group: IGroup = await GroupService.getById(groupId);

    if (!session?.user) redirect('/');
    if (!group) redirect('/groups');
    if (group.creator._id !== session.user.id) redirect(`/groups/${groupId}`);
    if (
        !group.members.find(
            (mem) => mem.user._id === session.user.id && mem.role === 'admin'
        )
    )
        redirect(`/groups/${groupId}`);

    return <>{children}</>;
};

export default ManageLayout;
