import { InfinityPostComponent } from '@/components/post';

interface Props {
    params: Promise<{ groupId: string }>;
}

const ManagePostPage: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;

    return (
        <InfinityPostComponent
            groupId={groupId}
            type={'group'}
            title={'Quản lý bài viết'}
            isManage
        />
    );
};

export default ManagePostPage;
