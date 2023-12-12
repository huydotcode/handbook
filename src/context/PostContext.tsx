'use client';
import { getCountCommentsParent } from '@/lib/actions/post.action';
import React, { useEffect, useMemo, useState } from 'react';

export const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: Post;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    children: React.ReactNode;
}

function PostProvider({ post, setPosts, children }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);

    const [countAllParentComments, setCountAllParentComments] =
        useState<number>(
            comments.filter(
                (cmt) =>
                    cmt.parent_id === null &&
                    (!cmt.isDeleted || cmt.replies.length > 0)
            ).length
        );

    const countComments = comments.length;

    const user = useMemo(() => {
        return post.creator;
    }, [post.creator]) as User;

    useEffect(() => {
        (async () => {
            const count = await getCountCommentsParent({ postId: post._id });
            setCountAllParentComments(count);
        })();
    }, [post._id]);

    const values = {
        post,
        user,
        comments,
        setComments,
        countComments,
        setPosts,
        countAllParentComments,
        setCountAllParentComments,
    };

    return (
        <PostContext.Provider value={values}>{children}</PostContext.Provider>
    );
}

export default PostProvider;
