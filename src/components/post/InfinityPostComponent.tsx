'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CreatePost, Post, SkeletonPost } from '..';
import toast from 'react-hot-toast';
import { fetchNewFeedPost } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
}

const PAGE_SIZE = 5;

const InfinityPostComponent: React.FC<Props> = ({
    userId,
    username,
    className,
}) => {
    const { data: session } = useSession();

    const [firstRender, setFirstRender] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    const [posts, setPosts] = useState<IPost[]>([]);

    const [isEnd, setIsEnd] = useState<boolean>(false);

    const { ref: bottomRef, inView } = useInView({
        threshold: 0,
    });

    const renderCreatePost = () =>
        session?.user &&
        (!userId || session?.user.id === userId) && (
            <CreatePost setPosts={setPosts} />
        );

    const renderSkeletonPosts = () => {
        return Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <SkeletonPost key={index} />
        ));
    };

    useEffect(() => {
        if (inView) {
            setPage((prev) => prev + 1);
        }
    }, [inView]);

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

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
    }, []);

    return (
        <>
            <div className={'w-[500px] sm:w-screen no-scrollbar ' + className}>
                {renderCreatePost()}

                {firstRender && loading && renderSkeletonPosts()}

                {posts.map((post) => (
                    <Post key={post?._id} data={post} setPosts={setPosts} />
                ))}

                {!firstRender && loading && renderSkeletonPosts()}

                {!isEnd && (
                    <div className="w-full min-h-[100px]" ref={bottomRef} />
                )}

                {isEnd && (
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 pb-10">
                            Không còn bài đăng nào!
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
export default InfinityPostComponent;
