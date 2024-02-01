'use client';
import { navLink } from '@/constants/navLink';
import { cn } from '@/lib/utils';
import React from 'react';
import NavItem from './NavItem';
import { useSession } from 'next-auth/react';
import { RiAdminFill } from 'react-icons/ri';

interface Props {
    className?: string;
    itemClassName?: string;
    onlyIcon?: boolean;
    direction?: 'row' | 'col';
}

const NavigationPages: React.FC<Props> = ({
    className = '',
    itemClassName = '',
    onlyIcon = false,
    direction = 'col',
}) => {
    const { data: session } = useSession();

    return (
        <ul className={cn(`${className} flex-${direction}`)}>
            {session?.user.role === 'admin' && (
                <NavItem
                    index={0}
                    link={{
                        name: 'Admin',
                        path: '/admin',
                        icon: (
                            <RiAdminFill className="h-8 w-8 dark:text-primary" />
                        ),
                    }}
                    key={0}
                    className={itemClassName}
                    onlyIcon={onlyIcon}
                    direction={direction}
                />
            )}

            {navLink.map((link, index) => {
                return (
                    <NavItem
                        index={index}
                        link={link}
                        key={index}
                        className={itemClassName}
                        onlyIcon={onlyIcon}
                        direction={direction}
                    />
                );
            })}
        </ul>
    );
};
export default NavigationPages;
