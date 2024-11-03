'use server';
import { Notification, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import { ConversationService } from '../services';
import mongoose from 'mongoose';

/*
    * Notification Model: 
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
*/

const POPULATE_SENDER = 'name avatar username isOnline';

export async function getNotification({
    notificationId,
}: {
    notificationId: string;
}) {
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

export async function getNotificationByUserId({ userId }: { userId: string }) {
    try {
        await connectToDB();

        const notifications = await Notification.find({
            receiver: userId,
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
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session?.user) return;

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
    receiverId,
}: {
    receiverId: string;
}) {
    try {
        await connectToDB();
        const session = await getAuthSession();

        const newNotification = await new Notification({
            sender: session?.user.id,
            receiver: receiverId,
            message: 'Đã gửi lời mời kết bạn',
            type: 'request-add-friend',
        });

        await newNotification.save();

        const notification = await getNotification({
            notificationId: newNotification._id,
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
}
export async function acceptFriend({
    notification,
}: {
    notification: INotification;
}) {
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
            findUserById(notification.sender._id),
        ]);

        await Notification.deleteOne({ _id: notification._id });

        // Kiểm tra nếu đã là bạn bè, kết thúc sớm
        if (user.friends.includes(friend._id)) return;

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
    console.log({
        senderId,
        receiverId,
        message,
        type,
    });
    try {
        const notificationAcceptFriend = new Notification({
            sender: senderId,
            receiver: receiverId,
            message,
            type,
        });

        await notificationAcceptFriend.save();

        const notification = await getNotification({
            notificationId: notificationAcceptFriend._id,
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function declineFriend({
    notification,
}: {
    notification: INotification;
}) {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const user = await User.findById(session.user.id).exec();
        if (!user) throw new Error('Đã có lỗi xảy ra');

        const friend = await User.findById(notification.sender._id).exec();
        if (!friend) throw new Error('Đã có lỗi xảy ra');

        await Notification.deleteOne({ _id: notification._id });

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function removeNotification({
    notificationId,
}: {
    notificationId: string;
}) {
    try {
        await connectToDB();
        await Notification.deleteOne({ _id: notificationId });
        return true;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function canRequestAddFriend({ userId }: { userId: string }) {
    try {
        await connectToDB();
        const session = await getAuthSession();

        const notification = await Notification.findOne({
            sender: session?.user.id,
            receiver: userId,
        });

        if (notification) return false;

        const currentUser = await User.findById(session?.user.id);

        if (
            currentUser?.friends.includes(new mongoose.Types.ObjectId(userId))
        ) {
            return false;
        }
    } catch (error: any) {
        throw new Error(error);
    } finally {
        return true;
    }
}
