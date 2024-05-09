'use client';
import { Avatar } from '@/components/ui';
import TimeAgoConverted from '@/utils/timeConvert';
import React from 'react';

interface Props {
    group: IGroup;
}

const Sidebar: React.FC<Props> = ({ group: currentGroup }) => {
    return (
        <div className="no-scrollbar fixed left-0 top-[56px] h-full w-[300px] overflow-scroll border-r-2 bg-secondary-1 p-2 dark:border-none dark:bg-dark-secondary-1 lg:w-[200px] md:w-[72px]">
            <div className="flex p-2">
                <div className="relative h-8 w-8">
                    <Avatar imgSrc={currentGroup.avatar} rounded="sm" />
                </div>

                <div className="ml-2 flex flex-1 flex-col">
                    <p className="text-sm dark:text-dark-primary-1 md:hidden">
                        {currentGroup.name}
                    </p>

                    <p className="text-xs text-secondary-1 lg:hidden">
                        Lần hoạt động gần nhất:
                        <TimeAgoConverted time={currentGroup.lastActivity} />
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Sidebar;
