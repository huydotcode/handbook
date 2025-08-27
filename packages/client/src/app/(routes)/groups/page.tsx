import { InfinityPostComponent } from '@/components/post';
import { Button } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import GroupService from '@/lib/services/group.service';
import Image from 'next/image';
import { Sidebar } from './_components';

const GroupsPage = async () => {
    const session = await getAuthSession();
    if (!session) return null;
    const groups = await GroupService.getRecommendedGroups(session.user.id);

    return (
        <>
            <Sidebar />

            <div className="mx-auto max-w-[700px]">
                {groups && groups.length > 0 && (
                    <>
                        <h5 className="text-xl font-bold">Nhóm gợi ý</h5>

                        <div className="mt-2 grid grid-cols-4 gap-4 p-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            {groups.map((group) => (
                                <Button
                                    className="flex h-[100px] flex-col items-center rounded-xl bg-secondary-1 p-4 dark:bg-dark-secondary-1"
                                    key={group._id}
                                    href={`/groups/${group._id}`}
                                >
                                    <Image
                                        src={group.avatar.url}
                                        alt={group.name}
                                        width={50}
                                        height={50}
                                    />

                                    <h5 className="text-primary-11 dark:text-dark-primary-11 mt-2 max-w-full overflow-clip text-center text-sm font-bold">
                                        {group.name}
                                    </h5>
                                </Button>
                            ))}
                        </div>
                    </>
                )}

                <InfinityPostComponent
                    className="mt-2"
                    title="Hoạt động gần đây"
                    type="new-feed-group"
                />
            </div>
        </>
    );
};
export default GroupsPage;
