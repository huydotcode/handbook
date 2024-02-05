import { getPostsOfGroup } from '@/lib/actions/group.action';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Post } from '..';

interface Props {
    groupId: string;
}

const PostsGroup: React.FC<Props> = ({ groupId }) => {
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        (async () => {
            const posts = await getPostsOfGroup({ groupId: groupId });

            if (!posts.success) {
                toast.error(posts.msg);
            } else {
                const newPosts = posts.data as IPost[];
                setPosts(newPosts);
            }
        })();
    }, [groupId]);

    return (
        <>
            {posts.map((post) => {
                return <Post key={post._id} data={post} setPosts={setPosts} />;
            })}
        </>
    );
};
export default PostsGroup;
