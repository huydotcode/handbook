'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import CommentService from '@/lib/services/comment.service';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputComment from './InputComment';
import Comment from './Comment';
import { usePost } from '@/context';

interface Props {
    postId: string;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 5;

const CommentSection: React.FC<Props> = ({ postId }) => {
    const { data: session } = useSession();
    const { post, setCountAllComments } = usePost();

    const {
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    // Bình luận
    const [comments, setComments] = useState<IComment[]>(post.comments);
    const [page, setPage] = useState<number>(1);
    const [isHasLoadMore, setIsHasLoadMore] = useState<boolean>(
        post.comments.length > 0
    );

    // Gửi bình luận
    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        if (!session?.user.id || isSubmitting) return;

        try {
            const newComment = await CommentService.sendComment({
                content: data.text,
                replyTo: null,
                postId: postId,
            });

            if (newComment) {
                setComments((prev) => [newComment, ...prev]);
                setCountAllComments((prev) => prev + 1);
            }
        } catch (error: any) {
            console.log('error send comment', error);
            throw new Error(error);
        } finally {
            formRef.current?.reset();
        }
    };

    useEffect(() => {
        (async () => {
            const comments = (await CommentService.getCommentsByPostId({
                page,
                pageSize: PAGE_SIZE,
                postId,
            })) as IComment[];

            if (comments.length > 0) {
                setComments((prev) => [...prev, ...comments]);
            }

            if (comments.length < PAGE_SIZE) {
                setIsHasLoadMore(false);
            }
        })();
    }, [page, postId]);

    return (
        <>
            {/* Form viết bình luận */}
            {session?.user ? (
                <div className="mb-2 mt-2 flex items-center">
                    <Avatar session={session} />

                    <div className="ml-2 flex-1">
                        <form
                            className="flex w-full overflow-hidden rounded-xl bg-primary-1 dark:bg-dark-secondary-2"
                            onSubmit={handleSubmit(onSubmitComment)}
                            ref={formRef}
                        >
                            <InputComment
                                register={register}
                                placeholder="Viết bình luận..."
                                formRef={formRef}
                            />

                            <Button
                                className="right-0 w-10 rounded-r-xl border-l-2 px-3 hover:cursor-pointer hover:bg-hover-1 dark:hover:bg-dark-hover-2"
                                variant={'custom'}
                                type="submit"
                            >
                                {isSubmitting ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Send className="text-xl" />
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            ) : (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                    href="/login"
                >
                    Bạn cần đăng nhập để viết bình luận
                </Button>
            )}

            {/* Không có bình luận nào */}
            {comments.length === 0 && (
                <div className="text-center text-xs text-secondary-1">
                    Không có bình luận nào
                </div>
            )}

            {/* Comments */}
            <div className="mt-3 grid gap-2">
                {comments.map((comment) => (
                    <Comment data={comment} key={comment._id} />
                ))}
            </div>

            {/* Tải thêm */}
            {isHasLoadMore && (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};
export default CommentSection;
