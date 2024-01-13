import mongoose, { Schema, Types, model, models } from 'mongoose';

interface INotification {
    type: string;
    send: Types.ObjectId;
    receive: Types.ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
    {
        type: { type: String, required: true },
        send: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            default: 'Bạn có thông báo mới',
        },

        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Notification =
    models.Notification ||
    model<INotification>('Notification', NotificationSchema);

export default Notification;
