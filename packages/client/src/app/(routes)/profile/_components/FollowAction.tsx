'use client';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useFollowing } from '@/context/SocialContext';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import NotificationService from '@/lib/services/notification.service';
import UserService from '@/lib/services/user.service';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    className?: string;
    userId: string;
}

const FollowAction: React.FC<Props> = ({ className = '', userId }) => {
    const { data: session } = useSession();
    const { invalidateRequests, invalidateFollowings } = useQueryInvalidation();
    const { socket, socketEmitor } = useSocket();

    const { data: followings } = useFollowing(session?.user.id as string);

    const [countClick, setCountClick] = useState<number>(0);

    // Kiểm tra xem có thể gửi lời mời kết bạn không
    const isFollow =
        followings &&
        followings.some((follower) => follower.following._id === userId);

    const followUser = async () => {
        try {
            await UserService.follow(userId);

            await invalidateRequests(session?.user.id as string);
            await invalidateFollowings(session?.user.id as string);

            const newNotification =
                await NotificationService.createNotificationFollowUser({
                    senderId: session?.user.id as string,
                    receiverId: userId,
                });

            if (socket && newNotification) {
                socketEmitor.sendNotification({
                    notification: newNotification,
                });
            }

            toast.success('Đã theo dõi');
        } catch (error) {
            console.log('[FollowAction] followUser error', error);
            toast.error('Đã có lỗi xảy ra khi theo dõi!');
        }
    };

    const unfollowUser = async () => {
        try {
            await UserService.unfollow(userId);

            await invalidateFollowings(session?.user.id as string);

            toast.success('Đã bỏ theo dõi');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi bỏ theo dõi!');
        }
    };

    const handleFollowClick = () => {
        setCountClick((prev) => prev + 1);

        if (countClick === 5) {
            toast.error('Chậm lạiii đi bạn....');

            setTimeout(() => {
                setCountClick(0);
            }, 5000);

            return;
        }

        if (isFollow) {
            unfollowUser();
        } else {
            followUser();
        }
    };

    return (
        <Button
            className={cn(
                'min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1',
                className
            )}
            variant={isFollow ? 'secondary' : 'primary'}
            size="md"
            onClick={handleFollowClick}
        >
            {isFollow ? 'Đang Follow' : 'Follow'}
        </Button>
    );
};

export default FollowAction;
