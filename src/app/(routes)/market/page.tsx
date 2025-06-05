'use client';
import React from 'react';
import ListItem from './_components/ListItem';
import SearchMarket from './_components/SearchMarket';
import { Button } from '@/components/ui/Button';
import { useSidebarCollapse } from '@/context/SidebarContext';
import { useRouter } from 'next/navigation';

interface Props {}

const MarketPage: React.FC<Props> = () => {
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();

    return (
        <div className={'h-full min-h-screen w-full p-4'}>
            <SearchMarket className="hidden bg-secondary-1 md:flex" />

            <Button
                className="mt-2 hidden w-full md:flex"
                variant={'primary'}
                onClick={() => {
                    setIsSidebarOpen(false);
                    router.push('/market/create/item');
                }}
                size={'sm'}
            >
                Tạo mặt hàng cần bán
            </Button>

            <h1 className="text-xl font-bold md:mt-2">Các mặt hàng hôm nay</h1>

            <ListItem />
        </div>
    );
};

export default MarketPage;
