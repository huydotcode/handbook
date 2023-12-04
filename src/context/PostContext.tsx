'use client';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: Post;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    children: React.ReactNode;
}

function PostProvider({ post, setPosts, children }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [countComments, setCountComments] = useState<number>(
        post.commentCount
    );
    const user = post.creator as User;

    const values = {
        post,
        user,
        comments,
        setComments,
        countComments,
        setCountComments,
        setPosts,
    };

    return (
        <PostContext.Provider value={values}>{children}</PostContext.Provider>
    );
}

export default PostProvider;
