import { Schema, Types, model, models } from 'mongoose';

interface INotificationModel {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    isRead: boolean;
    type: string;
}

const NotificationSchema = new Schema<INotificationModel>(
    {
        type: { type: String, default: 'request-add-friend' },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: {
            type: String,
            default: '',
        },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.index({ sender: 1 }); // Index for notifications by sender
NotificationSchema.index({ receiver: 1 }); // Index for notifications by receiver

const Notification =
    models.Notification ||
    model<INotificationModel>('Notification', NotificationSchema);

export default Notification;
