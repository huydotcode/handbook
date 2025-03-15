import { Schema, Types, model, models } from 'mongoose';

interface IMessageModel {
    text: string;
    images: Types.ObjectId[];
    sender: Types.ObjectId;
    conversation: Types.ObjectId;
    isRead: boolean;
}

const MessageSchema = new Schema<IMessageModel>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'conversation',
            required: true,
        },
        text: {
            type: String,
        },
        images: {
            type: [Schema.Types.ObjectId],
            ref: 'image',
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

MessageSchema.index({ text: 'text' }); // Index for text search
MessageSchema.index({ conversation: 1 }); // Index for messages by conversation
MessageSchema.index({ sender: 1 }); // Index for messages by sender
MessageSchema.index({ createdAt: -1 }); // Index for messages by createdAt

const Message =
    models.Message || model<IMessageModel>('message', MessageSchema);
export default Message;
