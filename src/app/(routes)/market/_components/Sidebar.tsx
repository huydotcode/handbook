'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import SearchMarket from './SearchMarket';
import { Button, Icons } from '@/components/ui';
import FixedSidebar from '@/components/layout/FixedSidebar';
import { Items } from '@/components/shared';

interface Props {
    categories: ICategory[];
}

const Sidebar: React.FC<Props> = ({ categories }) => {
    return (
        <>
            <FixedSidebar>
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold lg:hidden">Market</h1>

                    <SearchMarket />

                    <Button
                        className="my-2 w-full md:hidden"
                        variant={'primary'}
                        href="/market/create/item"
                    >
                        Tạo mặt hàng cần bán
                    </Button>

                    <Button
                        className="my-2 hidden w-full md:flex"
                        variant={'primary'}
                        href="/market/create/item"
                    >
                        <Icons.Plus className="text-xl" />
                    </Button>
                </div>

                <div className="px-4 py-2">
                    <h1 className="text-xl">Danh mục</h1>

                    {categories.map((category) => (
                        <Button
                            className="mt-2 w-full justify-start"
                            href={`/market/category/${category.slug}`}
                            key={category._id}
                        >
                            <h2 className="text-sm">{category.name}</h2>
                        </Button>
                    ))}
                </div>
            </FixedSidebar>
        </>
    );
};
export default Sidebar;
