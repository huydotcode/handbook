import React from 'react';
import Button from '../ui/Button';
import PhotoGrid from './PhotoGrid';
import usePostContext from '@/hooks/usePostContext';

const PostContent = () => {
    const { post } = usePostContext();
    const [contentLength, setContentLength] = React.useState<number>(100);

    const content = React.useMemo(() => {
        return post?.content.slice(0, contentLength).replace(/\n/g, '<br/>');
    }, [post, contentLength]);

    return (
        <main className="mt-4 mb-2 bg-transparent">
            <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                    __html: content,
                }}
            />

            {post?.content.length > 100 && (
                <Button
                    className="mt-1 text-xs hover:underline text-secondary"
                    variant={'custom'}
                    size={'none'}
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
