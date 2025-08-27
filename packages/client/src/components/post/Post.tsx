'use client';
import PhotoGrid from '@/components/post/PhotoGrid';
import ReviewPost from '@/components/post/ReviewPost';
import SkeletonPost from '@/components/post/SkeletonPost';
import { Button } from '@/components/ui/Button';
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';
import { FooterPost } from '.';
import VideoPlayer from '../ui/VideoPlayer';
import PostHeader from './PostHeader';
import { PostParams, PostType } from './InfinityPostComponent';

interface Props {
    data: IPost;
    isManage?: boolean;
    params?: PostParams;
}

const PostContext = createContext<{
    postParams: PostParams;
}>({
    postParams: {
        userId: '',
        groupId: '',
        username: '',
        type: 'new-feed',
    },
});

export const usePostContext = () => useContext(PostContext);

const Post: React.FC<Props> = React.memo(
    ({ data: post, isManage = false, params }) => {
        const pathname = usePathname();
        const { data: session } = useSession();

        const showInPrivate =
            post &&
            post.option === 'private' &&
            pathname == `/profile/${post.author._id}` &&
            session?.user?.id == post.author._id;

        if (!post) return <SkeletonPost />;
        if (post.option == 'private' && !showInPrivate) return null;

        return (
            <PostContext.Provider value={{ postParams: params || {} }}>
                <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                    <PostHeader post={post} />
                    <PostContent post={post} />
                    {!isManage && (
                        <FooterPost post={post} params={params || {}} />
                    )}
                    {isManage && <ReviewPost post={post} />}
                </div>
            </PostContext.Provider>
        );
    }
);

const PostContent = ({ post }: { post: IPost }) => {
    const [contentLength, setContentLength] = useState(post.text.length);

    const content = post.text.slice(0, contentLength).replace(/\n/g, '<br/>');
    const images = post.media.filter((m) => m.resourceType === 'image');
    const videos = post.media.filter((m) => m.resourceType === 'video');

    return (
        <div className="post-content my-2">
            <div
                className="post-content text-sm"
                dangerouslySetInnerHTML={{
                    __html: content || '',
                }}
            />
            {post.text.length > 100 && (
                <Button
                    className="mt-1 h-fit p-0 text-xs text-secondary-1 hover:underline"
                    variant={'custom'}
                    onClick={() => {
                        const newLength =
                            contentLength === 100 ? post.text.length : 100;
                        setContentLength(newLength);
                    }}
                >
                    {post?.text.length > 100 &&
                        contentLength != post.text.length &&
                        'Xem thêm'}
                    {contentLength === post.text.length && 'Ẩn bớt'}
                </Button>
            )}

            {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-secondary-1">Tags:</span>

                    {post.tags.map((tag) => (
                        <span key={tag} className="text-sm text-primary-2">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {images.length > 0 && <PhotoGrid images={images} />}

            {videos.length > 0 && (
                <div className="mt-3">
                    {videos.map((video) => (
                        <VideoPlayer src={video.url} key={video._id} />
                    ))}
                </div>
            )}
        </div>
    );
};

Post.displayName = 'Post';

export default Post;
