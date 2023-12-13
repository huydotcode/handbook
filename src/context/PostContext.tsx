'use client';
import { getCountCommentsParent } from '@/lib/actions/post.action';
import React, { useEffect, useMemo, useState } from 'react';

export const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: Post;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    children: React.ReactNode;
}

interface ICommentState {
    comments: Comment[];
    countAllComments: number;
    countAllParentComments: number;
}

function PostProvider({ post, setPosts, children }: Props) {
    // setState for comments
    const [commentState, setCommentState] = useState<ICommentState>({
        comments: [],
        countAllComments: post.commentCount,
        countAllParentComments: post.commentCount,
    });

    const user = useMemo(() => {
        return post.creator;
    }, [post.creator]) as User;

    useEffect(() => {
        (async () => {
            const count = await getCountCommentsParent({ postId: post._id });
            setCommentState((prev) => ({
                ...prev,
                countAllParentComments: count,
            }));
        })();
    }, [post._id]);

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
