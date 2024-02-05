import InfoGroup from '@/app/(private)/admin/_components/InfoGroup';
import Users from '@/app/(private)/admin/_components/Users';
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
                    ItemComponent={Users}
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
