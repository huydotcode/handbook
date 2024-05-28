import { getAuthSession } from '@/lib/auth';
import { UserService } from '@/lib/services';
import { redirect } from 'next/navigation';
import { Sidebar } from './_components';

async function MessagesPage() {
    const session = await getAuthSession();

    if (!session) redirect('/');

    const friends = await UserService.getFriends({
        userId: session.user.id,
    });

    return (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
            <h1 className="text-2xl font-bold text-secondary-1">
                Trò chuyện ngayy...
            </h1>
        </div>
    );
}

export default MessagesPage;
