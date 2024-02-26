'use client';
import React, { useContext, useMemo, useState } from 'react';

const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: IPost;
    children: React.ReactNode;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

interface ICommentState {
    comments: Comment[];
    countAllComments: number;
    countAllParentComments: number;
}

export const usePost = () => {
    return useContext(PostContext) as IPostContext;
};

function PostProvider({ post, setPosts, children }: Props) {
    // State
    const [commentState, setCommentState] = useState<ICommentState>({
        comments: [],
        countAllComments: post.commentCount,
        countAllParentComments: 0,
    });

    const user = useMemo(() => {
        return post.creator;
    }, [post.creator]) as IUser;

    const values = {
        post,
        user,
        commentState,
        setCommentState,
        setPosts,
    };

    return (
        <PostContext.Provider value={values}>{children}</PostContext.Provider>
    );
}

export default PostProvider;
