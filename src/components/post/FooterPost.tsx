'use client';
import { CommentSection, ReactionPost } from '@/components/post';
import { Icons } from '@/components/ui';

interface Props {
    post: IPost;
}

const FooterPost: React.FC<Props> = ({ post }) => {
    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full border-b-2 py-2 ">
                    <ReactionPost post={post} />

                    <Icons.Comment className="text-xl " />
                    <span className="text-md ml-1">{post.comments.length}</span>
                </div>

                <CommentSection postId={post._id} />
            </div>
        </>
    );
};

export default FooterPost;
