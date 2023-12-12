'use client';
import usePostContext from '@/hooks/usePostContext';
import {
    fetchReplyComments,
    fetchReplyCommentsCount,
} from '@/lib/actions/post.action';
import { FC, useEffect, useMemo, useState } from 'react';

import { Button } from '..';
import Comment from './Comment';

interface CommentPostProps {
    commentParent: Comment;
    commentsHasShow: Comment[];
}

const ReplyComments: FC<CommentPostProps> = ({
    commentParent,
    commentsHasShow,
}) => {
    const { comments, setComments } = usePostContext();
    const commentsReply = useMemo(
        () => comments.filter((cmt) => cmt.parent_id === commentParent._id),
        [comments, commentParent._id]
    );
    const [countAllReplyComments, setCountAllReplyComments] =
        useState<number>(0);

    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        (async () => {
            const replyComments = await fetchReplyComments({
                commentId: commentParent._id,
                commentsHasShow: commentsHasShow,
                page: page,
            });

            if (replyComments) {
                setComments((prev) => [...prev, ...replyComments]);
            }
        })();
    }, [commentParent._id, commentsHasShow, page, setComments]);

    useEffect(() => {
        (async () => {
            const count = await fetchReplyCommentsCount({
                commentId: commentParent._id,
                commentsHasShow: commentsHasShow,
            });

            if (count) {
                setCountAllReplyComments(count);
            }
        })();
    }, [commentParent._id, commentsHasShow]);

    return (
        <>
            {commentsReply.length > 0 && (
                <div className="border-l-2 pl-2 py-1 mt-2 rounded-xl ">
                    {commentsReply.map((cmt) => {
                        return <Comment key={cmt._id} data={cmt} />;
                    })}
                </div>
            )}

            {countAllReplyComments > commentsReply.length && (
                <Button
                    variant={'text'}
                    size={'tiny'}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Xem thêm {countAllReplyComments - commentsReply.length} phản
                    hồi
                </Button>
            )}
        </>
    );
};

export default ReplyComments;
