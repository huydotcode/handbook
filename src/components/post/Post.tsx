'use client';
import PostProvider from '@/context/PostContext';
import FooterPost from './FooterPost';
import HeaderPost from './HeaderPost';
import PostContent from './PostContent';
import React from 'react';

interface Props {
    data: Post;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const Post: React.FC<Props> = ({ data: post }) => {
    return (
        <PostProvider post={post}>
            <div className="relative my-4 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <HeaderPost />
                <PostContent />
                <FooterPost />
            </div>
        </PostProvider>
    );
};

{
    /* <div className="relative flex border-b-2 dark:border-gray-700 py-2 w-full">
                    <ReactionPost session={session} post={post} />

                    <Button
                        className="dark:text-white"
                        href={`/post/${post._id}`}
                    >
                        <FaRegComment className="ml-2 text-2xl" />
                        <span className="ml-1 text-md">
                            {post.commentCount}
                        </span>
                    </Button>
                </div>

                <div className="flex items-center mt-2">
                    <Button
                        className="text-xs text-gray-500 hover:underline"
                        onClick={handleClickComment}
                    >
                        Viết bình luận
                    </Button>

                    {post.commentCount > 0 && (
                        <Button
                            href={`/post/${post._id}`}
                            className="ml-2 text-xs text-gray-500 hover:underline"
                        >
                            Xem bình luận
                        </Button>
                    )}
                </div> */
}

export default Post;
