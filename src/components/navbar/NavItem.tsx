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
                    `flex cursor-pointer items-center rounded-xl p-2 hover:bg-light-100 dark:hover:bg-dark-500 `,
                    {
                        'w-[50%]': onlyIcon,
                        'bg-light-100 dark:bg-dark-100': isActived,
                        'rounded-none': direction === 'row',
                    },
                    `${className}`
                )}
            >
                <Link
                    className={cn(
                        'flex h-full w-full items-center md:justify-center',
                        {
                            'justify-center': onlyIcon,
                            'text-blue-500': isActived,
                        }
                    )}
                    href={link.path || '/'}
                >
                    <Icon />
                    {!onlyIcon && (
                        <span className="ml-2 text-sm dark:text-primary lg:hidden">
                            {link.name}
                        </span>
                    )}
                </Link>
            </li>
        </Tooltip>
    );
};
export default NavItem;
