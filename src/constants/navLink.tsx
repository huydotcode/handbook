import { HiHome } from 'react-icons/hi';
import { IoChatbubbleEllipses } from 'react-icons/io5';

import { FaUsers } from 'react-icons/fa';
import React from 'react';
import { BsFileEarmarkPost } from 'react-icons/bs';

interface NavLink {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export const navLink: NavLink[] = [
    {
        name: 'Trang chủ',
        path: '/',
        icon: <HiHome className="h-8 w-8 dark:text-primary" />,
    },
    {
        name: 'Trò chuyện',
        path: '/messages',
        icon: <IoChatbubbleEllipses className="h-8 w-8 dark:text-primary" />,
    },
];

export const navAdmin: NavLink[] = [
    ...navLink,
    {
        name: 'Người dùng',
        path: '/admin/users',
        icon: <FaUsers className="h-8 w-8 dark:text-primary" />,
    },
    {
        name: 'Bài viết',
        path: '/admin/posts',
        icon: <BsFileEarmarkPost className="h-8 w-8 dark:text-primary" />,
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
