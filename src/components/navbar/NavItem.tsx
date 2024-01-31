import { navLink } from '@/constants/navLink';
import { cn } from '@/lib/utils';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Link {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface Props {
    className?: string;
    link: Link;
    onlyIcon?: boolean;
    direction?: 'row' | 'col';
    index: number;
}

const NavItem: React.FC<Props> = ({
    link,
    className,
    direction,
    onlyIcon,
    index,
}) => {
    const path = usePathname();
    const isActived = link.path === path;
    const Icon = () => {
        return link.icon;
    };

    return (
        <Tooltip
            title={link.name}
            placement={direction == 'col' ? 'right' : 'bottom'}
        >
            <li
                key={index}
                className={cn(
                    `flex items-center cursor-pointer rounded-xl p-2 hover:bg-light-100 dark:hover:bg-dark-500 `,
                    {
                        'w-[50%]': onlyIcon,
                        'bg-light-100 dark:bg-dark-100': isActived,
                        'rounded-none': direction === 'row',
                        'rounded-l-xl': index === 0,
                        'rounded-r-xl': index === navLink.length - 1,
                    },
                    `${className}`
                )}
            >
                <Link
                    className={cn(
                        'flex items-center w-full h-full md:justify-center',
                        {
                            'justify-center': onlyIcon,
                            'text-blue-500': isActived,
                        }
                    )}
                    href={link.path || '/'}
                >
                    <Icon />
                    {!onlyIcon && (
                        <span className="ml-2 text-sm lg:hidden dark:text-primary">
                            {link.name}
                        </span>
                    )}
                </Link>
            </li>
        </Tooltip>
    );
};
export default NavItem;
