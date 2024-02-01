'use client';
import NavItem from '@/components/navbar/NavItem';
import { navAdmin } from '@/constants/navLink';

interface Props {}

const Sidebar = ({}: Props) => {
    return (
        <aside className="h-full w-[200px] bg-white">
            <ul>
                {navAdmin.map((link, index) => {
                    return (
                        <NavItem
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
