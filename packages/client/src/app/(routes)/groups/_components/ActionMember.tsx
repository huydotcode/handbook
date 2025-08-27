'use client';

import { ConfirmModal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { GroupUserRole } from '@/enums/GroupRole';
import GroupService from '@/lib/services/group.service';
import { timeConvert4 } from '@/utils/timeConvert';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    member: IMemberGroup;
    group: IGroup;
}

const ActionMember = ({ member, group }: Props) => {
    const [openModalRemoveMember, setOpenModalRemoveMember] =
        useState<boolean>(false);
    const path = usePathname();

    const handleRemoveMember = async () => {
        try {
            const res = await GroupService.leave({
                userId: member.user._id,
                groupId: group._id,
                path: path,
            });

            toast.success('Xóa thành viên thành công');
        } catch (error) {
            toast.error('Xóa thành viên thất bại');
        }
    };

    return (
        <div className={'w-full rounded-xl bg-secondary-1 p-2'}>
            <h1 className={'text-xl font-bold'}>Thông tin thành viên</h1>
            <p className={'text-secondary-3 mt-2 text-sm'}>
                Thành viên: {member.user.name}
            </p>
            <p className={'text-secondary-3 text-sm'}>
                Tham gia vào: {timeConvert4(member.joinedAt.toString())}
            </p>
            <p className={'text-secondary-3 text-sm'}>
                Vai trò:{' '}
                {member.role === GroupUserRole.MEMBER
                    ? 'Thành viên'
                    : member.role === GroupUserRole.ADMIN
                      ? 'Quản trị viên'
                      : 'Chủ nhóm'}
            </p>

            <div className={'flex items-center justify-end gap-2'}>
                <Button
                    variant={'warning'}
                    size={'sm'}
                    onClick={() => {
                        setOpenModalRemoveMember(true);
                    }}
                >
                    Mời ra khỏi nhóm
                </Button>

                {openModalRemoveMember && (
                    <ConfirmModal
                        open={openModalRemoveMember}
                        setShow={setOpenModalRemoveMember}
                        onClose={() => setOpenModalRemoveMember(false)}
                        onConfirm={handleRemoveMember}
                        title={'Mời ra khỏi nhóm'}
                        message={
                            'Bạn có chắc muốn mời thành viên này ra khỏi nhóm?'
                        }
                        confirmText={'Xóa'}
                        cancelText={'Hủy'}
                    />
                )}
            </div>
        </div>
    );
};

export default ActionMember;
