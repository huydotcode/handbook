'use client';
import { Items } from '@/components/shared';
import { Button, Icons } from '@/components/ui';
import React from 'react';
interface Props {
    groups: IGroup[];
}

const Sidebar: React.FC<Props> = ({ groups }) => {
    return (
        <div className="no-scrollbar fixed left-0 top-[56px] h-full w-[300px] overflow-scroll border-r-2 bg-secondary-1 p-2 dark:border-none dark:bg-dark-secondary-1 lg:w-[200px] md:w-[72px]">
            <h5 className="lg:hidden">Nhóm bạn đã tham gia</h5>
            <Button
                className="my-2 w-full md:hidden"
                variant={'primary'}
                href="/groups/create"
            >
                Tạo nhóm mới
            </Button>

            <Button
                className="my-2 hidden w-full md:flex"
                variant={'primary'}
                href="/groups/create"
            >
                <Icons.Plus className="text-xl" />
            </Button>

            <div>
                {groups.length > 0 &&
                    groups.map((group) => (
                        <Items.Group data={group} key={group._id} />
                    ))}
            </div>
        </div>
    );
};
export default Sidebar;
