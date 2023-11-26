'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { IoReloadOutline } from 'react-icons/io5';
import InfinityScrollComponent from 'react-infinite-scroll-component';
import CreatePost from './post/CreatePost';
import Post from './post/Post';
import SkeletonPost from './post/SkeletonPost';
import Button from './ui/Button';
import toast from 'react-hot-toast';

interface Props {
    userId?: string;
    username?: string;
}

const NewsFeedPost: React.FC<Props> = ({ userId, username }) => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const pageSize = 3;

    const fetchPosts = useCallback(async () => {
        setLoading(true);

        try {
            const path = `/api/posts/news-feed/query?userId=${
                userId || ''
            }&username=${username || ''}&page=${page}&pageSize=${pageSize}`;

            const res = await fetch(path);
            const data = await res.json();

            setPosts((prev) => [...prev, ...data]);
        } catch (error: any) {
            console.log('Error', error);
            toast.error('Đã có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, userId, username]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <>
            {session?.user && userId && session?.user.id === userId && (
                <CreatePost setPosts={setPosts} />
            )}

            {session?.user && !userId && <CreatePost setPosts={setPosts} />}

            {posts.length === 0 && loading && (
                <>
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                </>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center">
                    <h5>Không có bài viết nào</h5>
                </div>
            )}

            <InfinityScrollComponent
                dataLength={posts.length}
                hasMore={posts.length / pageSize == page}
                className="min-h-[150vh] no-scrollbar"
                loader={<SkeletonPost />}
                next={() => setPage((prev) => prev + 1)}
                scrollThreshold={0}
                endMessage={
                    <>
                        {!loading && (
                            <div className="flex flex-wrap justify-center items-center text-center pb-10">
                                {!userId && (
                                    <h5>Bạn đã đọc hết bài viết hôm nay</h5>
                                )}
                                <Button
                                    className="ml-2 hover:animate-spin"
                                    variant={'text'}
                                    size={'medium'}
                                    href="/"
                                >
                                    <IoReloadOutline />
                                </Button>
                            </div>
                        )}
                    </>
                }
            >
                {posts.map((post) => {
                    return (
                        <Post key={post._id} data={post} setPosts={setPosts} />
                    );
                })}
            </InfinityScrollComponent>
        </>
    );
};
export default NewsFeedPost;
