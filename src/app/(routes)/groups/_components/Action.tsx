'use client';
import { ConfirmModal } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { deleteGroup, joinGroup, leaveGroup } from '@/lib/actions/group.action';

import { Button } from '@/components/ui/Button';
import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { FormEventHandler, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversationsKey, getGroupsKey } from '@/lib/queryKey';
import { useGroupsJoined } from '@/context/AppContext';

interface Props {
    group: IGroup;
}

const Action: React.FC<Props> = ({ group }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const groupId = group._id;
    const { data: groupJoined } = useGroupsJoined(session?.user.id);
    const isJoinGroup = groupJoined?.some((item) => item._id === groupId);
    const [isPending, setIsPending] = useState(false);
    const queryClient = useQueryClient();

    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const isCreator = useMemo(() => {
        return group.creator._id == session?.user?.id;
    }, [group.creator._id, session?.user?.id]);

    const handleJoinGroup: FormEventHandler = async (e) => {
        e.preventDefault();

        setIsPending(true);

        try {
            await joinGroup({
                userId: session?.user?.id as string,
                groupId: groupId,
            });

            await queryClient.invalidateQueries({
                queryKey: getGroupsKey(session?.user?.id),
            });

            toast.success('Đã tham gia nhóm');
        } catch (error) {
            logger({
                message: 'Error handle add friend' + error,
                type: 'error',
            });
            toast.error('Có lỗi xảy ra khi tham gia nhóm!');
        } finally {
            setIsPending(false);
        }
    };

    const handleOutGroup = async () => {
        setIsPending(true);

        try {
            await leaveGroup({
                groupId: groupId,
                userId: session?.user?.id as string,
            });

            await queryClient.invalidateQueries({
                queryKey: getGroupsKey(session?.user?.id),
            });

            await queryClient.invalidateQueries({
                queryKey: getConversationsKey(session?.user.id),
            });

            toast.success('Đã rời khỏi nhóm');

            router.push('/groups');
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi rời khỏi nhóm!');
        } finally {
            setIsPending(false);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup({ groupId });

            await queryClient.invalidateQueries({
                queryKey: getConversationsKey(session?.user.id),
            });

            router.push('/groups');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa nhóm');
        }
    };

    return (
        <div className="flex items-center">
            {!isCreator && (
                <Button
                    className={'h-10 min-w-[48px]'}
                    variant={isJoinGroup ? 'warning' : 'primary'}
                    size={'sm'}
                    disabled={isPending}
                    onClick={isJoinGroup ? handleOutGroup : handleJoinGroup}
                >
                    {isPending ? (
                        <Icons.Loading />
                    ) : isJoinGroup ? (
                        <Icons.Users />
                    ) : (
                        <Icons.PersonAdd />
                    )}

                    <p className="ml-2 md:hidden">
                        {isJoinGroup && 'Rời nhóm'}
                        {!isJoinGroup && 'Tham gia nhóm'}
                    </p>
                </Button>
            )}

            {isCreator && (
                <Button
                    className={'ml-2 h-10 min-w-[48px]'}
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
