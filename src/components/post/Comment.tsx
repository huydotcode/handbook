'use client';
import TimeAgoConverted from '@/utils/timeConvert';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { FaReply } from 'react-icons/fa';

import usePostContext from '@/hooks/usePostContext';
import { deleteComment, sendComment } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineLoading } from 'react-icons/ai';
import { BsFillSendFill } from 'react-icons/bs';
import { InputComment } from '.';
import Avatar from '../Avatar';
import Button from '../ui/Button';
import ReplyComments from './ReplyComments';
import { set } from 'mongoose';

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

    const { setCommentState } = usePostContext();

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

                    <div className="flex flex-col flex-1 max-w-[calc(100%-32px)] ml-2">
                        {/* Content */}
                        <div className="relative w-fit">
                            <div
                                className="bg-light-100 w-fit px-4 py-1 text-sm rounded-md break-all dark:bg-dark-500 dark:text-primary"
                                dangerouslySetInnerHTML={{
                                    __html: commentIsDeleted
                                        ? "<h5 style='color:gray'>Bình luận đã bị xóa</h5>"
                                        : cmt.content,
                                }}
                            ></div>
                        </div>

                        {!commentIsDeleted && (
                            <div className="mt-2 flex items-center h-4">
                                {/* Trả lời */}
                                <Button
                                    className="mr-2"
                                    variant={'text'}
                                    size={'tiny'}
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
                                        size={'tiny'}
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
                            <div className="relative flex mt-2">
                                <Avatar session={session} />

                                <div className="ml-2 w-full flex flex-col">
                                    <form
                                        ref={formRef}
                                        className="flex w-full"
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
                                            className="bg-secondary w-10 right-0 rounded-r-xl hover:bg-light-100 hover:cursor-pointer px-3 z-10 border-l-2 dark:bg-dark-500 dark:hover:bg-neutral-500"
                                            variant={'custom'}
                                            size={'none'}
                                            type="submit"
                                        >
                                            {formState.isSubmitting ? (
                                                <AiOutlineLoading className="animate-spin" />
                                            ) : (
                                                <BsFillSendFill />
                                            )}
                                        </Button>
                                    </form>

                                    <Button
                                        className="w-8 rounded-t-md"
                                        variant={'custom'}
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
                            <div className="grid gap-2 border-l-2 pl-4 py-1 mt-2 rounded-bl-xl ">
                                {ownComment.map((cmt) => {
                                    return <Comment key={cmt._id} data={cmt} />;
                                })}
                            </div>
                        )}

                        {/* Button show reply */}
                        {!replyCommentState.showReplyComments &&
                            cmt.replies.length > 0 && (
                                <Button
                                    className="justify-start mt-2 ml-2 "
                                    variant={'text'}
                                    size={'tiny'}
                                    onClick={() =>
                                        setReplyCommentState((prev) => ({
                                            ...prev,
                                            showReplyComments:
                                                !prev.showReplyComments,
                                        }))
                                    }
                                >
                                    <FaReply className="rotate-180" />{' '}
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
