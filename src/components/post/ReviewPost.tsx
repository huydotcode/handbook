import { Button } from '@/components/ui/Button';
import React from 'react';
import { updateStatusPost } from '@/lib/actions/post.action';
import toast from 'react-hot-toast';
import { getNewFeedPostsKey, getPostKey } from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

interface Props {
    post: IPost;
}

const ReviewPost = ({ post }: Props) => {
    const queryClient = useQueryClient();
    const pathname = usePathname();

    const handleAcceptPost = async (accept: boolean) => {
        if (!post) return;

        try {
            await updateStatusPost({
                postId: post._id,
                status: accept ? 'active' : 'rejected',
                path: pathname,
            });

            toast.success(
                accept ? 'Duyệt bài thành công' : 'Từ chối bài viết thành công'
            );

            await queryClient.invalidateQueries({
                queryKey: getNewFeedPostsKey(
                    'manage-group-posts',
                    undefined,
                    post.group?._id,
                    undefined
                ),
            });

            await queryClient.invalidateQueries({
                queryKey: getPostKey(post._id),
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    return (
        <div className={'flex w-full justify-center gap-4'}>
            <Button
                className="mt-2"
                variant="primary"
                size={'sm'}
                onClick={() => handleAcceptPost(true)}
            >
                Duyệt bài
            </Button>

            <Button
                className="mt-2"
                variant="secondary"
                size={'sm'}
                onClick={() => handleAcceptPost(false)}
            >
                Từ chối
            </Button>
        </div>
    );
};

export default ReviewPost;
