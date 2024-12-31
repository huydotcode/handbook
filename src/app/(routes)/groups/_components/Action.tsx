'use client';
import { Button, ConfirmModal } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { deleteGroup, leaveGroup } from '@/lib/actions/group.action';

import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
}

const Action: React.FC<Props> = ({ group }) => {
    const [isRequest, setIsRequest] = useState<boolean>(false);
    const isJoinGroup = true;

    const { data: session } = useSession();
    const router = useRouter();
    const groupId = group._id;

    const isCreator = useMemo(() => {
        return group.creator._id == session?.user?.id;
    }, [group.creator._id, session?.user?.id]);

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const handleJoinGroup: FormEventHandler = async (e) => {
        if (isRequest) return;

        e.preventDefault();

        try {
        } catch (error) {
            logger({
                message: 'Error handle add friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn!');
        } finally {
            setIsRequest(true);
        }
    };

    const handleOutGroup = async () => {
        try {
            await leaveGroup({
                groupId: groupId,
                userId: session?.user?.id as string,
            });
            router.push('/groups');

            toast.success('Đã hủy kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle remove friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn!');
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup({ groupId });

            router.push('/groups');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa nhóm');
        }
    };

    return (
        <div className="flex items-center">
            {!isCreator && (
                <Button
                    className={'h-12 min-w-[48px]'}
                    variant={'secondary'}
                    size={'medium'}
                    onClick={isJoinGroup ? handleOutGroup : handleJoinGroup}
                >
                    <span>
                        {isJoinGroup ? <Icons.Users /> : <Icons.PersonAdd />}
                    </span>

                    <p className="ml-2 md:hidden">
                        {isRequest && 'Đã gửi lời tham gia nhóm'}
                        {isJoinGroup && 'Rời nhóm'}
                        {!isJoinGroup && !isRequest && 'Tham gia nhóm'}
                    </p>
                </Button>
            )}

            {isCreator && (
                <Button
                    className={'ml-2 h-12 min-w-[48px]'}
                    variant={'warning'}
                    size={'medium'}
                    onClick={() => setOpenModalDelete(true)}
                >
                    <span>
                        <Icons.Delete />
                    </span>
                </Button>
            )}

            {openModalDelete && (
                <ConfirmModal
                    cancelText="Hủy"
                    confirmText="Xóa"
                    message="Bạn có chắc chắn muốn xóa nhóm này không?"
                    onClose={() => setOpenModalDelete(false)}
                    onConfirm={handleDeleteGroup}
                    open={openModalDelete}
                    setShow={setOpenModalDelete}
                    title="Xóa nhóm"
                />
            )}
        </div>
    );
};
export default Action;
