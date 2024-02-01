import UserItem from '@/components/pages/Admin/item/UserItem';
import { fetchPostsCount } from '@/lib/actions/admin/post.action';
import { fetchUsers, fetchUsersCount } from '@/lib/actions/admin/user.action';
import { getAuthSession } from '@/lib/auth';

interface Props {}

const AdminPage = async ({}: Props) => {
    const session = await getAuthSession();
    const userCount = await fetchUsersCount();
    const users = await fetchUsers({ limit: 5 });

    const postCount = await fetchPostsCount();

    return (
        <>
            <div className="col-auto m-4 grid h-fit flex-1 gap-4">
                <div className="max-h-[200px] max-w-[300px] rounded-xl bg-white p-4 shadow-xl">
                    <h5>Người dùng: {userCount}</h5>
                    <div className="mt-2 flex items-center">
                        {users.map((user: IUser) => {
                            return <UserItem data={user} key={user._id} />;
                        })}

                        {userCount - users.length > 0 && (
                            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                                <span className="text-center text-white">
                                    +{userCount - users.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-h-[200px] max-w-[300px] rounded-xl bg-white p-4 shadow-xl">
                    <h5>Bài viết: {postCount}</h5>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
