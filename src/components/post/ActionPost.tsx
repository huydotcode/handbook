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

export type IShowModal = {
    editModal: boolean;
    deleteModal: boolean;
};

const ActionPost: React.FC<Props> = ({ post }) => {
    const [showModal, setShowModal] = useState<IShowModal>({
        editModal: false,
        deleteModal: false,
    });

    const handleShowModal = (type: keyof IShowModal) => {
        setShowModal((prev) => ({ ...prev, [type]: true }));
    };

    const handleCloseModal = (type: keyof IShowModal) => {
        setShowModal((prev) => ({ ...prev, [type]: false }));
    };

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
                            size={'sm'}
                            variant={'ghost'}
                            onClick={() => handleShowModal('editModal')}
                        >
                            <Icons.Edit className="mr-2" /> Chỉnh sửa bài viết
                        </Button>

                        <Button
                            className="w-full justify-start rounded-sm shadow-none"
                            size={'sm'}
                            variant={'ghost'}
                            onClick={() => handleShowModal('deleteModal')}
                        >
                            <Icons.Delete className="mr-2" /> Xóa bài viết
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {showModal.editModal && (
                <EditPostModal
                    post={post}
                    show={showModal.editModal}
                    setShow={setShowModal}
                    handleClose={() => handleCloseModal('editModal')}
                />
            )}

            {showModal.deleteModal && (
                <DeletePostModal
                    show={showModal.deleteModal}
                    postId={post._id}
                    handleClose={() => handleCloseModal('deleteModal')}
                />
            )}
        </>
    );
};

export default ActionPost;
