'use client';
import { navGroup } from '@/constants/navLink';
import Image from 'next/image';
import React from 'react';
import { TabItem } from '@/components/shared';
import Action from './Action';
import { usePathname } from 'next/navigation';
import CoverPhoto from '@/app/(routes)/groups/_components/CoverPhoto';
import Avatar from '@/app/(routes)/groups/_components/Avatar';

interface Props {
    group: IGroup;
}

const Header: React.FC<Props> = ({ group }) => {
    const path = usePathname();

    return (
        <header className="w-full rounded-b-xl bg-white pb-2 dark:bg-dark-secondary-1">
            <CoverPhoto group={group} />

            <div className="flex items-center justify-between border-b lg:px-2">
                <div className="flex items-center md:flex-col md:p-2 md:pt-0">
                    <Avatar group={group} />

                    <div>
                        <h5 className="text-2xl font-black md:text-lg">
                            {group?.name}
                        </h5>
                        <span className="text-sm">
                            Nhóm{' '}
                            {group.type == 'public' ? 'công khai' : 'riêng tư'}{' '}
                            - {group?.members.length} thành viên
                        </span>
                    </div>
                </div>

                <div className="mr-2">
                    <Action group={group} />
                </div>
            </div>

            <div className="flex items-center px-2 pt-2">
                {navGroup.map((item, index) => {
                    return (
                        <TabItem
                            key={index}
                            id={group._id}
                            name={item.name}
                            page="groups"
                            path={item.path}
                        />
                    );
                })}
            </div>
        </header>
    );
};
export default Header;
