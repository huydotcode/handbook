import { InfinityPostComponent } from '@/components/post';
import GroupService from '@/lib/services/group.service';
import React from 'react';
import Infomation from '../_components/Infomation';

interface Props {
    params: {
        id: string;
    };
}

const page: React.FC<Props> = async ({ params: { id: groupId } }) => {
    const res = await GroupService.getGroup({ groupId });
    const group = res.data as IGroup;

    if (!group) return null;

    return (
        <div className="flex md:flex-col-reverse">
            <Infomation group={group} />

            <div className="ml-4 flex flex-1 md:w-full">
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
