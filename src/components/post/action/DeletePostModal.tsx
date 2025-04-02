'use client';
import { deletePost } from '@/lib/actions/post.action';
import { useQueryClient } from '@tanstack/react-query';
import React, { FormEventHandler } from 'react';
import toast from 'react-hot-toast';
import { getPostsKey } from '@/lib/queryKey';
import { ConfirmModal } from '@/components/ui';

interface Props {
    show: boolean;
    postId: string;
    handleClose: () => void;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeletePostModal: React.FC<Props> = ({
    postId,
    show,
    handleClose,
    setShow,
}) => {
    const queryClient = useQueryClient();

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        try {
            await toast.promise(
                deletePost({ postId }),
                {
                    success: 'Xóa bài viết thành công',
                    error: 'Xóa bài viết không thành công',
                    loading: 'Đang xóa bài viết...',
                },
                {
                    id: 'delete-post',
                }
            );

            await queryClient.invalidateQueries({
                queryKey: getPostsKey(),
            });
        } catch (error: any) {
            console.log(error);
        } finally {
            handleClose();
        }
    };

    return (
        <>
            <ConfirmModal
                open={show}
                onClose={handleClose}
                onConfirm={handleDeletePost}
                confirmText={'Xóa'}
                setShow={setShow}
                title={'Xóa bài viết'}
                cancelText={'Không'}
                message={'Bạn có chắc muốn xóa bài viết này không?'}
            />
        </>
    );
};
export default DeletePostModal;
