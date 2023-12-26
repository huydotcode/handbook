'use client';
import { navLink } from '@/constants/navLink';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome } from 'react-icons/hi';

const NavigationPages = ({}) => {
    const path = usePathname();

    return (
        <ul>
            {navLink.map((link, index) => {
                const isActived = link.path === path;
                const Icon = () => {
                    return link.icon;
                };
                return (
                    <li
                        key={index}
                        className={cn(
                            'flex items-center w-full cursor-pointer rounded-xl p-2 my-1 hover:bg-light-100 dark:hover:bg-dark-500'
                        )}
                    >
                        <Link
                            className="flex items-center w-full h-full md:justify-center"
                            href={link.path || '/'}
                        >
                            <Icon />
                            <span className="ml-2 md:hidden dark:text-primary">
                                {link.name}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
export default NavigationPages;
