'use client';
import usePostContext from '@/hooks/usePostContext';
import { fetchCommentPostId } from '@/lib/actions/post.action';
import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui';
import Comment from './Comment';

const CommentSection: React.FC = ({}) => {
    const [page, setPage] = React.useState<number>(1);
    const pageSize = 5;

    const {
        commentState: { comments, countAllComments, countAllParentComments },
        setCommentState,
        post,
    } = usePostContext();

    const isCommentsEmpty = useMemo(() => {
        return countAllComments === 0;
    }, [countAllComments]);

    const commentsParent = useMemo(() => {
        return comments.filter((cmt) => cmt.parent_id == null);
    }, [comments]);

    const isHasLoadMore = useMemo(() => {
        return countAllParentComments > commentsParent.length;
    }, [countAllParentComments, commentsParent.length]);

    useEffect(() => {
        (async () => {
            const comments = (await fetchCommentPostId({
                page: page,
                pageSize: pageSize,
                postId: post._id,
            })) as Comment[];

            setCommentState((prev) => ({
                ...prev,
                comments: [
                    ...prev.comments,
                    ...comments.filter(
                        (cmt) => !cmt.isDeleted || cmt.replies.length > 0
                    ),
                ],
            }));
        })();
    }, [page, pageSize, post._id, setCommentState]);

    return (
        <>
            {isCommentsEmpty && (
                <div className="text-center text-xs text-secondary">
                    Không có bình luận nào
                </div>
            )}

            <div className="mt-3 grid gap-2">
                {commentsParent.map((cmt) => (
                    <Comment data={cmt} key={cmt._id} />
                ))}
            </div>

            {isHasLoadMore && (
                <Button
                    variant={'text'}
                    size={'tiny'}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};
export default CommentSection;
