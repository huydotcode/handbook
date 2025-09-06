'use client';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { useSession } from 'next-auth/react'; // 1. Import useSession
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import Icons from '../ui/Icons';
import DeletePostModal from './action/DeletePostModal';
import EditPostModal from './action/EditPostModal';
import SavePost from './footer/SavePost';

interface Props {
    post: IPost;
}

const ActionPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const path = usePathname();
    const isManageGroupPostActive =
        path === `/groups/${post.group?._id}/manage/posts`;
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const currentUserId = session?.user?.id;
    const isAuthor = currentUserId === post.author._id;

    // Người dùng có thể chỉnh sửa nếu họ là tác giả
    const canEdit = isAuthor;

    // Người dùng có thể xóa nếu họ là tác giả HOẶC có quyền quản lý
    const canDelete = isAuthor || isManageGroupPostActive;

    // Người dùng có thể lưu bài viết nếu họ không phải là tác giả
    const canSave = currentUserId;

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="shadow-none"
                        variant={'ghost'}
                        size={'sm'}
                    >
                        <Icons.More className="text-3xl" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={'w-[250px] px-2'}
                    asChild
                    align={'end'}
                >
                    <div className="relative flex flex-col overflow-hidden">
                        {canSave && <SavePost post={post} />}

                        {canEdit && (
                            <Button
                                className="w-full justify-start rounded-sm shadow-none"
                                variant={'ghost'}
                                onClick={() => setShowEditModal(true)}
                            >
                                <Icons.Edit className="mr-2" /> Chỉnh sửa bài
                                viết
                            </Button>
                        )}

                        {canDelete && (
                            <Button
                                className="w-full justify-start rounded-sm text-red-500 shadow-none hover:text-red-600"
                                variant={'ghost'}
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Icons.Delete className="mr-2" /> Xóa bài viết
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {showEditModal && (
                <EditPostModal
                    post={post}
                    show={showEditModal}
                    setShow={setShowEditModal}
                    handleClose={() => setShowEditModal(false)}
                />
            )}

            {showDeleteModal && (
                <DeletePostModal
                    postId={post._id}
                    show={showDeleteModal}
                    setShow={setShowDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
};

export default ActionPost;
