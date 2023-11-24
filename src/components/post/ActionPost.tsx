'use client';
import React, { useState } from 'react';

import { Fade, Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { MdMoreVert } from 'react-icons/md';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Popover, { usePopover } from '../ui/Popover';
import Button from '../ui/Button';

interface Props {
    post: Post;
    setIsDelete?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionPost: React.FC<Props> = ({ post, setIsDelete }) => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState<boolean>(false);

    const pathname = usePathname();
    const router = useRouter();

    const {
        anchorEl,
        handleClose: handleCloseDropdown,
        handleShow: handleOpenDropdown,
        open,
    } = usePopover();

    const handleDeletePost = async () => {
        if (setIsDelete) setIsDelete(true);

        try {
            if (post.images.length > 0) {
                await fetch('/api/images', {
                    method: 'DELETE',
                    body: JSON.stringify({ images: post.images }),
                });
            }

            await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
            });
        } catch (error: any) {
            throw new Error(error);
        } finally {
            handleCloseDropdown();

            if (pathname === `/post/${post._id}`) {
                router.push('/');
            }
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
                            <Button
                                variant={'warning'}
                                size={'medium'}
                                className="mr-2 w-[30%]"
                                onClick={handleDeletePost}
                            >
                                Có
                            </Button>
                            <Button
                                className="w-[30%]"
                                variant={'secondary'}
                                size={'medium'}
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
