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

        const notification = await Notification.findById(
            notificationId
        ).populate('sender', POPULATE_SENDER);

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
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const user = await User.findById(session.user.id);
        if (!user) throw new Error('Đã có lỗi xảy ra');

        const friend = await User.findById(notification.sender._id);
        if (!friend) throw new Error('Đã có lỗi xảy ra');

        await Notification.deleteOne({ _id: notification._id });

        if (user.friends.includes(friend._id)) return;

        friend.friends.push(user._id);
        user.friends.push(friend._id);

        await user.save();
        await friend.save();

        const notificationAcceptFriend = await new Notification({
            sender: session.user.id,
            receiver: notification.sender._id,
            message: 'Đã chấp nhận lời mời kết bạn',
            type: 'accept-friend',
        });

        await notificationAcceptFriend.save();

        const notificaiton = await getNotification({
            notificationId: notificationAcceptFriend._id,
        });

        const conversation = await ConversationService.createConversation({
            creator: session.user.id,
            participantsUserId: [user._id.toString(), friend._id.toString()],
        });

        return JSON.parse(JSON.stringify(notificaiton));
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

        if (notification) {
            console.log({
                msg: 'Đã gửi lời mời kết bạn',
            });

            return false;
        }

        const currentUser = await User.findById(session?.user.id);

        if (
            currentUser?.friends.includes(new mongoose.Types.ObjectId(userId))
        ) {
            console.log('Đã là bạn bè với', userId);
            return false;
        }
    } catch (error: any) {
        throw new Error(error);
    }

    return true;
}
