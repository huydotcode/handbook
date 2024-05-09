import { Avatar, Button } from '@/components/ui';
import GroupService from '@/lib/services/group.service';
import React from 'react';
import Infomation from '../../_components/Infomation';

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

    console.log('members', members);

    if (!members || !group) return null;

    return (
        <div className="grid flex-1 grid-cols-2 gap-2 lg:grid-cols-1">
            <Infomation group={group} />

            <div className="relative w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                <h1 className="text-2xl font-bold">Danh sách quản lý</h1>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-1">
                    {members
                        .filter((m) => m.role == 'admin')
                        .map((member) => (
                            <Button
                                href={`/profile/${member.user._id}`}
                                className="justify-start border"
                                key={member._id}
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

            <div className="relative w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                <h1 className="text-2xl font-bold">Danh sách thành viên</h1>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-1">
                    {members
                        .filter((m) => m.role == 'member')
                        .slice(0, MAX_MEMBERS)
                        .map((member) => (
                            <Button
                                href={`/profile/${member.user._id}`}
                                className="justify-start border"
                                key={member._id}
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
