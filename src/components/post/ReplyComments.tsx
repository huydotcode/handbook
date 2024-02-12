'use client';
import { Button } from '@/components/ui';
import {
    fetchReplyComments,
    fetchReplyCommentsCount,
} from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { Comment } from '.';

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

const PAGE_SIZE = 5;

const ReplyComments: FC<CommentPostProps> = ({
    commentParent,
    state: replyState,
    setState: setReplyState,
}) => {
    const { data: session } = useSession();
    const [countAllReplyComments, setCountAllReplyComments] =
        useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // Bình luận của người khác
    const commentsReply = useMemo(() => {
        return replyState.data.filter(
            (cmt) => cmt.userInfo.id !== session?.user.id
        );
    }, [replyState.data, session?.user.id]);

    // Bình luận của chính mình
    const ownComment = useMemo(() => {
        return replyState.data.filter(
            (cmt) => cmt.userInfo.id === session?.user.id
        );
    }, [replyState.data, session?.user.id]);

    useEffect(() => {
        (async () => {
            const replyComments = await fetchReplyComments({
                commentId: commentParent._id,
                commentsHasShow: replyState.data,
            });

            if (replyComments.length > 0) {
                setReplyState((prev) => ({
                    ...prev,
                    data: [...prev.data, ...replyComments],
                }));
            }
        })();
    }, [commentParent._id, replyState.data, setReplyState]);

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
                <div className="mt-2 grid gap-2 rounded-bl-xl border-l-2 pl-4 pt-1">
                    {commentsReply.slice(0, page * PAGE_SIZE).map((cmt) => {
                        return <Comment key={cmt._id} data={cmt} />;
                    })}
                </div>
            )}

            {countAllReplyComments >
                commentsReply.slice(0, page * PAGE_SIZE).length +
                    ownComment.length && (
                <Button
                    className="ml-6 w-fit"
                    variant={'text'}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Xem thêm{' '}
                    {countAllReplyComments -
                        commentsReply.slice(0, page * PAGE_SIZE).length +
                        ownComment.length}{' '}
                    phản hồi
                </Button>
            )}
        </>
    );
};

export default ReplyComments;
