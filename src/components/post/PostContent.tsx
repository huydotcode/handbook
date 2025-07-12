'use client';
import PhotoGrid from '@/components/post/PhotoGrid';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import VideoPlayer from '../ui/VideoPlayer';

interface Props {
    post: IPost;
}

const PostContent = ({ post }: Props) => {
    const [contentLength, setContentLength] = useState(post.text.length);

    const content = post.text.slice(0, contentLength).replace(/\n/g, '<br/>');
    const images = post.media.filter((m) => m.resourceType === 'image');
    const videos = post.media.filter((m) => m.resourceType === 'video');

    return (
        <div className="post-content my-2">
            <div
                className="post-content text-sm"
                dangerouslySetInnerHTML={{
                    __html: content || '',
                }}
            />
            {post.text.length > 100 && (
                <Button
                    className="mt-1 h-fit p-0 text-xs text-secondary-1 hover:underline"
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

            {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-secondary-1">Tags:</span>

                    {post.tags.map((tag) => (
                        <span key={tag} className="text-sm text-primary-2">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {images.length > 0 && <PhotoGrid images={images} />}

            {videos.length > 0 && (
                <div className="mt-3">
                    {videos.map((video) => (
                        <VideoPlayer src={video.url} key={video._id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostContent;
