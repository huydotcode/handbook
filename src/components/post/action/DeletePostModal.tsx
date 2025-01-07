'use client';
import { Button } from '@/components/ui/Button';
import { deletePost } from '@/lib/actions/post.action';
import { Fade, Modal } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import { getPostsKey } from '@/lib/queryKey';

interface Props {
    show: boolean;
    postId: string;
    handleClose: () => void;
}

const DeletePostModal: React.FC<Props> = ({ postId, show, handleClose }) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState<boolean>();

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await deletePost({
                postId,
            });

            queryClient.invalidateQueries({
                queryKey: getPostsKey(),
            });

            toast.success('Xóa bài viết thành công', {
                id: 'delete-post',
            });
        } catch (error: any) {
            toast.error('Xóa bài viết không thành công', {
                id: 'delete-post',
            });
        } finally {
            handleClose();
        }
    };

    return (
        <>
            <Modal
                open={show}
                onClose={handleClose}
                className="flex items-center justify-center "
                disableAutoFocus
            >
                <Fade in={show}>
                    <div className="relative rounded-xl bg-white p-4 dark:bg-dark-primary-1">
                        <div className="border-b pb-2">
                            <p>Bạn có chắc muốn xóa bài viết?</p>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <form onSubmit={handleDeletePost}>
                                <Button
                                    variant={'warning'}
                                    size={'default'}
                                    className="mr-2 min-w-[80px] "
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                                </Button>
                            </form>
                            <Button
                                className="w-[30%] "
                                variant={'secondary'}
                                size={'default'}
                                onClick={handleClose}
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
export default DeletePostModal;
