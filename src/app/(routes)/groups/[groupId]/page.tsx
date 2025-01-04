import { InfinityPostComponent } from '@/components/post';
import { getGroupByGroupId } from '@/lib/actions/group.action';
import React from 'react';
import Infomation from '../_components/Infomation';

interface Props {
    params: Promise<{ groupId: string }>;
}

const page: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;
    const group = await getGroupByGroupId({ groupId });

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
