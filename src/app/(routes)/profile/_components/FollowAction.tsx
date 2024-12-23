'use client';
import { Button } from '@/components/ui';
import Icons from '@/components/ui/Icons';
import { useSocial, useSocket } from '@/context';
import { NotificationService, UserService } from '@/lib/services';
import logger from '@/utils/logger';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
}

const FollowAction: React.FC<Props> = ({ userId }) => {
    const { socket, socketEmitor } = useSocket();
    const { followers, setFollowers } = useSocial();
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [countClick, setCountClick] = useState<number>(0);

    // Kiểm tra xem có thể gửi lời mời kết bạn không
    const checkIsFollowing = async () => {
        const isFollowing =
            followers && followers.some((follower) => follower._id === userId);

        setIsFollow(isFollowing);
    };

    const followAction = async () => {
        if (isFollow) return;

        try {
            const follower = await UserService.follow({
                userId,
            });

            if (follower) {
                setIsFollow(true);
            } else {
                setIsFollow(false);
            }
        } catch (error) {
            logger({
                message: 'Error handle add friend: ' + error,
                type: 'error',
            });
            setIsFollow(false);
        }
    };

    const unFollowAction = async () => {
        try {
            const follower = await UserService.unfollow({
                userId,
            });

            if (follower) {
                setIsFollow(false);
            } else {
                setIsFollow(true);
            }
        } catch (error) {
            logger({
                message: 'Error handle add friend: ' + error,
                type: 'error',
            });
            setIsFollow(true);
        }
    };

    const getButtonText = () => {
        if (isFollow) return 'Đang Follow';
        return 'Theo dõi';
    };

    const handleAddFriend = () => {
        setCountClick((prev) => prev + 1);

        if (countClick === 5) {
            toast.error('Chậm lạiii đi bạn....');

            setTimeout(() => {
                setCountClick(0);
            }, 5000);

            return;
        }

        if (isFollow) {
            unFollowAction();
        } else {
            followAction();
        }
    };

    useEffect(() => {
        (async () => checkIsFollowing())();
    }, []);

    return (
        <Button
            className="h-12 min-w-[48px]"
            variant="secondary"
            size="medium"
            onClick={handleAddFriend}
        >
            <p className="ml-2 md:hidden">{getButtonText()}</p>
        </Button>
    );
};

export default FollowAction;
