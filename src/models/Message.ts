import { Schema, Types, model, models } from 'mongoose';

interface IMessageModel {
    text: string;
    images: Types.ObjectId[];
    sender: Types.ObjectId;
    conversation: string;
    isRead: boolean;
}

const MessageSchema = new Schema<IMessageModel>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conversation: {
            type: String,
            ref: 'Conversation',
            required: true,
        },
        text: {
            type: String,
        },
        images: {
            type: [Schema.Types.ObjectId],
            default: [],
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

const Message =
    models.Message || model<IMessageModel>('Message', MessageSchema);
export default Message;
