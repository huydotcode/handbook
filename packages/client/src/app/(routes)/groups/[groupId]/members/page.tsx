import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { GroupUserRole } from '@/enums/GroupRole';
import GroupService from '@/lib/services/group.service';
import { FormatDate } from '@/utils/formatDate';
import { splitName } from '@/utils/splitName';

const MAX_MEMBERS = 6;

const GroupPage = async ({
    params,
}: {
    params: Promise<{ groupId: string }>;
}) => {
    const { groupId } = await params;
    const group = await GroupService.getById(groupId);
    const members = await GroupService.getMembers(groupId);

    if (!members || !group) return null;

    return (
        <div className="rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1">
            <div>
                <h1 className="text-sm font-bold">Quản trị viên</h1>
                <div className="mt-2">
                    {members
                        .filter((m) => m.role == GroupUserRole.ADMIN)
                        .map((member) => (
                            <Button
                                href={`/groups/${group._id}/members/${member.user._id}`}
                                className="min-w-[200px] justify-start"
                                key={member._id}
                                variant={'ghost'}
                                size={'md'}
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
                <div className="mt-2 grid grid-cols-3 gap-2 lg:grid-cols-2 md:grid-cols-1">
                    {members
                        .filter((m) => m.role == GroupUserRole.MEMBER)
                        .slice(0, MAX_MEMBERS)
                        .map((member) => (
                            <Button
                                href={`/groups/${group._id}/members/${member.user._id}`}
                                className="min-w-[200px] justify-start"
                                key={member._id}
                                variant={'ghost'}
                                size={'md'}
                            >
                                <Avatar
                                    onlyImage
                                    className="mr-2"
                                    width={32}
                                    height={32}
                                    imgSrc={member.user.avatar}
                                />

                                <div className="flex flex-col">
                                    <span>
                                        {splitName(member.user.name).firstName}{' '}
                                        {splitName(member.user.name).lastName}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        Tham gia vào{' '}
                                        {FormatDate.formatISODateToDateTime(
                                            member.joinedAt
                                        )}
                                    </span>
                                </div>
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
