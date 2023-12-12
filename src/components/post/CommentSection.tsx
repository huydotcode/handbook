import usePostContext from '@/hooks/usePostContext';
import React from 'react';
import Comment from './Comment';
import { Button } from '..';
import { fetchCommentPostId } from '@/lib/actions/post.action';

interface Props {}

const CommentSection: React.FC<Props> = ({}) => {
    const [page, setPage] = React.useState<number>(1);
    const pageSize = 5;

    const {
        comments,
        setComments,
        post,
        countComments,
        countAllParentComments,
    } = usePostContext();

    const isCommentsEmpty = React.useMemo(() => {
        return countComments === 0;
    }, [countComments]);

    const commentsParent = React.useMemo(() => {
        return comments.filter((cmt) => cmt.parent_id == null);
    }, [comments]);

    const isHasLoadMore = React.useMemo(() => {
        return countAllParentComments > commentsParent.length;
    }, [countAllParentComments, commentsParent.length]);

    React.useEffect(() => {
        (async () => {
            const comments = (await fetchCommentPostId({
                page: page,
                pageSize: pageSize,
                postId: post._id,
            })) as Comment[];

            setComments(
                comments.filter(
                    (cmt) => !cmt.isDeleted || cmt.replies.length > 0
                )
            );
        })();
    }, [page, pageSize, post._id, setComments]);

    return (
        <>
            {isCommentsEmpty && (
                <div className="text-center text-xs text-secondary">
                    Không có bình luận nào
                </div>
            )}

            <div className="mt-3">
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
