'use client';
import { Button } from '@/components/ui/Button';
import { Comment } from '..';
import { useReplyComments } from './CommentItem';
import SkeletonComment from './SkeletonComment';

interface Props {
    comment: IComment;
    setCommentCount: React.Dispatch<React.SetStateAction<number>>;
    showReplyComments: boolean;
    setShowReplyComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReplyComments: React.FC<Props> = ({
    comment,
    setCommentCount,
    setShowReplyComments,
    showReplyComments,
}) => {
    const {
        data: replyComments,
        hasNextPage,
        fetchNextPage,
        isLoading: isLoadingReplyComments,
    } = useReplyComments({
        commentId: comment._id,
    });

    return (
        <>
            {(isLoadingReplyComments || !replyComments) &&
            comment.hasReplies ? (
                <div className={'mt-2'}>
                    <SkeletonComment />
                </div>
            ) : (
                <>
                    {replyComments &&
                        replyComments.length > 0 &&
                        !showReplyComments && (
                            <Button
                                className="w-fit"
                                variant={'text'}
                                size={'xs'}
                                onClick={() =>
                                    setShowReplyComments((prev) => !prev)
                                }
                            >
                                Xem {replyComments.length} bình luận
                            </Button>
                        )}

                    {showReplyComments && (
                        <div className="border-l-2 pl-3 dark:border-dark-secondary-2">
                            {replyComments &&
                                replyComments
                                    .sort(
                                        (a, b) =>
                                            new Date(b.createdAt).getTime() -
                                            new Date(a.createdAt).getTime()
                                    )
                                    .map((cmt) => {
                                        return (
                                            <Comment
                                                key={cmt._id}
                                                data={cmt}
                                                setCommentCount={
                                                    setCommentCount
                                                }
                                            />
                                        );
                                    })}

                            {hasNextPage && (
                                <Button
                                    variant={'text'}
                                    size={'xs'}
                                    onClick={() => fetchNextPage()}
                                >
                                    Xem thêm bình luận
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ReplyComments;
