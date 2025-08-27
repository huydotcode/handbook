import { Button } from '@/components/ui/Button';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostTypes } from './InfinityPostComponent';

interface Props {
    post: IPost;
}

const ReviewPost = ({ post }: Props) => {
    const { invalidateNewFeedPosts, invalidatePost } = useQueryInvalidation();
    const pathname = usePathname();

    const handleAcceptPost = async (accept: boolean) => {
        if (!post) return;

        try {
            await PostService.updateStatus({
                postId: post._id,
                status: accept ? 'active' : 'rejected',
                path: pathname,
            });

            await invalidateNewFeedPosts({
                groupId: post.group?._id,
                type: PostTypes.MANAGE_GROUP_POSTS_PENDING,
            });
            await invalidatePost(post._id);

            toast.success(
                accept ? 'Duyệt bài thành công' : 'Từ chối bài viết thành công'
            );
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
