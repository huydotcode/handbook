'use client';

import { Button } from '@/components/ui/Button';
import Icons, { IconsArray } from '@/components/ui/Icons';
import { useCategories } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import SearchMarket from './SearchMarket';
import { useSidebarCollapse } from '@/context/SidebarContext';
import SidebarCollapse from '@/components/layout/SidebarCollapse';
import Link from 'next/link';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: categories } = useCategories();
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();

    return (
        <>
            <SidebarCollapse>
                <Button
                    className="justify-start p-0"
                    variant={'custom'}
                    href={'/market'}
                >
                    <h1 className="text-2xl font-bold">Market</h1>
                </Button>

                <SearchMarket />

                <Button
                    className="mt-2 w-full justify-start pl-4"
                    variant={'primary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/create/item');
                    }}
                    size={'sm'}
                >
                    <Icons.CreatePost className="h-5 w-5" /> Tạo mặt hàng cần
                    bán
                </Button>

                <Button
                    className="mt-2 w-full justify-start pl-4"
                    variant={'secondary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/manage/item');
                    }}
                    size={'sm'}
                >
                    <Icons.Edit className="h-5 w-5" /> Quản lý mặt hàng
                </Button>

                <h1>Danh mục</h1>

                {categories &&
                    categories.map((category) => {
                        const Icon = IconsArray.find(
                            (icon) => icon.name === category.icon
                        )?.icon;

                        return (
                            <Button
                                className="mt-2 w-full justify-start"
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    router.push(
                                        `/market/category/${category.slug}`
                                    );
                                }}
                                key={category._id}
                                variant={'outline'}
                            >
                                {Icon && <Icon className="mr-2" />}
                                <h2 className="text-sm">{category.name}</h2>
                            </Button>
                        );
                    })}
            </SidebarCollapse>
        </>
    );
};
export default Sidebar;
