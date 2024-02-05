'use client';
import { navLink } from '@/constants/navLink';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React from 'react';
import Items from '../item/Items';
import Icons from '../ui/Icons';
interface Props {
    className?: string;
    itemClassName?: string;
    onlyIcon?: boolean;
    direction?: 'row' | 'col';
    handleClose?: () => void;
}

const NavigationPages: React.FC<Props> = ({
    className = '',
    itemClassName = '',
    onlyIcon = false,
    direction = 'col',
    handleClose,
}) => {
    const { data: session } = useSession();

    return (
        <ul
            className={cn(
                `${className} flex-${direction}`,
                direction == 'col' && 'dark:bg-dark-200'
            )}
        >
            {session?.user.role === 'admin' && (
                <>
                    <Items.Nav
                        link={{
                            name: 'Admin',
                            path: '/admin',
                            icon: (
                                <Icons.Admin className="h-8 w-8 dark:text-primary" />
                            ),
                        }}
                        key={0}
                        className={itemClassName}
                        onlyIcon={onlyIcon}
                        direction={direction}
                        index={0}
                    />
                </>
            )}

            {navLink.map((link, index) => {
                return (
                    <Items.Nav
                        link={link}
                        key={index}
                        className={itemClassName}
                        onlyIcon={onlyIcon}
                        direction={direction}
                        index={index}
                        handleClose={handleClose}
                    />
                );
            })}
        </ul>
    );
};
export default NavigationPages;
