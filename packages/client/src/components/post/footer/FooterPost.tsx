'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { PostParams } from '../InfinityPostComponent';
import CommentSection from './CommentSection';
import ReactionPost from './ReactionPost';
import SharePost from './SharePost';

interface Props {
    post: IPost;
    params: PostParams;
}

const FooterPost: React.FC<Props> = ({ post, params }) => {
    const [commentCount, setCommentCount] = useState<number>(
        post.commentsCount || 0
    );
    const [showCommentSection, setShowCommentSection] =
        useState<boolean>(false);

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
                        <span className="text-md ml-1">
                            {commentCount < 0 ? 0 : commentCount}
                        </span>
                    </div>
                </div>

                <div
                    className={cn(
                        'mt-1 grid grid-cols-3 border-y py-1 dark:border-dark-secondary-2',
                        {
                            'border-b-0 border-t': !showCommentSection,
                        }
                    )}
                >
                    <ReactionPost post={post} />

                    <Button
                        className="like-container mr-2 flex flex-1 items-center md:p-1"
                        variant={'ghost'}
                        onClick={() => setShowCommentSection(true)}
                    >
                        <div className="con-like">
                            <input
                                className="like"
                                type="checkbox"
                                title="like"
                                onChange={() => {}}
                            />
                            <div className="checkmark flex">
                                {/* <Icons.Heart /> */}
                                <Icons.Comment />
                            </div>
                        </div>

                        <span className="ml-1 mr-2 min-w-[10px] text-sm sm:hidden">
                            Bình luận
                        </span>
                    </Button>

                    <SharePost post={post} />
                </div>

                {showCommentSection && (
                    <CommentSection
                        post={post}
                        setCommentCount={setCommentCount}
                    />
                )}
            </div>
        </>
    );
};

export default FooterPost;
