'use client';
import { follow, unfollow } from '@/lib/actions/user.action';
import { getFollowersKey, getRequestsKey } from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface Props {
    userId: string;
}

const FollowAction: React.FC<Props> = ({ userId }) => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();
    const followers = queryClient.getQueryData<IFriend[]>([
        'followers',
        session?.user.id,
    ]);

    const [countClick, setCountClick] = useState<number>(0);

    // Kiểm tra xem có thể gửi lời mời kết bạn không
    const isFollow =
        followers && followers.some((follower) => follower._id === userId);

    const followUser = async () => {
        try {
            await follow({
                userId,
            });

            queryClient.invalidateQueries({
                queryKey: getRequestsKey(session?.user.id),
            });

            toast.success('Đã theo dõi');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi theo dõi!');
        }
    };

    const unfollowUser = async () => {
        try {
            await unfollow({
                userId,
            });

            queryClient.invalidateQueries({
                queryKey: getFollowersKey(session?.user.id),
            });

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
            className="min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1"
            variant={isFollow ? 'secondary' : 'primary'}
            size="md"
            onClick={handleFollowClick}
        >
            {isFollow ? 'Đang Follow' : 'Theo dõi'}
        </Button>
    );
};

export default FollowAction;
