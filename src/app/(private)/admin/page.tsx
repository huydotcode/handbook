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
            <div className="grid col-auto gap-4 flex-1 m-4 h-fit">
                <div className="max-w-[300px] bg-white shadow-xl rounded-xl p-4 max-h-[200px]">
                    <h5>Người dùng: {userCount}</h5>
                    <div className="flex items-center mt-2">
                        {users.map((user: IUser) => {
                            return <UserItem data={user} key={user._id} />;
                        })}

                        {userCount - users.length > 0 && (
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-500">
                                <span className="text-white text-center">
                                    +{userCount - users.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-[300px] bg-white shadow-xl rounded-xl p-4 max-h-[200px]">
                    <h5>Bài viết: {postCount}</h5>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
