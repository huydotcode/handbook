'use server';
import { NotificationType } from '@/enums/EnumNotification';
import { Notification, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';

/*
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    extra?: {
        postId?: Types.ObjectId;
        commentId?: Types.ObjectId;
        groupId?: Types.ObjectId;
        messageId?: Types.ObjectId;
        notificationId?: Types.ObjectId;

        [key: string]: any;
    };
    isRead: boolean;
    isDeleted: boolean;
    type: NotificationType;
    deletedAt?: Date | null;
*/

const POPULATE_SENDER = 'name avatar username isOnline';

export async function getNotificationByNotiId({
    notificationId,
}: {
    notificationId: string;
}) {
    console.log('[LIB-ACTIONS] getNotificationByNotiId');
    try {
        await connectToDB();

        const notification = await Notification.findById(notificationId)
            .populate('sender', POPULATE_SENDER)
            .populate('receiver', POPULATE_SENDER);

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
}

// Lấy các noti kết bạn được gửi đến user
export async function getNotificationAddFriendByUserId({
    receiverId,
}: {
    receiverId: string;
}) {
    console.log('[LIB-ACTIONS] getNotificationAddFriendByUserId');
    try {
        await connectToDB();

        const notifications = await Notification.findOne({
            receiver: receiverId,
            type: NotificationType.REQUEST_ADD_FRIEND,
        })
            .populate('sender', POPULATE_SENDER)
            .populate('receiver', POPULATE_SENDER)
            .sort({ createdAt: -1, isRead: 1 });

        return JSON.parse(JSON.stringify(notifications));
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function markAllAsRead() {
    console.log('[LIB-ACTIONS] markAllAsRead');
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session?.user) return false;

        await Notification.updateMany(
            { receiver: session.user.id },
            { isRead: true }
        );

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function sendRequestAddFriend({
    senderId,
    receiverId,
}: {
    senderId: string;
    receiverId: string;
}) {
    console.log('[LIB-ACTIONS] sendRequestAddFriend');
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session?.user) throw new Error('Đã có lỗi xảy ra');

        // Kiểm tra xem đã gửi lời mời kết bạn chưa
        const isExistRequest = await Notification.findOne({
            sender: senderId,
            receiver: receiverId,
            type: 'request-add-friend',
        });

        if (isExistRequest) return;

        // Tạo notification mới
        const newNotification = new Notification({
            sender: senderId,
            receiver: receiverId,
            type: NotificationType.REQUEST_ADD_FRIEND,
        });

        await newNotification.save();

        const notification = await getNotificationByNotiId({
            notificationId: newNotification._id,
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        console.log('[LIB-ACTIONS] sendRequestAddFriend error', error);
        throw new Error(error.message || 'Lỗi khi gửi lời mời kết bạn');
    }
}

export async function acceptFriend({
    senderId,
    notificationId,
}: {
    senderId: string;
    notificationId: string;
}) {
    console.log('[LIB-ACTIONS] acceptFriend');
    const ERROR_MESSAGE = 'Đã có lỗi xảy ra';

    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error(ERROR_MESSAGE);

        // Hàm tiện ích để tìm kiếm người dùng theo ID
        const findUserById = async (id: string) => {
            const user = await User.findById(id);
            if (!user) throw new Error(ERROR_MESSAGE);
            return user;
        };

        // Tìm kiếm user và friend đồng thời
        const [user, friend] = await Promise.all([
            findUserById(session.user.id),
            findUserById(senderId),
        ]);

        await Notification.deleteOne({
            _id: notificationId,
            receiver: user._id,
        });

        // Kiểm tra nếu đã là bạn bè, kết thúc sớm
        if (user.friends.includes(friend._id)) return false;

        // Thêm bạn bè cho cả hai người dùng
        user.friends.push(friend._id);
        friend.friends.push(user._id);

        await Promise.all([user.save(), friend.save()]);

        return true;
    } catch (error: any) {
        throw new Error(error.message || ERROR_MESSAGE);
    }
}

// Tạo thông báo chấp nhận kết bạn
export async function createNotificationAcceptFriend({
    senderId,
    receiverId,
}: {
    senderId: string;
    receiverId: string;
}) {
    console.log('[LIB-ACTIONS] createNotificationAcceptFriend');
    try {
        const notificationAcceptFriend = new Notification({
            sender: senderId,
            receiver: receiverId,
            type: NotificationType.ACCEPT_FRIEND_REQUEST,
        });

        await notificationAcceptFriend.save();

        const notification = await getNotificationByNotiId({
            notificationId: notificationAcceptFriend._id,
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function createNotificationFollowUser({
    senderId,
    receiverId,
}: {
    senderId: string;
    receiverId: string;
}) {
    console.log('[LIB-ACTIONS] createNotificationFollowUser');
    try {
        const notificationFollowUser = new Notification({
            sender: senderId,
            receiver: receiverId,
            type: NotificationType.FOLLOW_USER,
        });

        await notificationFollowUser.save();

        const notification = await getNotificationByNotiId({
            notificationId: notificationFollowUser._id,
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function declineFriend({
    senderId,
    notificationId,
}: {
    senderId: string;
    notificationId: string;
}) {
    console.log('[LIB-ACTIONS] declineFriend');
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const user = await User.findById(session.user.id).exec();
        if (!user) throw new Error('Đã có lỗi xảy ra');

        const friend = await User.findById(senderId).exec();
        if (!friend) throw new Error('Đã có lỗi xảy ra');

        // Xóa thông báo kết bạn
        await Notification.deleteOne({
            _id: notificationId,
            receiver: user._id,
        });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function deleteNotification({
    notificationId,
}: {
    notificationId: string;
}) {
    console.log('[LIB-ACTIONS] deleteNotification');
    try {
        await connectToDB();
        await Notification.updateOne(
            {
                _id: notificationId,
            },
            {
                isDeleted: true,
                deletedAt: new Date(),
            }
        );
        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Xóa thông báo của 2 người dùng với nhau
export async function deleteNotificationByUsers({
    senderId,
    receiverId,
    type,
}: {
    senderId: string;
    receiverId: string;
    type: string;
}) {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session?.user) throw new Error('Đã có lỗi xảy ra');

        await Notification.updateMany(
            {
                sender: senderId,
                receiver: receiverId,
                type,
            },
            {
                isDeleted: true,
                deletedAt: new Date(),
            }
        );

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}
