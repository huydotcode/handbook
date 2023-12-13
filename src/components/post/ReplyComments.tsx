'use client';
import usePostContext from '@/hooks/usePostContext';
import {
    fetchReplyComments,
    fetchReplyCommentsCount,
} from '@/lib/actions/post.action';
import { FC, useEffect, useMemo, useState } from 'react';

import { Button } from '..';
import Comment from './Comment';

interface IReplyCommentState {
    data: Comment[];
    countReply: number;
    showInputReply: boolean;
    showReplyComments: boolean;
}

interface CommentPostProps {
    commentParent: Comment;
    state: IReplyCommentState;
    setState: React.Dispatch<React.SetStateAction<IReplyCommentState>>;
}

const ReplyComments: FC<CommentPostProps> = ({
    commentParent,
    state: replyState,
    setState: setReplyState,
}) => {
    const {
        commentState: { comments },
    } = usePostContext();
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
                commentsHasShow: replyState.data,
                page: page,
            });

            if (replyComments.length > 0) {
                setReplyState((prev) => ({
                    ...prev,
                    data: [...prev.data, ...replyComments],
                }));
            }
        })();
    }, [commentParent._id, replyState.data, page, setReplyState]);

    useEffect(() => {
        (async () => {
            const count = await fetchReplyCommentsCount({
                commentId: commentParent._id,
            });

            if (count) {
                setCountAllReplyComments(count);
            }
        })();
    }, [commentParent._id]);

    return (
        <>
            {commentsReply.length > 0 && (
                <div className="border-l-2 pl-2 py-1 mt-2 rounded-xl ">
                    {commentsReply.map((cmt) => {
                        return <Comment key={cmt._id} data={cmt} />;
                    })}
                </div>
            )}

            {countAllReplyComments > replyState.data.length && (
                <Button
                    variant={'text'}
                    size={'tiny'}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Xem thêm {countAllReplyComments - replyState.data.length}{' '}
                    phản hồi
                </Button>
            )}
        </>
    );
};

export default ReplyComments;
