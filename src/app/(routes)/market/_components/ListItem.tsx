'use client';

import { getItemsKey } from '@/lib/queryKey';
import { useInfiniteQuery } from '@tanstack/react-query';
import Item from './Item';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import axiosInstance from '@/lib/axios';
import { API_ROUTES } from '@/config/api';

interface Props {}

const PAGE_SIZE = 10;

const ListItem: React.FC<Props> = () => {
    const {
        data: items,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery<IItem[]>({
        queryKey: getItemsKey(),
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
        <div
            className={
                'grid grid-cols-4 gap-2 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'
            }
        >
            {items &&
                items.pages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page.map((item) => (
                            <Item key={item._id} data={item} />
                        ))}

                        {hasNextPage && (
                            <div ref={bottomRef} className={'w-full'} />
                        )}
                    </React.Fragment>
                ))}
        </div>
    );
};

export default ListItem;
