import { Schema, model, models } from 'mongoose';

interface IMessage {
    text: string;
    roomId: string;
    userId: Schema.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        roomId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Message = models.Message || model<IMessage>('Message', MessageSchema);
export default Message;
