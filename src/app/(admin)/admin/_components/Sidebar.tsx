'use client';

import Items from '@/components/item/Items';
import { navAdmin } from '@/constants/navLink';

interface Props {}

const Sidebar = ({}: Props) => {
    return (
        <aside className="fixed top-[56px] h-[calc(100vh-56px)] w-[200px] bg-white dark:bg-dark-200">
            <ul>
                {navAdmin.map((link, index) => {
                    return (
                        <Items.Nav
                            link={link}
                            key={index}
                            direction="col"
                            index={index}
                        />
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
