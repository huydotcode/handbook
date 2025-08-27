'use client';
import { Icons } from '@/components/ui';
import React, { useState } from 'react';
import CommentSection from './CommentSection';
import ReactionPost from './ReactionPost';
import SavePost from './SavePost';
import SharePost from './SharePost';
import { PostParams } from '../InfinityPostComponent';

interface Props {
    post: IPost;
    params: PostParams;
}

const FooterPost: React.FC<Props> = ({ post, params }) => {
    const [commentCount, setCommentCount] = useState<number>(
        post.commentsCount || 0
    );

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full justify-end gap-2 py-2">
                    <div className="flex items-center">
                        <Icons.Heart2 className="text-xl text-red-400" />
                        <span className="text-md ml-1">{post.lovesCount}</span>
                    </div>

                    <div className="flex items-center">
                        <Icons.Comment className="text-xl" />
                        <span className="text-md ml-1">{commentCount}</span>
                    </div>
                </div>

                <div className="mt-1 grid grid-cols-3 border-y py-1 dark:border-dark-secondary-2">
                    <ReactionPost post={post} />

                    <SharePost post={post} />

                    <SavePost post={post} />
                </div>

                <CommentSection post={post} setCommentCount={setCommentCount} />
            </div>
        </>
    );
};

export default FooterPost;
