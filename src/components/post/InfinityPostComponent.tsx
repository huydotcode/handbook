'use client';
import { Button } from '@/components/ui/Button';
import axiosInstance from '@/lib/axios';
import { getNewFeedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { CreatePost, Post, SkeletonPost } from '.';
import { Icons } from '../ui';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?:
        | 'new-feed'
        | 'profile'
        | 'group'
        | 'new-feed-group'
        | 'manage-group-posts';
    title?: string;
}

const PAGE_SIZE = 3;

const usePosts = ({
    userId,
    groupId,
    username,
    type = 'new-feed',
}: Pick<Props, 'userId' | 'groupId' | 'username' | 'type'>) => {
    const { data: session } = useSession();

    const isFeedType = useMemo(
        () => ['new-feed', 'new-feed-group'].includes(type),
        [type]
    );

    return useInfiniteQuery({
        queryKey: getNewFeedPostsKey(type, userId, groupId, username),
        queryFn: async ({ pageParam = 1 }) => {
            if (!session?.user.id) return [];

            if (isFeedType) {
                const { data } = await axiosInstance.get<IPost[]>(
                    `/posts/${type}`,
                    {
                        params: {
                            page: pageParam,
                            page_size: PAGE_SIZE,
                            user_id: session.user.id,
                        },
                    }
                );
                return data;
            }

            if (type === 'profile') {
                const { data } = await axiosInstance.get<IPost[]>(
                    `/posts/profile/${userId}`,
                    {
                        params: {
                            page: pageParam,
                            page_size: PAGE_SIZE,
                        },
                    }
                );
                return data;
            }

            if (type === 'group') {
                const { data } = await axiosInstance.get<IPost[]>(
                    `/posts/group/${groupId}`,
                    {
                        params: {
                            page: pageParam,
                            page_size: PAGE_SIZE,
                        },
                    }
                );
                return data;
            }

            return [];
        },
        getNextPageParam: (lastPage, pages) =>
            lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined,
        select: (data) => data.pages.flat(),
        initialPageParam: 1,
        refetchInterval: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!session,
    });
};

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'new-feed',
    title,
}) => {
    const { data: session } = useSession();
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = usePosts({ userId, groupId, username, type });

    const { ref: bottomRef, inView } = useInView({ threshold: 0 });
    const currentUser = session?.user;

    const isManage = type === 'manage-group-posts';
    const isCurrentUser =
        currentUser?.id === userId || currentUser?.username === username;
    const shouldShowCreatePost = useMemo(
        () =>
            !isManage &&
            ((type === 'new-feed' && currentUser) ||
                (type === 'profile' && isCurrentUser) ||
                (type === 'group' && currentUser && groupId)),
        [isManage, type, currentUser, isCurrentUser, groupId]
    );

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage().catch(() =>
                toast.error('Có lỗi xảy ra khi tải bài viết')
            );
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const renderLoader = () => {
        if (isLoading || isFetchingNextPage) {
            return (
                <div>
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                </div>
            );
        }

        if (isFetching) {
            return (
                <div className="flex justify-center py-10">
                    <Icons.Loading className="text-4xl" />
                </div>
            );
        }

        return null;
    };

    const renderEmptyState = () => {
        if (!data?.length && !isLoading && !isFetching) {
            const messages = {
                'new-feed': 'Bạn đã đọc hết bài của ngày hôm nay',
                'new-feed-group': 'Bạn đã đọc hết bài của ngày hôm nay',
                profile: 'Chưa có bài viết nào',
                group: 'Chưa có bài viết nào',
                'manage-group-posts': 'Không có bài viết để quản lý',
            };

            return (
                <div className="pb-10 text-center">
                    {messages[type] || 'Không có dữ liệu'}
                </div>
            );
        }
        return null;
    };

    const renderCreatePost = () => {
        if (!shouldShowCreatePost) return null;

        return type === 'group' ? (
            <CreatePost groupId={groupId!} type="group" />
        ) : (
            <CreatePost />
        );
    };

    return (
        <div className={cn(className, 'relative w-full')}>
            {/* Header section */}
            {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

            {/* Refresh button for management view */}
            {isManage && (
                <Button
                    onClick={() => refetch()}
                    className="mb-2"
                    variant="primary"
                    size={'sm'}
                >
                    Tải mới
                </Button>
            )}

            {/* Post creation form */}
            {renderCreatePost()}

            {/* Posts list */}
            {data?.map((post) => (
                <Post data={post} key={post._id} isManage={isManage} />
            ))}

            {/* Infinite scroll trigger */}
            <div ref={bottomRef} aria-hidden="true" />

            {/* Loading states */}
            {renderLoader()}

            {/* Empty states */}
            {renderEmptyState()}
        </div>
    );
};

export default React.memo(InfinityPostComponent);
