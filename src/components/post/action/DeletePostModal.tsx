'use client';
import { Button } from '@/components/ui';
import PostService from '@/lib/services/post.service';
import logger from '@/utils/logger';
import { Fade, Modal } from '@mui/material';
import React, { FormEventHandler, useState } from 'react';

interface Props {
    show: boolean;
    postId: string;
    handleClose: () => void;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const DeletePostModal: React.FC<Props> = ({
    postId,
    show,
    handleClose,
    setPosts,
}) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>();

    const handleDeletePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await PostService.deletePost({
                postId,
            });
            setPosts((prev) => prev.filter((item) => item._id != postId));
        } catch (error: any) {
            handleClose();
            logger({
                message: 'Error delete post' + error,
                type: 'error',
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
