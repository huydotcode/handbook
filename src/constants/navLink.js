import { HiChat, HiHome } from 'react-icons/hi';
import { IoChatbubbleEllipses } from 'react-icons/io5';

export const navLink = [
    {
        name: 'Trang chủ',
        path: '/',
        icon: <HiHome className="w-8 h-8 dark:text-primary " />,
    },
    {
        name: 'Trò chuyện',
        path: '/messages',
        icon: <IoChatbubbleEllipses className="w-8 h-8 dark:text-primary" />,
    },
];
