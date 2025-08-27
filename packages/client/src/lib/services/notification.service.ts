import {
    acceptFriend,
    createNotificationAcceptFriend,
    createNotificationFollowUser,
    declineFriend,
    deleteNotification,
    deleteNotificationByUsers,
    getNotificationAddFriendByUserId,
    getNotificationByNotiId,
    markAllAsRead,
    sendRequestAddFriend,
} from '../actions/notification.action';

interface INotificationService {
    getById: (notificationId: string) => Promise<INotification | null>;

    getTypeAcceptFriendByUser(userId: string): Promise<INotification | null>;

    sendRequestFriend: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<INotification | null>;

    acceptFriend: ({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }) => Promise<boolean>;

    declineFriend: ({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }) => Promise<boolean>;

    createNotificationAcceptFriend: ({
        senderId,
        receiverId,
        message,
        type,
    }: {
        senderId: string;
        receiverId: string;
        message: string;
        type: string;
    }) => Promise<INotification | null>;

    createNotificationFollowUser: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<INotification | null>;

    markAllAsRead: (userId: string) => Promise<boolean>;

    deleteNotification: (notificationId: string) => Promise<boolean>;
    deleteNotificationByUsers: ({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }) => Promise<boolean>;
}

class NotificationServiceClass implements INotificationService {
    async getById(notificationId: string): Promise<INotification | null> {
        return await getNotificationByNotiId({ notificationId });
    }

    async getTypeAcceptFriendByUser(
        userId: string
    ): Promise<INotification | null> {
        return await getNotificationAddFriendByUserId({
            receiverId: userId,
        });
    }

    async sendRequestFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        return await sendRequestAddFriend({ senderId, receiverId });
    }

    async acceptFriend({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }): Promise<boolean> {
        return await acceptFriend({ senderId, notificationId });
    }

    async declineFriend({
        senderId,
        notificationId,
    }: {
        senderId: string;
        notificationId: string;
    }): Promise<boolean> {
        return await declineFriend({
            senderId,
            notificationId,
        });
    }

    async createNotificationAcceptFriend({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        return await createNotificationAcceptFriend({
            senderId,
            receiverId,
        });
    }

    async createNotificationFollowUser({
        senderId,
        receiverId,
    }: {
        senderId: string;
        receiverId: string;
    }): Promise<INotification | null> {
        return await createNotificationFollowUser({
            senderId,
            receiverId,
        });
    }

    async markAllAsRead(): Promise<boolean> {
        return await markAllAsRead();
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        return await deleteNotification({ notificationId });
    }

    async deleteNotificationByUsers({
        senderId,
        receiverId,
        type = 'request-add-friend',
    }: {
        senderId: string;
        receiverId: string;
        type?: string;
    }): Promise<boolean> {
        return await deleteNotificationByUsers({
            senderId,
            receiverId,
            type: type,
        });
    }
}

const NotificationService = new NotificationServiceClass();
export default NotificationService;
