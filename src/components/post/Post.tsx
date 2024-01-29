'use client';
import PostProvider from '@/context/PostContext';
import FooterPost from './FooterPost';
import HeaderPost from './HeaderPost';
import PostContent from './PostContent';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Props {
    data: IPost;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const Post: React.FC<Props> = ({ data: post, setPosts }) => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const showInPrivate =
        post.option === 'private' &&
        pathname !== `/profile/${post.creator._id}` &&
        session?.user?.id !== post.creator._id;

    if (showInPrivate) return null;

    return (
        <PostProvider post={post} setPosts={setPosts}>
            <div className="relative my-4 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <HeaderPost />
                <PostContent />
                <FooterPost />
            </div>
        </PostProvider>
    );
};

export default Post;
