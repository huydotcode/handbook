'use server';
import { Notification, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import { ConversationService } from '../services';

/*
    * Notification Model: 
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
*/

const POPULATE_SENDER = 'name avatar username isOnline';

export const getNotification = async ({
    notificationId,
}: {
    notificationId: string;
}) => {
    try {
        await connectToDB();

        const notification = await Notification.findById(
            notificationId
        ).populate('sender', POPULATE_SENDER);

        return JSON.parse(JSON.stringify(notification));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getNotifications = async () => {
    try {
        await connectToDB();
        const session = await getAuthSession();
        if (!session?.user) return;

        const notifications = await Notification.find({
            receiver: session.user.id,
        })
            .populate('sender', POPULATE_SENDER)
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(notifications));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const markAllAsRead = async () => {
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
};

export const sendRequestAddFriend = async ({
    receiverId,
}: {
    receiverId: string;
}) => {
    const session = await getAuthSession();

    try {
        await connectToDB();

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
};

// export const acceptFriend = async ({
//     notification,
// }: {
//     notification: INotification;
// }) => {
//     console.log('Accept friend');
//     try {
//         await connectToDB();
//         const session = await getAuthSession();
//         if (!session) throw new Error('Đã có lỗi xảy ra');

//         const user = await User.findById(session.user.id);
//         if (!user) throw new Error('Đã có lỗi xảy ra');

//         const friend = await User.findById(notification.sender._id);
//         if (!friend) throw new Error('Đã có lỗi xảy ra');

//         await Notification.deleteOne({ _id: notification._id });

//         user.friends.push(friend._id);
//         friend.friends.push(user._id);

//         await user.save();
//         await friend.save();

//         const notificationAcceptFriend = await new Notification({
//             sender: session.user.id,
//             receiver: notification.sender._id,
//             message: 'Đã chấp nhận lời mời kết bạn',
//             type: 'accept-friend',
//         });

//         await notificationAcceptFriend.save();

//         const notificaiton = await getNotification({
//             notificationId: notificationAcceptFriend._id,
//         });

//         console.log('Tạo conversation');
//         const conversation = await ConversationService.createConversation({
//             creator: session.user.id,
//             participantsUserId: [user._id.toString(), friend._id.toString()],
//         });

//         console.log('Tạo conversation xong', conversation);

//         return JSON.parse(JSON.stringify(notificaiton));
//     } catch (error: any) {
//         console.log('Error', error);
//         throw new Error(error);
//     }
// };

export const declineFriend = async ({
    notification,
}: {
    notification: INotification;
}) => {
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
};

export const removeNotification = async ({
    notificationId,
}: {
    notificationId: string;
}) => {
    try {
        await connectToDB();
        await Notification.deleteOne({ _id: notificationId });
        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
