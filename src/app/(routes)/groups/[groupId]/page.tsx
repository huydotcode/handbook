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
        <div className="flex justify-between lg:flex-col-reverse">
            <div className="mr-4 flex flex-1 lg:mt-4 md:mr-0 md:mt-2 md:w-full">
                <InfinityPostComponent groupId={groupId} type="group" />
            </div>

            <Infomation group={group} />
        </div>
    );
};
export default page;
