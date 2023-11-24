import mongoose, { Schema, Types, model } from 'mongoose';

interface INotification {
    type: string;
    send: Types.ObjectId;
    receive: Types.ObjectId;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

const NotificationSchema = new Schema<INotification>({
    type: { type: String, required: true, default: 'friend' },
    send: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

const Notification = model<INotification>('Notification', NotificationSchema);

export default Notification;
