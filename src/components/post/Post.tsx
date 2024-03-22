'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { PostProvider } from '@/context';
import { FooterPost, HeaderPost, PostContent } from '.';

interface Props {
    data: IPost;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const Post: React.FC<Props> = ({ data: post, setPosts }) => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const showInPrivate =
        post.option === 'private' &&
        pathname !== `/profile/${post.author._id}` &&
        session?.user?.id !== post.author._id;

    if (showInPrivate) return null;

    return (
        <PostProvider post={post} setPosts={setPosts}>
            <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                <HeaderPost />
                <PostContent />
                <FooterPost />
            </div>
        </PostProvider>
    );
};

export default Post;
