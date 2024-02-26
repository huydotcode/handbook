import Icons from '@/components/ui/Icons';
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
        icon: <Icons.Home className="h-8 w-8 " />,
    },
    {
        name: 'Trò chuyện',
        path: '/messages',
        icon: <Icons.Message className="h-8 w-8 " />,
    },
    {
        name: 'Nhóm',
        path: '/groups',
        icon: <Icons.Group className="h-8 w-8 " />,
    },
];

export const navAdmin: NavLink[] = [
    {
        name: 'Trang chủ',
        path: '/',
        icon: <Icons.Home className="h-8 w-8 " />,
    },
    {
        name: 'Người dùng',
        path: '/admin/users',
        icon: <Icons.Users className="h-8 w-8 " />,
    },
    {
        name: 'Bài viết',
        path: '/admin/posts',
        icon: <Icons.Posts className="h-8 w-8 " />,
    },
    {
        name: 'Hình ảnh',
        path: '/admin/photos',
        icon: <Icons.Images className="h-8 w-8 " />,
    },
    {
        name: 'Nhóm',
        path: '/admin/groups',
        icon: <Icons.Group className="h-8 w-8 " />,
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
