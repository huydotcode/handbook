'use client';
import { Button, ConfirmModal, Icons } from '@/components/ui';
import { deletePost } from '@/lib/actions/admin/post.action';
import { deleteUser } from '@/lib/actions/admin/user.action';
import React, { FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    id: string;
    path: string;
    type: 'user' | 'post';
}

const AdminAction: React.FC<Props> = ({ id, path, type }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete: FormEventHandler = async (e) => {
        if (isDeleting) return;
        e.preventDefault();

        setIsDeleting(true);

        try {
            switch (type) {
                case 'user':
                    await deleteUser({
                        userId: id,
                        path: path,
                    });
                    break;
                case 'post':
                    await deletePost({
                        postId: id,
                        path: path,
                    });
                    toast.success('Đã xóa bài viết');
                    break;
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <Button
                variant={'custom'}
                onClick={() => {
                    setShowConfirm(true);
                }}
            >
                <Icons.Delete className="h-6 w-6" />
            </Button>

            <ConfirmModal
                open={showConfirm}
                setShow={setShowConfirm}
                cancelText="Từ chối"
                confirmText="Xác nhận"
                message="Bạn có chắc muốn xóa không?"
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Xác nhận xóa"
            />
        </>
    );
};
export default AdminAction;
