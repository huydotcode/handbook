import { Avatar, Button } from '@/components/ui';
import GroupService from '@/lib/services/group.service';
import React from 'react';
import Infomation from '../../_components/Infomation';

interface Props {
    params: {
        id: string;
    };
}

const page: React.FC<Props> = async ({ params: { id: groupId } }) => {
    const group = (await GroupService.getGroup({ groupId })).data;
    const members = (await GroupService.getMembers({ groupId })).data;

    if (!members || !group) return null;

    return (
        <div className="flex md:flex-col-reverse">
            <Infomation group={group} />

            <div className="ml-4 flex flex-1 md:w-full">
                <div className="relative my-3 w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                    <h1 className="text-2xl font-bold">Danh sách thành viên</h1>
                    <div className="mt-2 grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                        {members.map((member) => (
                            <Button
                                href={`/profile/${member._id}`}
                                className="justify-start border"
                                key={member._id}
                            >
                                <Avatar
                                    className="mr-2"
                                    width={42}
                                    height={42}
                                    imgSrc={member.avatar}
                                    userUrl={member._id}
                                />

                                <span>{member.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default page;
