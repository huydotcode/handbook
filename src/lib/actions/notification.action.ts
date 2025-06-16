'use server';
import { Notification, User } from '@/models';
import connectToDB from '@/services/mongoose';
import mongoose from 'mongoose';
import { getAuthSession } from '../auth';

/*
    * Notification Model: 
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
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
            type: 'request-add-friend',
        })
            .populate('sender', POPULATE_SENDER)
            .populate('receiver', POPULATE_SENDER)
            .sort({ createdAt: -1 });

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
            message: 'Đã gửi lời mời kết bạn',
            type: 'request-add-friend',
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

        // Lưu cả hai người dùng đồng thời
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
    message,
    type,
}: {
    senderId: string;
    receiverId: string;
    message: string;
    type: string;
}) {
    console.log('[LIB-ACTIONS] createNotificationAcceptFriend');
    try {
        const notificationAcceptFriend = new Notification({
            sender: senderId,
            receiver: receiverId,
            message,
            type,
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
        await Notification.deleteOne({ _id: notificationId });
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

        await Notification.deleteMany({
            sender: senderId,
            receiver: receiverId,
        });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}
