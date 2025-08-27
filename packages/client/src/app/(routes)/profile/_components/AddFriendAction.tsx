'use client';
import { Button } from '@/components/ui/Button';
import Icons from '@/components/ui/Icons';
import { useSocket } from '@/context';
import { useRequests } from '@/context/AppContext';
import { useFriends } from '@/context/SocialContext';
import { NotificationType } from '@/enums/EnumNotification';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import NotificationService from '@/lib/services/notification.service';
import UserService from '@/lib/services/user.service';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    className?: string;
    userId: string;
}

const AddFriendAction: React.FC<Props> = ({ className = '', userId }) => {
    const { data: session } = useSession();
    const { invalidateFriends, invalidateRequests } = useQueryInvalidation();
    const { data: requests, isLoading: isLoadingRequests } = useRequests(
        session?.user.id
    );
    const { socketEmitor } = useSocket();
    const { data: friends, isLoading: isLoadingFriends } = useFriends(
        session?.user.id
    );
    const isLoadingBtn = useMemo(() => {
        return isLoadingRequests || isLoadingFriends;
    }, [isLoadingRequests, isLoadingFriends]);

    const { mutateAsync: sendRequest, isPending } = useMutation({
        mutationFn: async ({ receiverId }: { receiverId: string }) => {
            const request = await NotificationService.sendRequestFriend({
                receiverId: receiverId,
                senderId: session?.user.id as string,
            });

            return request;
        },
        onMutate: () => {
            toast('Đang gửi lời mời kết bạn...', {
                id: 'sendRequest',
                position: 'bottom-left',
            });
        },
        onSuccess: async (data) => {
            await invalidateRequests(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);

            if (!data) return;

            socketEmitor.sendRequestAddFriend({
                request: data,
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
            await UserService.unfriend(friendId);
        },
        onMutate: () => {
            toast('Đang hủy kết bạn...', {
                id: 'unfriend',
                position: 'bottom-left',
            });
        },
        onSuccess: async () => {
            await invalidateFriends(session?.user.id as string);
            await invalidateRequests(session?.user.id as string);

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
            await NotificationService.deleteNotificationByUsers({
                senderId: session.user.id,
                receiverId: userId,
                type: NotificationType.REQUEST_ADD_FRIEND,
            });

            await invalidateRequests(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);

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
        if (isLoadingBtn) return 'Đang tải...';
        if (isFriend) return 'Hủy';
        if (isRequest) return 'Đã gửi';
        return 'Kết bạn';
    };

    return (
        <Button
            className={cn(
                'min-w-[48px] md:w-full md:bg-transparent md:text-black md:hover:bg-transparent md:dark:text-dark-primary-1',
                className
            )}
            variant={
                isFriend ? 'secondary' : !isRequest ? 'primary' : 'secondary'
            }
            size={'md'}
            onClick={handleAddFriend}
            disabled={isPending}
        >
            {isLoadingBtn || isPending ? (
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
