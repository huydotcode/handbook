import { Avatar } from '@/components/ui';
import {
    getGroupByGroupId,
    getMembersByGroupId,
} from '@/lib/actions/group.action';
import { Button } from '@/components/ui/Button';
import { splitName } from '@/utils/splitName';

const MAX_MEMBERS = 6;

const GroupPage = async ({
    params,
}: {
    params: Promise<{ groupId: string }>;
}) => {
    const { groupId } = await params;
    const group = (await getGroupByGroupId({ groupId })) as IGroup;
    const members = (await getMembersByGroupId({
        groupId,
    })) as IMemberGroup[];

    if (!members || !group) return null;

    return (
        <div className="rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1">
            <div>
                <h1 className="text-sm font-bold">Quản trị viên</h1>
                <div className="mt-2">
                    {members
                        .filter((m) => m.role == 'admin')
                        .map((member) => (
                            <Button
                                href={`/profile/${member.user._id}`}
                                className="justify-start"
                                key={member._id}
                                variant={'outline'}
                                size={'lg'}
                            >
                                <Avatar
                                    className="mr-2"
                                    onlyImage
                                    width={32}
                                    height={32}
                                    imgSrc={member.user.avatar}
                                />

                                <span>{member.user.name}</span>
                            </Button>
                        ))}
                </div>
            </div>

            <div className="mt-2">
                <h1 className="text-sm font-bold">Thành viên</h1>
                <div className="mt-2 grid grid-cols-4 gap-2 lg:grid-cols-3 md:grid-cols-2">
                    {members
                        .filter((m) => m.role == 'member')
                        .slice(0, MAX_MEMBERS)
                        .map((member) => (
                            <Button
                                href={`/profile/${member.user._id}`}
                                className="justify-start"
                                key={member._id}
                                variant={'outline'}
                                size={'md'}
                            >
                                <Avatar
                                    onlyImage
                                    className="mr-2"
                                    width={32}
                                    height={32}
                                    imgSrc={member.user.avatar}
                                />

                                <span>
                                    {splitName(member.user.name).firstName}{' '}
                                    {splitName(member.user.name).lastName}
                                </span>
                            </Button>
                        ))}

                    {members.length > MAX_MEMBERS && (
                        <h5>
                            và {members.length - MAX_MEMBERS} thành viên khác
                        </h5>
                    )}
                </div>
            </div>
        </div>
    );
};
export default GroupPage;
