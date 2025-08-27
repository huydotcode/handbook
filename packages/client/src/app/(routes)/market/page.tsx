'use client';
import { Button } from '@/components/ui/Button';
import { API_ROUTES } from '@/config/api';
import { useSidebarCollapse } from '@/context/SidebarContext';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ListItem from './_components/ListItem';
import SearchMarket from './_components/SearchMarket';

interface Props {}

const PAGE_SIZE = 10;

const MarketPage: React.FC<Props> = () => {
    const { setIsSidebarOpen } = useSidebarCollapse();
    const router = useRouter();

    const {
        data: items,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery<IItem[]>({
        queryKey: queryKey.items.index,
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosInstance.get(
                API_ROUTES.ITEMS.QUERY(pageParam as number, PAGE_SIZE)
            );
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length + 1;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            if (firstPage.length < PAGE_SIZE) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });

    const { ref: bottomRef, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    return (
        <div className={'h-full min-h-screen w-full'}>
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

            <ListItem data={items?.pages.flatMap((page) => page) || []} />

            {hasNextPage && (
                <div ref={bottomRef} className="mt-4 py-2 text-center" />
            )}
        </div>
    );
};

export default MarketPage;
