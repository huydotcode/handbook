import { InfinityPostComponent } from '@/components/post';
import GroupService from '@/lib/services/group.service';
import React from 'react';
import Infomation from '../_components/Infomation';

interface Props {
    params: {
        groupId: string;
    };
}

const page: React.FC<Props> = async ({ params: { groupId } }) => {
    const group = await GroupService.getGroup({ groupId });

    if (!group) return null;

    return (
        <div className="flex justify-between md:flex-col">
            <Infomation group={group} />

            <div className="ml-4 flex flex-1 md:mt-2 md:w-full">
                <InfinityPostComponent
                    className="w-full"
                    groupId={groupId}
                    type="group"
                />
            </div>
        </div>
    );
};
export default page;
