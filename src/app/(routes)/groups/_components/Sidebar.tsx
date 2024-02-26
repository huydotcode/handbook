'use client';
import { Items } from '@/components/shared';
import { Button } from '@/components/ui';
import React from 'react';

interface Props {
    groups: IGroup[];
}

const Sidebar: React.FC<Props> = ({ groups }) => {
    if (!groups) return null;

    return (
        <div className="no-scrollbar h-full overflow-scroll border-r-2 p-2 dark:border-none lg:w-fit">
            <h5 className="lg:hidden">Nhóm bạn đã tham gia</h5>
            <Button
                className="my-2 w-full"
                variant={'primary'}
                href="/groups/create"
            >
                Tạo nhóm mới
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
