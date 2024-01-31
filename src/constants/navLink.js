import { HiHome } from 'react-icons/hi';
import { IoChatbubbleEllipses } from 'react-icons/io5';

import { FaUsers } from 'react-icons/fa';

export const navLink = [
    {
        name: 'Trang chủ',
        path: '/',
        icon: <HiHome className="w-8 h-8 dark:text-primary" />,
    },
    {
        name: 'Trò chuyện',
        path: '/messages',
        icon: <IoChatbubbleEllipses className="w-8 h-8 dark:text-primary" />,
    },
];

export const navAdmin = [
    ...navLink,
    {
        name: 'Người dùng',
        path: '/admin/users',
        icon: <FaUsers className="w-8 h-8 dark:text-primary" />,
    },
];
