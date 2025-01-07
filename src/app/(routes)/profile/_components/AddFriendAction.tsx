'use client';
import { Button } from '@/components/ui/Button';
import Icons from '@/components/ui/Icons';
import { useSocket } from '@/context';
import { useRequests } from '@/context/AppContext';
import { useFriends } from '@/context/SocialContext';
import {
    deleteNotificationByUsers,
    sendRequestAddFriend,
} from '@/lib/actions/notification.action';
import { unfriend } from '@/lib/actions/user.action';
import { getFriendsKey, getRequestsKey } from '@/lib/queryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    userId: string;
}

const AddFriendAction: React.FC<Props> = ({ userId }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { data: requests } = useRequests(session?.user.id);

    const { mutateAsync: sendRequest, isPending } = useMutation({
        mutationFn: async ({ receiverId }: { receiverId: string }) => {
            const request = await sendRequestAddFriend({ receiverId });

            return request;
        },
        onMutate: () => {
            toast('Đang gửi lời mời kết bạn...', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
        onSuccess: (data) => {
            socketEmitor.sendRequestAddFriend({
                request: data,
            });

            queryClient.invalidateQueries({
                queryKey: getRequestsKey(session?.user.id),
            });

            toast.success('Gửi lời mời kết bạn thành công', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
        onError: (error) => {
            toast.error('Đã có lỗi xảy ra khi gửi lời mời kết bạn.', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
    });

    const { mutate: mutationUnFriend } = useMutation({
        mutationFn: async ({ friendId }: { friendId: string }) => {
            unfriend({ friendId });
        },
        onMutate: () => {
            toast('Đang hủy kết bạn...', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getFriendsKey(session?.user.id),
            });

            toast.success('Hủy kết bạn thành công', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
        onError: (error) => {
            toast.error('Đã có lỗi xảy ra khi hủy kết bạn.', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
    });

    const { socketEmitor } = useSocket();
    const { data: friends, refetch } = useFriends(session?.user.id);

    const isRequest =
        requests &&
        requests?.some((request) => request.receiver._id === userId);
    const [countClick, setCountClick] = useState<number>(0);

    // Kiểm tra trạng thái bạn bè
    const isFriend = useMemo(
        () => friends && friends.some((friend) => friend._id === userId),
        [friends, userId]
    );

    // Hủy lời mời kết bạn
    const handleRemoveRequest = async () => {
        if (!session) return;

        try {
            await deleteNotificationByUsers({
                senderId: session.user.id,
                receiverId: userId,
                type: 'request-add-friend',
            });

            queryClient.invalidateQueries({
                queryKey: getRequestsKey(session?.user.id),
            });

            toast.success('Đã hủy lời mời kết bạn', {
                id: 'removeRequest',
            });
        } catch (error) {
            console.error('Lỗi hủy lời mời kết bạn:', error);
            toast.error('Đã có lỗi xảy ra khi hủy lời mời kết bạn.', {
                id: 'removeRequest',
            });
        }
    };

    // Xử lý khi click vào nút kết bạn
    const handleAddFriend = async () => {
        if (!session) return;

        setCountClick((prev) => prev + 1);

        if (countClick >= 5) {
            toast.error('Vui lòng giảm tần suất thao tác.', {
                id: 'handleAddFriend',
            });
            setTimeout(() => setCountClick(0), 5000);
            return;
        }

        try {
            if (isFriend) {
                mutationUnFriend({
                    friendId: userId,
                });
            } else if (isRequest) {
                handleRemoveRequest();
            } else {
                await sendRequest({ receiverId: userId });
            }

            setCountClick(0);
        } catch (error) {
            toast('Đã có lỗi xảy ra.', {
                id: 'handleAddFriend',
                position: 'bottom-left',
            });
        }
    };

    // Hiển thị văn bản nút
    const getButtonText = () => {
        if (isFriend) return 'Hủy';
        if (isRequest) return 'Đã gửi';
        return 'Kết bạn';
    };

    return (
        <Button
            className="min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1"
            variant={
                isFriend ? 'secondary' : !isRequest ? 'primary' : 'secondary'
            }
            size={'md'}
            onClick={handleAddFriend}
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Icons.Loading />
                </>
            ) : (
                <>
                    <span className={'md:hidden'}>
                        {isFriend ? <Icons.Users /> : <Icons.PersonAdd />}
                    </span>
                    <p className="ml-2 md:ml-0">{getButtonText()}</p>
                </>
            )}
        </Button>
    );
};

export default AddFriendAction;
