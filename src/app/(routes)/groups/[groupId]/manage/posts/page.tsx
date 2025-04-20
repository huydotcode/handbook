import { InfinityPostComponent } from '@/components/post';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
    params: Promise<{ groupId: string }>;
}

const ManagePostPage: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;

    return (
        <>
            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="active" className={'w-[200px]'}>
                        Đã Duyệt
                    </TabsTrigger>
                    <TabsTrigger value="pending" className={'w-[200px]'}>
                        Chờ
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <InfinityPostComponent
                        groupId={groupId}
                        type={'manage-group-posts'}
                        title={'Quản lý bài viết đang chờ duyệt'}
                    />
                </TabsContent>
                <TabsContent value="pending">
                    <InfinityPostComponent
                        groupId={groupId}
                        type={'manage-group-posts-pending'}
                        title={'Quản lý bài viết đã duyệt'}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default ManagePostPage;
