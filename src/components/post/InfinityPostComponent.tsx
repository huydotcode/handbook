'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { CreatePost, Post, SkeletonPost } from '.';
import { InfinityScrollComponent } from '../shared';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: 'home' | 'profile' | 'group';
    title?: string;
}

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
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const [posts, setPosts] = useState<IPost[]>([]);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    const renderCreatePost = useCallback(() => {
        const isCurrentUser =
            session?.user?.id === userId || session?.user.username === username;
        const isGroupPage = type === 'group';
        const isProfilePage = type === 'profile';
        const currentUser = session?.user;

        if (
            (type === 'home' && currentUser) ||
            (isProfilePage && isCurrentUser)
        ) {
            return <CreatePost setPosts={setPosts} />;
        }

        if (isGroupPage && currentUser && groupId) {
            return (
                <CreatePost
                    setPosts={setPosts}
                    groupId={groupId}
                    type="group"
                />
            );
        }

        return null;
    }, [session, userId, username, type, groupId]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/posts?page=${page}&pageSize=${PAGE_SIZE}&groupId=${groupId}&userId=${userId}&username=${username}&type=${type}`
            );
            const fetchedPosts = await res.json();

            if (fetchedPosts.length === 0) {
                setIsEnd(true);
            }
            setPosts((prev) => [...prev, ...fetchedPosts]);
        } catch (error: any) {
            logger({
                message: 'Error fetch posts' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi tải các bài đăng!');
        } finally {
            setLoading(false);
        }
    }, [page, userId, username, groupId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            <div className={cn(className, 'w-full')}>
                {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

                {renderCreatePost()}

                <InfinityScrollComponent
                    Loader={SkeletonPost}
                    fetchMore={() => setPage((prev) => prev + 1)}
                    hasMore={!isEnd}
                    pageSize={PAGE_SIZE}
                    endMessage={
                        posts.length === 0
                            ? 'Không có bài viết nào'
                            : 'Đã hết bài đăng!'
                    }
                    type="post"
                    loading={loading}
                >
                    <>
                        {posts.map((post) => (
                            <Post
                                key={post?._id}
                                data={post}
                                setPosts={setPosts}
                            />
                        ))}
                    </>
                </InfinityScrollComponent>
            </div>
        </>
    );
};
export default InfinityPostComponent;
