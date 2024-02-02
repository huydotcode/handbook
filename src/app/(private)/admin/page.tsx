import InfoGroup from '@/components/pages/Admin/InfoGroup';
import UserItem from '@/components/pages/Admin/item/UserItem';
import {
    fetchAllPosts,
    fetchPostsCount,
} from '@/lib/actions/admin/post.action';
import { fetchUsers, fetchUsersCount } from '@/lib/actions/admin/user.action';
import { getAuthSession } from '@/lib/auth';

interface Props {}

const AdminPage = async ({}: Props) => {
    const session = await getAuthSession();
    const userCount = await fetchUsersCount();
    const users = await fetchUsers({ limit: 5 });

    const posts = await fetchAllPosts({
        limit: 10,
        page: 1,
    });
    const postCount = await fetchPostsCount();

    return (
        <>
            <div className="col-auto m-4 grid h-fit flex-1 gap-4">
                <InfoGroup
                    ItemComponent={UserItem}
                    title="Người dùng"
                    path="/admin/users"
                    count={userCount}
                    data={users}
                />

                <InfoGroup
                    path="/admin/posts"
                    title="Bài viết"
                    count={postCount}
                />
            </div>
        </>
    );
};

export default AdminPage;
