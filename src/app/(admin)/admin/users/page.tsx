import { fetchUsers } from '@/lib/actions/admin/user.action';
import { getAuthSession } from '@/lib/auth';
import { AdminAction, RefreshButton } from '../_components';

const className = 'border-collapse border p-2';
const headerClassName = 'border-collapse border p-2';

const UsersPage = async ({}) => {
    const users = (await fetchUsers({ limit: 20 })) as IUser[];
    const session = await getAuthSession();

    return (
        <div className="flex w-full flex-col p-4">
            <div className="flex items-center">
                <h5 className="text-2xl font-bold">Quản lý người dùng</h5>
                <RefreshButton />
            </div>

            <table className="mt-2 h-fit w-full table-auto overflow-scroll p-2">
                <thead>
                    <tr>
                        <th className={headerClassName}>STT</th>
                        <th className={headerClassName}>ID</th>
                        <th className={headerClassName}>Email</th>
                        <th className={headerClassName}>Tên</th>
                        <th className={headerClassName}>Tên tài khoản</th>
                        <th className={headerClassName}>Quyền</th>
                        <th className={headerClassName}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className={className + ' text-center'}>
                                {index + 1}
                            </td>
                            <td className={className}>{user._id}</td>
                            <td className={className}>{user.email}</td>
                            <td className={className}>{user.name}</td>
                            <td className={className}>{user.username}</td>
                            <td className={className}>{user.role}</td>
                            <td className={className}>
                                {session?.user.role === 'admin' &&
                                    session.user.id !== user._id && (
                                        <AdminAction
                                            id={user._id}
                                            path={'/admin/users'}
                                            type={'user'}
                                        />
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default UsersPage;
