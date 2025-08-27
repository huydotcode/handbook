'use client';
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ListItem from '../_components/ListItem';

const PAGE_SIZE = 10;

const MarketSearchPage = () => {
    const params = useSearchParams();
    const query = params.get('q') || '';
    const {
        data: items,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery<IItem[]>({
        queryKey: queryKey.items.index,
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosInstance.get(
                API_ROUTES.ITEMS.SEARCH(query, pageParam as number, PAGE_SIZE)
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
        <div className="p-4">
            <h1 className="mb-4 text-xl font-bold">
                Kết quả tìm kiếm cho: {query}
            </h1>

            <ListItem data={items?.pages.flatMap((page) => page) || []} />

            {hasNextPage && (
                <div ref={bottomRef} className="mt-4 py-2 text-center" />
            )}
        </div>
    );
};

export default MarketSearchPage;
