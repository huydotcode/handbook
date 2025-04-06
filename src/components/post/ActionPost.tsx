'use client';
import React, { useState } from 'react';
import Icons from '../ui/Icons';
import DeletePostModal from './action/DeletePostModal';
import EditPostModal from './action/EditPostModal';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';

interface Props {
    post: IPost;
}

const ActionPost: React.FC<Props> = ({ post }) => {
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className=" shadow-none"
                        variant={'ghost'}
                        size={'sm'}
                    >
                        <Icons.More className="text-3xl" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={'w-[250px] px-2'}
                    asChild
                    align={'end'}
                >
                    <div className="relative flex flex-col overflow-hidden">
                        <Button
                            className="w-full justify-start rounded-sm shadow-none"
                            variant={'ghost'}
                            onClick={() => setShowEditModal(true)}
                        >
                            <Icons.Edit className="mr-2" /> Chỉnh sửa bài viết
                        </Button>

                        <Button
                            className="w-full justify-start rounded-sm shadow-none"
                            variant={'ghost'}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Icons.Delete className="mr-2" /> Xóa bài viết
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {showEditModal && (
                <EditPostModal
                    post={post}
                    show={showEditModal}
                    setShow={setShowEditModal}
                    handleClose={() => setShowEditModal(false)}
                />
            )}

            {showDeleteModal && (
                <DeletePostModal
                    postId={post._id}
                    show={showDeleteModal}
                    setShow={setShowDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
};

export default ActionPost;
