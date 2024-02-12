'use client';
import TimeAgoConverted from '@/utils/timeConvert';
import { FC, useMemo, useRef, useState } from 'react';

import { deleteComment, sendComment } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { InputComment } from '.';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Icons from '../ui/Icons';
import ReplyComments from './ReplyComments';
import { usePost } from '@/context';

interface Props {
    data: Comment;
}

interface IFormData {
    text: string;
}

interface IReplyCommentState {
    data: Comment[];
    countReply: number;
    showInputReply: boolean;
    showReplyComments: boolean;
}

const Comment: FC<Props> = ({ data: cmt }) => {
    const { data: session } = useSession();
    const { register, handleSubmit, formState, reset } = useForm<IFormData>();
    const formRef = useRef<HTMLFormElement>(null);

    const isSender = useMemo(() => {
        return session?.user && session.user.id === cmt.userInfo.id;
    }, [session, cmt.userInfo.id]);

    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const commentIsDeleted = useMemo(() => {
        return cmt.isDeleted || isDeleted;
    }, [cmt.isDeleted, isDeleted]);

    const { setCommentState } = usePost();

    const [replyCommentState, setReplyCommentState] =
        useState<IReplyCommentState>({
            data: [],
            countReply: cmt.replies.length,
            showInputReply: false,
            showReplyComments: false,
        });

    const ownComment = useMemo(() => {
        return replyCommentState.data.filter(
            (cmt) => cmt.userInfo.id === session?.user.id
        );
    }, [replyCommentState.data, session?.user.id]);

    const handleSendCommentReply: SubmitHandler<IFormData> = async (
        formData
    ) => {
        const content = formData.text;
        if (
            !session?.user.id ||
            formState.isSubmitting ||
            content.trim().length === 0 ||
            !replyCommentState.showInputReply
        )
            return;

        const newCmt = await sendComment({
            content: content,
            postId: cmt.postId,
            replyTo: cmt._id,
            userId: session?.user.id,
        });

        if (newCmt) {
            setReplyCommentState((prev) => ({
                ...prev,
                data: [newCmt, ...prev.data],
                countReply: prev.countReply + 1,
            }));
            setCommentState((prev) => ({
                ...prev,
                countAllComments: prev.countAllComments + 1,
            }));
        }

        setReplyCommentState((prev) => ({
            ...prev,
            showInputReply: false,
        }));
        reset();
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment({
                commentId: cmt._id,
            });
        } catch (error: any) {
            toast.error('Đã có lỗi khi xóa bình luận');
        }
        setIsDeleted(true);
    };

    return (
        <>
            <div className="">
                <div className="flex justify-between">
                    {commentIsDeleted ? (
                        <Avatar imgSrc="/assets/img/user-profile.jpg" />
                    ) : (
                        <Avatar
                            userUrl={cmt.userInfo.id}
                            imgSrc={cmt.userInfo.image}
                            alt={cmt.userInfo.name}
                        />
                    )}

                    <div className="ml-2 flex max-w-[calc(100%-32px)] flex-1 flex-col">
                        {/* Content */}
                        <div className="relative w-fit">
                            <div
                                className=" w-fit break-all rounded-md bg-primary-1 px-4 py-1 text-sm dark:bg-dark-secondary-2"
                                dangerouslySetInnerHTML={{
                                    __html: commentIsDeleted
                                        ? "<h5 style='color:gray'>Bình luận đã bị xóa</h5>"
                                        : cmt.content,
                                }}
                            ></div>
                        </div>

                        {!commentIsDeleted && (
                            <div className="mt-2 flex h-4 items-center">
                                {/* Trả lời */}
                                <Button
                                    className="mr-2"
                                    variant={'text'}
                                    size={'small'}
                                    onClick={() =>
                                        setReplyCommentState((prev) => ({
                                            ...prev,
                                            showInputReply:
                                                !prev.showInputReply,
                                        }))
                                    }
                                >
                                    Trả lời
                                </Button>

                                {/* Xóa bình luận */}
                                {isSender && (
                                    <Button
                                        className="mr-2"
                                        variant={'text'}
                                        size={'small'}
                                        onClick={handleDeleteComment}
                                    >
                                        Xóa bình luận
                                    </Button>
                                )}

                                <TimeAgoConverted
                                    className={'text-[10px]'}
                                    time={cmt.createdAt}
                                />
                            </div>
                        )}

                        {/* <Input Comment Reply /> */}
                        {session?.user && replyCommentState.showInputReply && (
                            <div className="relative mt-2 flex">
                                <Avatar session={session} />

                                <div className="ml-2 flex w-full flex-col">
                                    <form
                                        ref={formRef}
                                        className="flex w-full overflow-hidden rounded-xl bg-primary-1 dark:bg-dark-secondary-2"
                                        onSubmit={handleSubmit(
                                            handleSendCommentReply
                                        )}
                                    >
                                        <InputComment
                                            formRef={formRef}
                                            register={register}
                                            placeholder="Viết bình luận..."
                                        />

                                        <Button
                                            className="right-0 z-10 w-10 rounded-r-xl border-l-2 bg-transparent px-3 hover:cursor-pointer hover:bg-hover-1 dark:hover:bg-dark-hover-2"
                                            variant={'custom'}
                                            type="submit"
                                        >
                                            {formState.isSubmitting ? (
                                                <Icons.Loading className="animate-spin" />
                                            ) : (
                                                <Icons.Send />
                                            )}
                                        </Button>
                                    </form>

                                    <Button
                                        className="w-8 rounded-t-md"
                                        variant={'text'}
                                        size={'small'}
                                        onClick={() => {
                                            setReplyCommentState((prev) => ({
                                                ...prev,
                                                showInputReply:
                                                    !prev.showInputReply,
                                            }));
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        )}

                        {ownComment.length > 0 && (
                            <div className="mt-2 grid gap-2 rounded-bl-xl border-l-2 py-1 pl-4 ">
                                {ownComment.map((cmt) => {
                                    return <Comment key={cmt._id} data={cmt} />;
                                })}
                            </div>
                        )}

                        {/* Button show reply */}
                        {!replyCommentState.showReplyComments &&
                            cmt.replies.length > 0 && (
                                <Button
                                    className="ml-2 mt-2 justify-start "
                                    variant={'text'}
                                    onClick={() =>
                                        setReplyCommentState((prev) => ({
                                            ...prev,
                                            showReplyComments:
                                                !prev.showReplyComments,
                                        }))
                                    }
                                >
                                    <Icons.Reply className="rotate-180" />{' '}
                                    <span className="ml-2">
                                        {replyCommentState.showReplyComments
                                            ? 'Ẩn các phản hồi'
                                            : 'Xem tất cả phản hồi'}
                                    </span>
                                </Button>
                            )}

                        {/* Reply comments */}
                        {replyCommentState.showReplyComments && (
                            <ReplyComments
                                commentParent={cmt}
                                state={replyCommentState}
                                setState={setReplyCommentState}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comment;
