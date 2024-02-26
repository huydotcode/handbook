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
            <InfinityPostComponent
                className="mr-2 md:mr-0 md:mt-2"
                groupId={groupId}
                type="group"
            />
            <Infomation group={group} />
        </div>
    );
};
export default page;
