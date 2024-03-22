'use client';
import { CommentSection, ReactionPost } from '@/components/post';
import { Icons } from '@/components/ui';
import { usePost } from '@/context';
import { useSession } from 'next-auth/react';

const FooterPost = () => {
    const { data: session } = useSession();
    const { post, countAllComments } = usePost();

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full border-b-2 py-2 ">
                    <ReactionPost session={session} post={post} />

                    <Icons.Comment className="text-xl " />
                    <span className="text-md ml-1">{countAllComments}</span>
                </div>

                <CommentSection postId={post._id} />
            </div>
        </>
    );
};

export default FooterPost;
