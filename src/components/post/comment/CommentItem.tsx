'use client';
import { Avatar } from '@/components/ui';
import React, { useState } from 'react';
import ReplyComment from './ReplyComment';

interface Props {
    data: IComment;
}

const CommentItem: React.FC<Props> = ({ data: comment }) => {
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    if (isDeleted) return null;

    return (
        <div key={comment._id} className="mt-2">
            <div className="flex justify-between">
                <Avatar
                    imgSrc={comment.author.avatar}
                    alt={comment.author.name}
                />

                <div className="ml-2 flex max-w-[calc(100%-32px)] flex-1 flex-col">
                    <div className="relative w-fit">
                        <div
                            className=" w-fit break-all rounded-md bg-primary-1 px-4 py-1 text-sm dark:bg-dark-secondary-2"
                            dangerouslySetInnerHTML={{
                                __html: comment.text,
                            }}
                        ></div>
                    </div>

                    <ReplyComment
                        authorId={comment.author._id}
                        parentId={comment._id}
                        postId={comment.post._id}
                        setIsDeleted={setIsDeleted}
                    />
                </div>
            </div>
        </div>
    );
};
export default CommentItem;
