import ManageGroupForm from '@/app/(routes)/groups/_components/ManageGroupForm';
import { getGroupByGroupId } from '@/lib/actions/group.action';
import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ groupId: string }>;
}

const ManageGroup = async ({ params }: Props) => {
    const { groupId } = await params;
    const group = await getGroupByGroupId({ groupId });

    if (!group) redirect('/groups');

    return <ManageGroupForm group={group} />;
};

export default ManageGroup;
