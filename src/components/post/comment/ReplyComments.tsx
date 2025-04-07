'use client';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Comment } from '..';
import { useReplyComments } from './CommentItem';
import SkeletonComment from './SkeletonComment';

interface Props {
    comment: IComment;
}

const ReplyComments: React.FC<Props> = ({ comment }) => {
    const {
        data: replyComments,
        hasNextPage,
        fetchNextPage,
        isLoading: isLoadingReplyComments,
    } = useReplyComments(comment._id);

    const [showReplyComments, setShowReplyComments] = useState(false);

    return (
        <>
            {isLoadingReplyComments || !replyComments ? (
                <div className={'mt-2'}>
                    <SkeletonComment />
                </div>
            ) : (
                <>
                    {replyComments.length > 0 && !showReplyComments && (
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
                            {replyComments.reverse().map((cmt) => {
                                return <Comment key={cmt._id} data={cmt} />;
                            })}

                            {hasNextPage && (
                                <Button
                                    variant={'text'}
                                    size={'sm'}
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
