'use client';
import { useRef } from 'react';
import { usePost } from '@/context';
import { useSession } from 'next-auth/react';
import { sendComment } from '@/lib/actions/post.action';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Avatar, Button, Icons } from '@/components/ui';
import { ReactionPost, CommentSection, InputComment } from '@/components/post';

type FormData = {
    text: string;
};

const FooterPost = () => {
    const { data: session } = useSession();
    const { post, commentState, setCommentState } = usePost();
    const {
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        if (!session?.user.id || isSubmitting) return;

        try {
            const newComment = await sendComment({
                content: data.text,
                replyTo: null,
                postId: post._id,
                userId: session.user.id,
            });

            if (newComment) {
                setCommentState((prev) => ({
                    ...prev,
                    comments: [newComment, ...prev.comments],
                    countAllComments: prev.countAllComments + 1,
                    countAllParentComments: prev.countAllParentComments + 1,
                }));
            }
        } catch (error: any) {
            throw new Error(error);
        } finally {
            formRef.current?.reset();
        }
    };

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full border-b-2 py-2 dark:border-gray-700">
                    <ReactionPost session={session} post={post} />

                    <Icons.Comment className="text-xl dark:text-gray-400" />
                    <span className="text-md ml-1">
                        {commentState.countAllComments}
                    </span>
                </div>

                {/* Input comment */}
                <>
                    {session?.user ? (
                        <div className="mb-2 mt-2 flex items-center">
                            <Avatar session={session} />

                            <div className="ml-2 flex-1">
                                <form
                                    className="flex w-full"
                                    onSubmit={handleSubmit(onSubmitComment)}
                                    ref={formRef}
                                >
                                    <InputComment
                                        register={register}
                                        placeholder="Viết bình luận..."
                                        formRef={formRef}
                                    />

                                    <Button
                                        className="right-0 w-10 rounded-r-xl border-l-2 bg-secondary px-3 hover:cursor-pointer hover:bg-light-100 dark:bg-dark-500 dark:hover:bg-neutral-500"
                                        variant={'custom'}
                                        size={'none'}
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
                            className="my-2 justify-start text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            variant={'text'}
                            size={'tiny'}
                            href="/login"
                        >
                            Bạn cần đăng nhập để viết bình luận
                        </Button>
                    )}
                </>

                {/* Comments */}
                <CommentSection />
            </div>
        </>
    );
};

export default FooterPost;
