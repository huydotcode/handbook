'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';

import { UserService } from '@/lib/services';
import logger from '@/utils/logger';
import React, { FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    groupId: string;
}

const Action: React.FC<Props> = ({ groupId }) => {
    const [isRequest, setIsRequest] = useState<boolean>(false);
    const isJoinGroup = true;

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
            await UserService.unfriend({ friendId: groupId });

            toast.success('Đã hủy kết bạn');
        } catch (error) {
            logger({
                message: 'Error handle remove friend' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn!');
        }
    };

    return (
        <div className="flex items-center">
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
        </div>
    );
};
export default Action;
