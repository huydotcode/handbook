'use client';
import { ConfirmModal } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { deleteGroup, joinGroup, leaveGroup } from '@/lib/actions/group.action';

import { Button } from '@/components/ui/Button';
import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
}

const Action: React.FC<Props> = ({ group }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const groupId = group._id;

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const isJoinGroup = group.members.some(
        (member) => member.user._id == session?.user?.id
    );
    const isCreator = useMemo(() => {
        return group.creator._id == session?.user?.id;
    }, [group.creator._id, session?.user?.id]);

    const handleJoinGroup: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await joinGroup({
                userId: session?.user?.id as string,
                groupId: groupId,
            });
            toast.success('Đã tham gia nhóm');
        } catch (error) {
            logger({
                message: 'Error handle add friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn!');
        }
    };

    const handleOutGroup = async () => {
        try {
            await leaveGroup({
                groupId: groupId,
                userId: session?.user?.id as string,
            });
            toast.success('Đã rời khỏi nhóm');
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
                    variant={isJoinGroup ? 'warning' : 'primary'}
                    size={'sm'}
                    onClick={isJoinGroup ? handleOutGroup : handleJoinGroup}
                >
                    {isJoinGroup ? <Icons.Users /> : <Icons.PersonAdd />}

                    <p className="ml-2 md:hidden">
                        {isJoinGroup && 'Rời nhóm'}
                        {!isJoinGroup && 'Tham gia nhóm'}
                    </p>
                </Button>
            )}

            {isCreator && (
                <Button
                    className={'ml-2 h-12 min-w-[48px]'}
                    variant={'warning'}
                    size={'md'}
                    onClick={() => setOpenModalDelete(true)}
                >
                    <Icons.Delete />
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
