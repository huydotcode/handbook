'use client';
import { useEffect, useMemo, useState } from 'react';

import { FaRegComment } from 'react-icons/fa';
import Avatar from '../Avatar';
import Comment from './Comment';
import InputComment from './InputComment';
import ReactionPost from './ReactionPost';

import usePostContext from '@/hooks/usePostContext';
import { useSession } from 'next-auth/react';
import Button from '../ui/Button';
import { fetchCommentPostId } from '@/lib/actions/post.action';
import { usePathname } from 'next/navigation';

const FooterPost = () => {
    const { data: session } = useSession();
    const path = usePathname();
    const { comments, setComments, post, countComments, sendComment } =
        usePostContext();

    const [valueInput, setValueInput] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const pageSize = 5;

    const commentsToRender = useMemo(() => {
        return comments.filter(
            (cmt) => cmt.delete == false && cmt.parentCommentId == null
        );
    }, [comments]);

    useEffect(() => {
        (async () => {
            const comments = await fetchCommentPostId({
                page: page,
                pageSize: pageSize,
                path: path,
                postId: post._id,
            });

            setComments((prev) => [...prev, ...comments]);
        })();
    }, [page, pageSize, post._id, setComments, path]);

    const handleSendComment = async () => {
        if (isSending) return;

        const createdComment = await sendComment({
            valueInput,
            replyTo: null,
            setIsSending,
            setValueInput,
        });

        if (createdComment) {
            setComments((prev) => [createdComment, ...prev]);
        }
    };

    return (
        <>
            <div className="mt-2">
                <div className="relative flex border-b-2 dark:border-gray-700 py-2 w-full">
                    <ReactionPost session={session} post={post} />

                    <FaRegComment className="ml-2 text-2xl" />
                    <span className="ml-1 text-md">{comments.length}</span>
                </div>

                {session?.user ? (
                    <div className="flex items-center mt-2 mb-2">
                        <Avatar session={session} />

                        <div className="flex-1 ml-2">
                            <InputComment
                                isSending={isSending}
                                valueInput={valueInput}
                                sendComment={handleSendComment}
                                setValueInput={setValueInput}
                            />
                        </div>
                    </div>
                ) : (
                    <Button
                        className="justify-start my-2 text-sm text-secondary"
                        variant={'text'}
                        size={'tiny'}
                        href="/login"
                    >
                        Bạn cần đăng nhập để viết bình luận
                    </Button>
                )}

                {/* Comments */}
                <div>
                    {countComments === 0 && (
                        <div className="text-center text-xs text-secondary">
                            Không có bình luận nào
                        </div>
                    )}

                    <>
                        <div className="mt-3">
                            {commentsToRender.map((cmt) => (
                                <Comment data={cmt} key={cmt._id} />
                            ))}
                        </div>

                        {countComments > comments.length && (
                            <Button
                                variant={'text'}
                                size={'tiny'}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Xem thêm bình luận
                            </Button>
                        )}
                    </>
                </div>
            </div>
        </>
    );
};

export default FooterPost;
