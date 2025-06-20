'use client';
import { Icons } from '@/components/ui';
import React, { useState } from 'react';
import CommentSection from './CommentSection';
import ReactionPost from './ReactionPost';
import SavePost from './SavePost';
import SharePost from './SharePost';

interface Props {
    post: IPost;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 3;

const FooterPost: React.FC<Props> = ({ post }) => {
    const [loves, setLoves] = useState<string[]>(post.loves.map((l) => l._id));
    const [commentCount, setCommentCount] = useState<number>(
        post.comments_count || 0
    );

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full justify-end gap-2 py-2">
                    <div className="flex items-center">
                        <Icons.Heart2 className="text-xl text-red-400" />
                        <span className="text-md ml-1">{loves.length}</span>
                    </div>

                    <div className="flex items-center">
                        <Icons.Comment className="text-xl" />
                        <span className="text-md ml-1">{commentCount}</span>
                    </div>
                </div>

                <div className="mt-1 grid grid-cols-3 border-y py-1 dark:border-dark-secondary-2">
                    <ReactionPost
                        post={post}
                        loves={loves}
                        setLoves={setLoves}
                    />

                    <SharePost post={post} />

                    <SavePost post={post} />
                </div>

                <CommentSection post={post} setCommentCount={setCommentCount} />
            </div>
        </>
    );
};

export default FooterPost;
