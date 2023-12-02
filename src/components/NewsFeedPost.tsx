'use client';
import { fetchNewFeedPost } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoReloadOutline } from 'react-icons/io5';
import InfinityScrollComponent from 'react-infinite-scroll-component';
import CreatePost from './post/CreatePost';
import Post from './post/Post';
import SkeletonPost from './post/SkeletonPost';
import Button from './ui/Button';

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
    const path = usePathname();

    const fetchPosts = useCallback(async () => {
        setLoading(true);

        try {
            const posts = await fetchNewFeedPost({
                page: page,
                pageSize: pageSize,
                pathname: path,
                userId: userId,
                username: username,
            });

            setPosts((prev) => [...prev, ...posts]);
        } catch (error: any) {
            console.error('Error', error);
            toast.error('Đã có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, userId, username, path]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const renderCreatePost = () =>
        session?.user &&
        (!userId || session?.user.id === userId) && (
            <CreatePost setPosts={setPosts} />
        );

    const renderLoadingSkeletons = () =>
        loading && (
            <>
                {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonPost key={index} />
                ))}
            </>
        );

    const renderEmptyMessage = () =>
        !loading &&
        posts.length === 0 && (
            <div className="text-center">
                <h5>Không có bài viết nào</h5>
            </div>
        );

    const renderEndMessage = () =>
        !loading && (
            <div className="flex flex-wrap justify-center items-center text-center pb-10">
                {!userId && <h5>Bạn đã đọc hết bài viết hôm nay</h5>}
                <Button
                    className="ml-2 hover:animate-spin"
                    variant={'text'}
                    size={'medium'}
                    href="/"
                >
                    <IoReloadOutline />
                </Button>
            </div>
        );

    return (
        <>
            {renderCreatePost()}
            {renderEmptyMessage()}

            <InfinityScrollComponent
                dataLength={posts.length}
                hasMore={posts.length / pageSize === page}
                className="min-h-[150vh] no-scrollbar"
                loader={<SkeletonPost />}
                next={() => setPage((prev) => prev + 1)}
                scrollThreshold={0}
                endMessage={renderEndMessage()}
            >
                {posts.map((post) => (
                    <Post key={post?._id} data={post} setPosts={setPosts} />
                ))}
            </InfinityScrollComponent>

            {renderLoadingSkeletons()}
        </>
    );
};

export default NewsFeedPost;
