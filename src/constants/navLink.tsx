import { HiHome } from 'react-icons/hi';
import { IoChatbubbleEllipses } from 'react-icons/io5';

import { FaUsers } from 'react-icons/fa';
import React from 'react';

interface NavLink {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export const navLink: NavLink[] = [
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

export const navAdmin: NavLink[] = [
    ...navLink,
    {
        name: 'Người dùng',
        path: '/admin/users',
        icon: <FaUsers className="w-8 h-8 dark:text-primary" />,
    },
];

export const navProfile = [
    {
        name: 'Bài viết',
        path: '',
    },
    {
        name: 'Giới thiệu',
        path: '/about',
    },
    {
        name: 'Bạn bè',
        path: '/friends',
    },
    {
        name: 'Ảnh',
        path: '/photos',
    },
];
