'use client';
import React, { FormEventHandler, MouseEventHandler, useState } from 'react';

import usePostContext from '@/hooks/usePostContext';
import { deletePost } from '@/lib/actions/post.action';
import { Fade, Modal } from '@mui/material';
import { usePathname } from 'next/navigation';
import { MdMoreVert } from 'react-icons/md';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Button from '../ui/Button';
import Popover, { usePopover } from '../ui/Popover';
import { BiEdit } from 'react-icons/bi';
import DeletePostModal from './action/DeletePostModal';
import EditPostModal from './action/EditPostModal';

interface Props {
    post: IPost;
    setIsDelete?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type IShowModal = {
    editModal: boolean;
    deleteModal: boolean;
};

const ActionPost: React.FC<Props> = ({ post }) => {
    const { anchorEl, setAnchorEl } = usePopover();

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<IShowModal>({
        editModal: false,
        deleteModal: false,
    });

    const handleToggleDropdown: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!anchorEl) {
            setAnchorEl(e.currentTarget);
        } else {
            setShowDropdown((prev) => !prev);
        }
    };

    const handleShowModal = (type: keyof IShowModal) => {
        setShowModal((prev) => ({ ...prev, [type]: true }));
        setShowDropdown(false);
    };

    const handleCloseModal = (type: keyof IShowModal) => {
        setShowModal((prev) => ({ ...prev, [type]: false }));
        setShowDropdown(false);
    };

    return (
        <>
            <Button
                className="bg-transparent shadow-none"
                variant={'event'}
                onClick={handleToggleDropdown}
            >
                <MdMoreVert className="text-3xl" />
            </Button>

            <Popover
                open={showDropdown}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handleClose={() => setShowDropdown(false)}
            >
                <div className="relative flex flex-col min-w-[200px]">
                    <Button
                        className="justify-start w-full rounded-xl hover:bg-gray-200 dark:hover:bg-dark-500"
                        variant={'custom'}
                        size={'medium'}
                        onClick={() => handleShowModal('editModal')}
                    >
                        <BiEdit className="mr-2" /> Chỉnh sửa bài viết
                    </Button>

                    <Button
                        className="justify-start w-full rounded-xl hover:bg-gray-200 dark:hover:bg-dark-500"
                        variant={'custom'}
                        size={'medium'}
                        onClick={() => handleShowModal('deleteModal')}
                    >
                        <RiDeleteBin5Fill className="mr-2" /> Xóa bài viết
                    </Button>
                </div>
            </Popover>

            {showModal.editModal && (
                <EditPostModal
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
