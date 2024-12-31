'use client';
import { getNewFeedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { CreatePost, Post, SkeletonPost } from '.';
import { Icons } from '../ui';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: 'home' | 'profile' | 'group';
    title?: string;
}

export const HOME_POSTS = ['posts', 'home'];
export const PROFILE_POSTS = ['posts', 'profile'];
export const GROUP_POSTS = ['posts', 'group'];

const PAGE_SIZE = 3;

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'home',
    title,
}) => {
    const { data: session } = useSession();
    const query = useInfiniteQuery({
        queryKey: getNewFeedPostsKey(type, userId, groupId, username),
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(
                `/api/posts?page=${pageParam}&pageSize=${PAGE_SIZE}$groupId=${groupId}&userId=${userId}&username=${username}&type=${type}`
            );
            return res.json();
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const { ref: bottomRef, inView } = useInView({
        threshold: 0,
    });

    const currentUser = session?.user;
    const isCurrentUser =
        currentUser?.id === userId || currentUser?.username === username;
    const isGroupPage = type === 'group';
    const isProfilePage = type === 'profile';

    useEffect(() => {
        if (inView) {
            query.fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            <div className={cn(className, 'w-full')}>
                {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

                {type === 'home' && currentUser && <CreatePost />}
                {isProfilePage && isCurrentUser && <CreatePost />}
                {isGroupPage && currentUser && groupId && (
                    <CreatePost groupId={groupId} type="group" />
                )}

                {query.data?.pages.map((page, i) => (
                    <div key={i}>
                        {page.map((post: IPost) => (
                            <Post data={post} key={post._id} />
                        ))}

                        <div className="py-2" ref={bottomRef}></div>
                    </div>
                ))}

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
