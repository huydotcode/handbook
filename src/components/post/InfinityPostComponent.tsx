'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { CreatePost, Post, SkeletonPost } from '.';
import { InfinityScrollComponent } from '../shared';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: 'home' | 'profile' | 'group';
}

const PAGE_SIZE = 3;

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'home',
}) => {
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const [posts, setPosts] = useState<IPost[]>([]);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    const renderCreatePost = () => {
        const isCurrentUser =
            session?.user?.id === userId || session?.user.username === username;
        const isGroupPage = type === 'group';
        const isProfilePage = type === 'profile';

        const currentUser = session?.user;

        // Kiểm tra nếu là trang "/" thì render ra CreatePost
        if (type === 'home' && currentUser) {
            return <CreatePost setPosts={setPosts} />;
        }

        // Kiểm tra nếu là trang profile và là trang của chính mình thì render ra CreatePost
        if (isProfilePage && isCurrentUser) {
            return <CreatePost setPosts={setPosts} />;
        }

        // Kiểm tra nếu là trang group và là thành viên của nhóm thì render ra CreatePost
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
    };

    const fetchPosts = useCallback(async () => {
        setLoading(true);

        try {
            const res = await fetch(
                `/api/posts?page=${page}&pageSize=${PAGE_SIZE}&groupId=${groupId}&userId=${userId}&username=${username}`
            );
            const posts = await res.json();

            if (posts.length === 0) {
                setIsEnd(true);
                setLoading(false);
                return;
            }
            setPosts((prev) => [...prev, ...posts]);

            if (posts.length < PAGE_SIZE) {
                setIsEnd(true);
                setLoading(false);
            }
        } catch (error: any) {
            console.log('error fetchPosts', error);
            toast.error('Đã có lỗi xảy ra khi tải các bài đăng!');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            <div
                className={cn(
                    'mx-auto w-135 max-w-full lg:w-120 md:w-full',
                    className
                )}
            >
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
