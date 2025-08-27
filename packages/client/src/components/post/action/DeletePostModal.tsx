'use client';
import { ConfirmModal } from '@/components/ui';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import React, { FormEventHandler } from 'react';
import toast from 'react-hot-toast';

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
    const { invalidatePosts, invalidateNewFeedPosts } = useQueryInvalidation();

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        try {
            await toast.promise(
                PostService.delete(postId),
                {
                    success: 'Xóa bài viết thành công',
                    error: 'Xóa bài viết không thành công',
                    loading: 'Đang xóa bài viết...',
                },
                {
                    id: 'delete-post',
                }
            );

            await invalidatePosts();
            await invalidateNewFeedPosts({});
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
