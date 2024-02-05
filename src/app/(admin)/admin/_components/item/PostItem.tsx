'use client';
import { Avatar, Button, Icons, SlideShow } from '@/components/ui';
import React, { useState } from 'react';
import AdminAction from '../action/AdminAction';

interface Props {
    data: IPost;
}

const PostItem: React.FC<Props> = ({ data }) => {
    const {
        _id,
        commentCount,
        content,
        createdAt,
        creator,
        images,
        loves,
        option,
        shares,
        updatedAt,
    } = data;

    const [showImages, setShowImages] = useState<boolean>(false);

    return (
        <>
            <div className="rounded-xl bg-white p-4 shadow-xl dark:bg-dark-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar imgSrc={creator.image} userUrl={creator._id} />
                        <div className="ml-2">
                            <p className="font-bold">{creator.name}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(createdAt).toISOString()}
                            </p>
                        </div>
                    </div>

                    <AdminAction id={_id} path="/admin/posts" type="post" />
                </div>
                <div className="mt-2">
                    <p className="max-h-[20vh] overflow-scroll">{content}</p>
                </div>
                <div className="mt-2">
                    {images.length > 0 && (
                        <Button
                            className="mb-2 p-0 text-xs hover:underline"
                            onClick={() => setShowImages((prev) => !prev)}
                            variant={'custom'}
                        >
                            {showImages ? 'Ẩn hình ảnh' : 'Hiện hình ảnh'}
                        </Button>
                    )}
                </div>

                <div className="flex items-center">
                    <div className="mr-2 flex items-center text-xs text-gray-400">
                        <Icons.Heart2 className="mr-1" /> {loves.length}
                    </div>
                    <div className="mr-2 flex items-center text-xs text-gray-400">
                        <Icons.Share className="mr-1" /> {shares}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                        <Icons.Comment className="mr-1" /> {commentCount}
                    </div>
                </div>
            </div>

            <SlideShow
                images={images.map((img) => img.url)}
                setShow={setShowImages}
                show={showImages}
            />
        </>
    );
};
export default PostItem;
