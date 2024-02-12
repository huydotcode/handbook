'use client';
import { fetchNewFeedPost } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CreatePost, Post, SkeletonPost } from '.';
import { InfinityScrollComponent } from '../shared';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
}

const PAGE_SIZE = 3;

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    username,
}) => {
    const { data: session } = useSession();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const [posts, setPosts] = useState<IPost[]>([]);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    const renderCreatePost = () =>
        session?.user &&
        (!userId || session?.user.id === userId) && (
            <CreatePost setPosts={setPosts} />
        );

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const posts = await fetchNewFeedPost({
                page: page,
                pageSize: PAGE_SIZE,
                userId: userId,
                username: username,
                isCurrentUser: session?.user.id === userId,
            });
            if (posts.length === 0) {
                setIsEnd(true);
                return;
            }
            setPosts((prev) => [...prev, ...posts]);
        } catch (error: any) {
            console.error('Error', error);
            toast.error('Đã có lỗi xảy ra khi tải các bài đăng!');
        } finally {
            setLoading(false);
        }
    }, [page, userId, username]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            <div>
                {renderCreatePost()}

                <InfinityScrollComponent
                    Loader={SkeletonPost}
                    fetchMore={() => setPage((prev) => prev + 1)}
                    hasMore={!isEnd}
                    pageSize={PAGE_SIZE}
                    endMessage="Đã hết bài đăng!"
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
