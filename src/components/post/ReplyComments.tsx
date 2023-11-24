'use client';
import usePostContext from '@/hooks/usePostContext';
import { FC, useEffect, useMemo } from 'react';
import Comment from './Comment';

interface CommentPostProps {
    commentParent: Comment;
}

const ReplyComments: FC<CommentPostProps> = ({ commentParent }) => {
    const { comments, setComments } = usePostContext();
    const commentsReply = useMemo(
        () =>
            comments.filter((cmt) => cmt.parentCommentId === commentParent._id),
        [comments, commentParent._id]
    );

    useEffect(() => {
        fetch(
            `/api/posts/${commentParent.postId}/comments/${commentParent._id}/reply`
        )
            .then((res) => res.json())
            .then((data: Comment[]) =>
                setComments((prev: Comment[]) => [...prev, ...data])
            );
    }, [commentParent._id, commentParent.postId, setComments]);

    return (
        <>
            {commentsReply.length > 0 && (
                <div className="border-l-2 pl-2 py-1 mt-2 rounded-xl ">
                    {commentsReply.map((cmt) => {
                        return <Comment key={cmt._id} data={cmt} />;
                    })}
                </div>
            )}
        </>
    );
};

export default ReplyComments;
