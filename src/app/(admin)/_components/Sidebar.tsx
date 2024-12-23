'use client';
import { Items } from '@/components/shared';
import { navAdmin } from '@/constants/navLink';
import Item from 'antd/es/list/Item';
import React from 'react';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    return (
        <aside className="fixed left-0 top-[56px] h-screen w-[80px] bg-secondary-1">
            {navAdmin.map((item, index) => (
                <Items.Nav
                    className="p-2"
                    index={index}
                    link={item}
                    key={index}
                />
            ))}
        </aside>
    );
};

export default Sidebar;
