import ManageGroupForm from '@/app/(routes)/groups/_components/ManageGroupForm';
import GroupService from '@/lib/services/group.service';
import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ groupId: string }>;
}

const ManageGroup = async ({ params }: Props) => {
    const { groupId } = await params;
    const group = await GroupService.getById(groupId);

    if (!group) redirect('/groups');

    return <ManageGroupForm group={group} />;
};

export default ManageGroup;
