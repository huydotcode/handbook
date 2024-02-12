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
                <div className="relative flex w-full border-b-2 py-2 ">
                    <ReactionPost session={session} post={post} />

                    <Icons.Comment className="text-xl " />
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
                </>

                {/* Comments */}
                <CommentSection />
            </div>
        </>
    );
};

export default FooterPost;
