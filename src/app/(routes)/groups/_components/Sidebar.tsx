import React from 'react';
import GroupList from './GroupList';
import { getGroups } from '@/lib/actions/group.action';

interface Props {}

const Sidebar: React.FC<Props> = async ({}) => {
    const groups = await getGroups();

    return (
        <div className=" fixed left-0 top-[56px] h-screen p-2 ">
            <h5 className="text-xl font-bold">Nhóm</h5>

            <GroupList data={groups.data || []} />
        </div>
    );
};
export default Sidebar;
