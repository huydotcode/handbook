import { usePost } from '@/context';
import React from 'react';
import Button from '../ui/Button';
import PhotoGrid from './PhotoGrid';

const PostContent = () => {
    const { post } = usePost();
    const [contentLength, setContentLength] = React.useState<number>(100);

    const content = React.useMemo(() => {
        return post?.content.slice(0, contentLength).replace(/\n/g, '<br/>');
    }, [post, contentLength]);

    return (
        <main className="mb-2 mt-4 ">
            <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                    __html: content,
                }}
            />

            {post?.content.length > 100 && (
                <Button
                    className="mt-1 p-0 text-xs hover:underline"
                    variant={'custom'}
                    onClick={() => {
                        const newLength =
                            contentLength === 100 ? post.content.length : 100;
                        setContentLength(newLength);
                    }}
                >
                    {post?.content.length > 100 &&
                        contentLength != post.content.length &&
                        'Xem thêm'}
                    {contentLength === post.content.length && 'Ẩn bớt'}
                </Button>
            )}

            {post.images.length > 0 && <PhotoGrid images={post.images} />}
        </main>
    );
};
export default PostContent;
