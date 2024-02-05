'use client';
import { Button } from '@/components/ui';
import usePostContext from '@/hooks/usePostContext';
import { deletePost } from '@/lib/actions/post.action';
import { Fade, Modal } from '@mui/material';
import React, { FormEventHandler, useState } from 'react';

interface Props {
    show: boolean;
    postId: string;
    handleClose: () => void;
}

const DeletePostModal: React.FC<Props> = ({ postId, show, handleClose }) => {
    const { setPosts } = usePostContext();

    const [isSubmitting, setIsSubmitting] = useState<boolean>();

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await deletePost({
                postId,
            });
            setPosts((prev) => prev.filter((item) => item._id != postId));
        } catch (error: any) {
            handleClose();
            throw new Error(error);
        } finally {
            handleClose();
        }
    };

    return (
        <>
            <Modal
                open={show}
                onClose={handleClose}
                className="flex items-center justify-center"
                disableAutoFocus
            >
                <Fade in={show}>
                    <div className="relative rounded-xl bg-white p-4 dark:bg-dark-200">
                        <div className="border-b pb-2">
                            <p>Bạn có chắc muốn xóa bài viết?</p>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <form onSubmit={handleDeletePost}>
                                <Button
                                    variant={'warning'}
                                    size={'medium'}
                                    className="mr-2 min-w-[80px] text-white"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                                </Button>
                            </form>
                            <Button
                                className="w-[30%] text-white"
                                variant={'secondary'}
                                size={'medium'}
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
