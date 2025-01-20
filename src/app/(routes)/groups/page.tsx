import { InfinityPostComponent } from '@/components/post';
import { getRecommendGroups } from '@/lib/actions/group.action';
import { getAuthSession } from '@/lib/auth';
import { Sidebar } from './_components';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

const GroupsPage = async () => {
    const session = await getAuthSession();
    if (!session) return null;
    const groups = await getRecommendGroups({ userId: session?.user?.id });
    return (
        <div>
            <Sidebar />

            <div className="ml-[400px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 lg:ml-[80px]">
                <div className="mx-auto mt-[80px] max-w-[700px] xl:max-w-[600px] lg:max-w-[600px] md:mx-2">
                    {groups && groups.length > 0 && (
                        <>
                            <h5 className="text-xl font-bold">Nhóm gợi ý</h5>

                            <div className="mt-2 grid grid-cols-4 gap-4">
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
            </div>
        </div>
    );
};
export default GroupsPage;
