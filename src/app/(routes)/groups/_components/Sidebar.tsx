'use client';
import { Items } from '@/components/shared';
import { Icons } from '@/components/ui';
import React from 'react';
import FixedSidebar from '@/components/layout/FixedSidebar';
import { Button } from '@/components/ui/Button';

interface Props {
    groups: IGroup[];
}

const Sidebar: React.FC<Props> = ({ groups }) => {
    return (
        <FixedSidebar hideOnMobile={false}>
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
        </FixedSidebar>
    );
};
export default Sidebar;
