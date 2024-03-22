'use client';
import React, { useContext, useState } from 'react';

export const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: IPost;
    children: React.ReactNode;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

export const usePost = () => useContext(PostContext) as IPostContext;

function PostProvider({ post, setPosts, children }: Props) {
    const [countAllComments, setCountAllComments] = useState<number>(
        post.comments.length
    );

    const values = {
        post,
        setPosts,

        countAllComments,
        setCountAllComments,
    };

    return (
        <PostContext.Provider value={values}>{children}</PostContext.Provider>
    );
}

export default PostProvider;
