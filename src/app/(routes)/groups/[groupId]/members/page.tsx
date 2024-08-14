import { Avatar, Button } from '@/components/ui';
import GroupService from '@/lib/services/group.service';
import React from 'react';

interface Props {
    params: {
        groupId: string;
    };
}

const MAX_MEMBERS = 6;

const page: React.FC<Props> = async ({ params: { groupId } }) => {
    const group = (await GroupService.getGroup({ groupId })) as IGroup;
    const members = (await GroupService.getMembers({
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
                                variant={'text'}
                            >
                                <Avatar
                                    className="mr-2"
                                    width={42}
                                    height={42}
                                    imgSrc={member.user.avatar}
                                    userUrl={member.user._id}
                                />

                                <span>{member.user.name}</span>
                            </Button>
                        ))}
                </div>
            </div>

            <div className="mt-2">
                <h1 className="text-sm font-bold">Thành viên</h1>
                <div className="mt-2">
                    {members
                        .filter((m) => m.role == 'member')
                        .slice(0, MAX_MEMBERS)
                        .map((member) => (
                            <Button
                                href={`/profile/${member.user._id}`}
                                className="justify-start"
                                key={member._id}
                                variant={'text'}
                            >
                                <Avatar
                                    className="mr-2"
                                    width={42}
                                    height={42}
                                    imgSrc={member.user.avatar}
                                    userUrl={member.user._id}
                                />

                                <span>{member.user.name}</span>
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
export default page;
