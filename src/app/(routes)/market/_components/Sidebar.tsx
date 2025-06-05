'use client';

import { Button } from '@/components/ui/Button';
import { IconsArray } from '@/components/ui/Icons';
import { useCategories } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import SearchMarket from './SearchMarket';
import { useSidebarCollapse } from '@/context/SidebarContext';
import SidebarCollapse from '@/components/layout/SidebarCollapse';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: categories } = useCategories();
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();

    return (
        <>
            <SidebarCollapse>
                <h1 className="text-2xl font-bold">Market</h1>

                <SearchMarket />

                <Button
                    className="mt-2 w-full"
                    variant={'primary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/create/item');
                    }}
                    size={'sm'}
                >
                    Tạo mặt hàng cần bán
                </Button>

                <Button
                    className="mt-2 w-full"
                    variant={'secondary'}
                    onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('/market/manage/items');
                    }}
                    size={'sm'}
                >
                    Quản lý mặt hàng
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
                                        `/market/category/${category._id}`
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
