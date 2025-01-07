'use client';
import React, { useState } from 'react';
import SearchMarket from './SearchMarket';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { IconsArray } from '@/components/ui/Icons';
import { useCategories } from '@/context/AppContext';

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { data: categories } = useCategories();
    const [showFullSidebar, setShowFullSidebar] = useState<boolean>(false);

    return (
        <aside className="no-scrollbar fixed left-0 top-[56px] z-10 h-full w-[300px] max-w-[360px] overflow-scroll border-r-2 bg-white p-2 dark:border-none dark:bg-dark-secondary-1 md:max-w-[80px]">
            <div className="px-4 py-2 md:px-1">
                <h1 className="text-2xl font-bold md:hidden">Market</h1>

                <SearchMarket
                    showFull={showFullSidebar}
                    setShowFullSidebar={setShowFullSidebar}
                />

                <Button
                    className="my-2 hidden w-full md:flex md:py-2"
                    variant={'primary'}
                    href="/market/create/item"
                    size={'sm'}
                >
                    <Icons.Plus />
                </Button>

                <Button
                    className="my-2 w-full md:hidden"
                    variant={'primary'}
                    href="/market/create/item"
                    size={'sm'}
                >
                    Tạo mặt hàng cần bán
                </Button>
            </div>

            <div className="px-4 py-2 md:px-1">
                <h1 className="md:hidden">Danh mục</h1>

                {categories &&
                    categories.map((category) => {
                        const Icon = IconsArray.find(
                            (icon) => icon.name === category.icon
                        )?.icon;

                        return (
                            <Button
                                className="mt-2 w-full justify-start md:justify-center md:py-4 md:text-xl"
                                href={`/market/category/${category.slug}`}
                                key={category._id}
                                variant={'outline'}
                            >
                                {Icon && <Icon className="mr-2 md:mr-0" />}
                                <h2 className="text-sm md:hidden">
                                    {category.name}
                                </h2>
                            </Button>
                        );
                    })}
            </div>
        </aside>
    );
};
export default Sidebar;
