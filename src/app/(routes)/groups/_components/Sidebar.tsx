import { Searchbar } from '@/components';
import React from 'react';
import GroupList from './GroupList';

interface Props {}

const Sidebar: React.FC<Props> = ({}) => {
    return (
        <div className="fixed left-0 top-[56px] h-screen bg-light-100 p-2 dark:bg-dark-200">
            <h5 className="text-xl font-bold">Nhóm</h5>

            <GroupList />
        </div>
    );
};
export default Sidebar;
