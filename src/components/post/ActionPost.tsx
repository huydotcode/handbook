'use client';
import React, { MouseEventHandler, useState } from 'react';

import Button from '../ui/Button';
import Icons from '../ui/Icons';
import Popover, { usePopover } from '../ui/Popover';
import DeletePostModal from './action/DeletePostModal';
import EditPostModal from './action/EditPostModal';

interface Props {
    post: IPost;
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
                className=" shadow-none"
                variant={'event'}
                onClick={handleToggleDropdown}
            >
                <Icons.More className="text-3xl" />
            </Button>

            <Popover
                open={showDropdown}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handleClose={() => setShowDropdown(false)}
            >
                <div className="relative flex min-w-[200px] flex-col overflow-hidden">
                    <Button
                        className="w-full justify-start rounded-sm shadow-none"
                        size={'medium'}
                        onClick={() => handleShowModal('editModal')}
                    >
                        <Icons.Edit className="mr-2" /> Chỉnh sửa bài viết
                    </Button>

                    <Button
                        className="w-full justify-start rounded-sm shadow-none"
                        size={'medium'}
                        onClick={() => handleShowModal('deleteModal')}
                    >
                        <Icons.Delete className="mr-2" /> Xóa bài viết
                    </Button>
                </div>
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
