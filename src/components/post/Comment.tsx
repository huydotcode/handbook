'use client';
import TimeAgoConverted from '@/utils/timeConvert';
import { FC, useMemo, useState } from 'react';
import { FaReply } from 'react-icons/fa';

import usePostContext from '@/hooks/usePostContext';
import { useSession } from 'next-auth/react';
import Avatar from '../Avatar';
import Button from '../ui/Button';
import InputComment from './InputComment';
import ReplyComments from './ReplyComments';

interface Props {
    data: Comment;
}

const Comment: FC<Props> = ({ data: cmt }) => {
    const { data: session } = useSession();

    const [isSending, setIsSending] = useState<boolean>(false);

    // Người gửi
    const isSender = useMemo(() => {
        return session?.user && session.user.id === cmt.userInfo.id;
    }, [session, cmt.userInfo.id]);

    const [valueInput, setValueInput] = useState<string>('');
    const [showInputReply, setShowInputReply] = useState<boolean>(false);
    const [showReplyComments, setShowReplyComments] = useState<boolean>(false);

    const handleSendCommentReply = async () => {
        // await sendComment({
        //     valueInput,
        //     replyTo: cmt._id,
        //     setIsSending,
        //     setValueInput,
        // });

        setShowInputReply(false);
        setShowReplyComments(true);
    };

    return (
        <>
            <div className="mb-4">
                <div className="flex justify-between">
                    {cmt.delete ? (
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
                                    __html: cmt.delete
                                        ? "<h5 style='color:gray'>Bình luận đã bị xóa</h5>"
                                        : cmt.content,
                                }}
                            ></div>
                        </div>

                        {!cmt.delete && (
                            <div className="mt-2 flex items-center h-4">
                                {/* Trả lời */}
                                <Button
                                    className="mr-2"
                                    variant={'text'}
                                    size={'tiny'}
                                    onClick={() =>
                                        setShowInputReply((prev) => !prev)
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
                                        onClick={() => {
                                            // deleteComment(cmt._id);
                                        }}
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
                        {session?.user && showInputReply && (
                            <div className="relative flex mt-2">
                                <Avatar session={session} />

                                <div className="ml-2 w-full flex flex-col">
                                    <InputComment
                                        isSending={isSending}
                                        sendComment={handleSendCommentReply}
                                        setValueInput={setValueInput}
                                        valueInput={valueInput}
                                        autoFocus
                                    />

                                    <Button
                                        className="w-8 rounded-t-md"
                                        variant={'custom'}
                                        size={'small'}
                                        onClick={() => setShowInputReply(false)}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Button show reply */}
                        {!showReplyComments && cmt.replies.length > 0 && (
                            <Button
                                className="justify-start mt-2 ml-2 "
                                variant={'text'}
                                size={'tiny'}
                                onClick={() =>
                                    setShowReplyComments((prev) => !prev)
                                }
                            >
                                <FaReply className="rotate-180" />{' '}
                                <span className="ml-2">
                                    {showReplyComments
                                        ? 'Ẩn các phản hồi'
                                        : 'Xem tất cả phản hồi'}
                                </span>
                            </Button>
                        )}

                        {/* Reply comments */}
                        {showReplyComments && (
                            <ReplyComments commentParent={cmt} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comment;
