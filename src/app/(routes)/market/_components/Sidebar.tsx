'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import SearchMarket from './SearchMarket';
import { Button } from '@/components/ui';
import FixedSidebar from '@/components/layout/FixedSidebar';

interface Props {
    categories: ICategory[];
}

const Sidebar: React.FC<Props> = ({ categories }) => {
    return (
        <>
            <FixedSidebar>
                <div className="px-4 py-2">
                    <h1 className="text-2xl font-bold">Market</h1>

                    <SearchMarket />

                    <Button
                        className="mt-2"
                        variant={'primary'}
                        href="/market/create/item"
                    >
                        Tạo mặt hàng cần bán
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
