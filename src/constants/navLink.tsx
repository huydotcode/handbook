import Icons from '@/components/ui/Icons';
import { UserRole } from '@/enums/UserRole';
import React from 'react';

interface NavLink {
    name: string;
    path: string;
    icon: React.ReactNode;
    role?: string;
    visible?: string[];
    children?: NavLink[];
}

export const SIDEBAR = 'sidebar';
export const NAVBAR = 'navbar';

export const navLink: NavLink[] = [
    {
        name: 'Admin',
        path: '/admin',
        icon: <Icons.Admin className="h-8 w-8 " />,
        role: UserRole.ADMIN,
        visible: [SIDEBAR, NAVBAR],
    },
    {
        name: 'Trang chủ',
        path: '/',
        icon: <Icons.Home className="h-8 w-8 " />,
        visible: [SIDEBAR, NAVBAR],
    },
    {
        name: 'Khám phá',
        path: '/news-feed',
        icon: <Icons.Posts className="h-8 w-8 " />,
        visible: [SIDEBAR],
    },
    {
        name: 'Trò chuyện',
        path: '/messages',
        icon: <Icons.Message className="h-8 w-8 " />,
        visible: [SIDEBAR, NAVBAR],
    },
    {
        name: 'Chợ',
        path: '/market',
        icon: <Icons.Shop className="h-8 w-8" />,
        visible: [SIDEBAR, NAVBAR],
    },
    {
        name: 'Nhóm',
        path: '/groups',
        icon: <Icons.Group className="h-8 w-8 " />,
        visible: [SIDEBAR, NAVBAR],
    },
    {
        name: 'Đã lưu',
        path: '/saved',
        icon: <Icons.Bookmark className="h-7 w-7" />,
        visible: [SIDEBAR],
    },
    {
        name: 'Tạo bài viết',
        path: '/create-post',
        icon: <Icons.CreatePost className="h-7 w-7" />,
        visible: [SIDEBAR],
    },
];

export const navbarLink: NavLink[] = navLink.filter((nav) =>
    nav.visible?.includes(NAVBAR)
);
export const sidebarLink: NavLink[] = navLink.filter((nav) =>
    nav.visible?.includes(SIDEBAR)
);

export const navAdmin: NavLink[] = [
    {
        name: 'Trang chủ',
        path: '/admin',
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
        name: 'Media',
        path: '/admin/media',
        icon: <Icons.Images className="h-8 w-8 " />,
    },
    {
        name: 'Nhóm',
        path: '/admin/groups',
        icon: <Icons.Group className="h-8 w-8 " />,
    },
    {
        name: 'Chợ',
        path: '/admin/market',
        icon: <Icons.Shop className="h-8 w-8 " />,
        children: [
            {
                name: 'Quản lý danh mục',
                icon: <Icons.Shop className="h-8 w-8 " />,
                path: '/admin/market/categories',
            },
        ],
    },
    {
        name: 'Địa điểm',
        path: '/admin/locations',
        icon: <Icons.Location className="h-8 w-8 " />,
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

export const navGroup = [
    {
        name: 'Bài viết',
        path: '',
    },
    {
        name: 'Thành viên',
        path: '/members',
    },
];
