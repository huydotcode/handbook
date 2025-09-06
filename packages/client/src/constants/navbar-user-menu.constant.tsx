import { DarkmodeButton, Icons } from '@/components/ui';
import { JSX } from 'react';

export type INavbarUserMenu = {
    title: string;
    icon?: () => JSX.Element;
    href?: string;
    action?: () => void;
    render?: () => JSX.Element;
    children?: INavbarUserMenu[];
};

export const navbarUserMenu: INavbarUserMenu[] = [
    {
        title: 'Giao diện',
        icon: () => <Icons.Theme />,
        render: () => <DarkmodeButton />,
    },
    {
        title: 'Cài đặt',
        icon: () => <Icons.Setting />,
        href: '/settings',
    },
];
