'use client';
import { getNewFeedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { CreatePost, Post, SkeletonPost } from '.';
import { Icons } from '../ui';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: 'home' | 'profile' | 'group';
    title?: string;
    isManage?: boolean;
}

export const HOME_POSTS = ['posts', 'home'];

const PAGE_SIZE = 3;

export const usePosts = ({
    userId,
    groupId,
    username,
    type = 'home',
    isManage = false,
}: {
    userId?: string;
    groupId?: string;
    username?: string;
    type?: 'home' | 'profile' | 'group';
    isManage?: boolean;
}) => {
    return useInfiniteQuery({
        queryKey: getNewFeedPostsKey(type, userId, groupId, username, isManage),
        queryFn: async ({ pageParam = 1 }) => {
            // const res = await fetch(
            //     `/api/posts?page=${pageParam}&pageSize=${PAGE_SIZE}&groupId=${groupId}&userId=${userId}&username=${username}&type=${type}&isManage=${isManage}`
            // );
            // return await res.json();

            const res = await fetch(
                `https://handbook-no8b5cljd-huydotcodes-projects.vercel.app/api/v1/posts/new-feed?page=${pageParam}&pageSize=${PAGE_SIZE}`
            );

            const data = await res.json();

            return data;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        select: (data) => data.pages.flatMap((page) => page),
        initialPageParam: 1,
        refetchInterval: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'home',
    title,
    isManage = false,
}) => {
    const { data: session } = useSession();
    const query = usePosts({ userId, groupId, username, type, isManage });

    const { ref: bottomRef, inView } = useInView({
        threshold: 0,
    });

    const currentUser = session?.user;
    const isCurrentUser =
        currentUser?.id === userId || currentUser?.username === username;
    const isGroupPage = type === 'group';
    const isProfilePage = type === 'profile';

    useEffect(() => {
        if (!query.isFetching && inView) {
            (async () => {
                try {
                    await query.fetchNextPage();
                } catch (error) {
                    toast.error('Có lỗi xảy ra khi tải bài viết');
                }
            })();
        }
    }, [query.isFetching, inView, query]);

    return (
        <>
            <div className={cn(className, 'relative w-full')}>
                {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

                {isManage && (
                    <Button
                        onClick={() => query.refetch()}
                        className="mb-2"
                        variant="primary"
                    >
                        Tải mới
                    </Button>
                )}

                {!isManage && type === 'home' && currentUser && <CreatePost />}
                {!isManage && isProfilePage && isCurrentUser && <CreatePost />}
                {!isManage && isGroupPage && currentUser && groupId && (
                    <CreatePost groupId={groupId} type="group" />
                )}

                {query?.data &&
                    query?.data.map((post: IPost) => (
                        <Post data={post} key={post._id} isManage={isManage} />
                    ))}

                <div className="absolute bottom-[800px]" ref={bottomRef}></div>

                {query.isLoading && (
                    <div className="flex justify-center py-10">
                        <Icons.Loading className="text-4xl" />
                    </div>
                )}

                {query.isFetchingNextPage && (
                    <div>
                        <SkeletonPost />
                        <SkeletonPost />
                        <SkeletonPost />
                    </div>
                )}

                {!query.isLoading &&
                    !query.isFetchingNextPage &&
                    !query.hasNextPage && (
                        <div className="pb-10 text-center">
                            Bạn đã đọc hết bài của ngày hôm nay
                        </div>
                    )}
            </div>
        </>
    );
};
export default InfinityPostComponent;
