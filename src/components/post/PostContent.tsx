import { usePost } from '@/context';
import React from 'react';
import Button from '../ui/Button';
import PhotoGrid from './PhotoGrid';

const PostContent = () => {
    const { post } = usePost();
    const [contentLength, setContentLength] = React.useState<number>(100);

    const content = React.useMemo(() => {
        return post?.text.slice(0, contentLength).replace(/\n/g, '<br/>');
    }, [post, contentLength]);

    return (
        <main className="mb-2 mt-4 ">
            <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                    __html: content,
                }}
            />

            {post?.text.length > 100 && (
                <Button
                    className="mt-1 p-0 text-xs hover:underline"
                    variant={'custom'}
                    onClick={() => {
                        const newLength =
                            contentLength === 100 ? post.text.length : 100;
                        setContentLength(newLength);
                    }}
                >
                    {post?.text.length > 100 &&
                        contentLength != post.text.length &&
                        'Xem thêm'}
                    {contentLength === post.text.length && 'Ẩn bớt'}
                </Button>
            )}

            {post.images.length > 0 && <PhotoGrid images={post.images} />}
        </main>
    );
};
export default PostContent;
