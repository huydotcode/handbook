'use client';
import React, { FormEventHandler, useState } from 'react';

import usePostContext from '@/hooks/usePostContext';
import { deletePost } from '@/lib/actions/post.action';
import { Fade, Modal } from '@mui/material';
import { usePathname } from 'next/navigation';
import { MdMoreVert } from 'react-icons/md';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Button from '../ui/Button';
import Popover, { usePopover } from '../ui/Popover';

interface Props {
    post: Post;
    setIsDelete?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionPost: React.FC<Props> = ({ post }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const { setPosts } = usePostContext();
    const [isSubmitting, setIsSubmitting] = useState<boolean>();

    const {
        anchorEl,
        handleClose: handleCloseDropdown,
        handleShow: handleOpenDropdown,
        open,
    } = usePopover();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await deletePost({
                postId: post._id,
            });
            setPosts((prev) => prev.filter((item) => item._id != post._id));
        } catch (error: any) {
            throw new Error(error);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <>
            <Button
                className="bg-transparent shadow-none"
                variant={'event'}
                onClick={handleOpenDropdown}
            >
                <MdMoreVert className="text-3xl" />
            </Button>

            <Popover
                anchorEl={anchorEl}
                open={open}
                handleClose={handleCloseDropdown}
            >
                <div className="relative flex flex-col min-w-[200px]">
                    <Button
                        className="justify-start w-full rounded-xl hover:bg-gray-200 dark:hover:bg-dark-500"
                        variant={'custom'}
                        size={'medium'}
                        onClick={() => {
                            handleShowModal();
                            handleCloseDropdown();
                        }}
                    >
                        <RiDeleteBin5Fill className="mr-2" /> Xóa bài viết
                    </Button>
                </div>
            </Popover>

            <Modal
                open={showModal}
                onClose={handleCloseModal}
                className="flex items-center justify-center"
                disableAutoFocus
            >
                <Fade in={showModal}>
                    <div className="relative p-4 rounded-xl bg-white dark:bg-dark-200">
                        <div className="border-b pb-2">
                            <p>Bạn có chắc muốn xóa bài viết?</p>
                        </div>

                        <div className="flex justify-end mt-4">
                            <form onSubmit={handleDeletePost}>
                                <Button
                                    variant={'warning'}
                                    size={'medium'}
                                    className="mr-2 min-w-[80px]"
                                    disabled={isSubmitting}
                                >
                                    Có
                                </Button>
                            </form>
                            <Button
                                className="w-[30%]"
                                variant={'secondary'}
                                size={'medium'}
                                disabled={isSubmitting}
                                onClick={() => {
                                    setShowModal(false);
                                    handleCloseDropdown();
                                }}
                            >
                                Không
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default ActionPost;
