import { Schema, Types, model, models } from 'mongoose';

interface IMessageModel {
    text: string;
    media: Types.ObjectId[];
    sender: Types.ObjectId;
    conversation: Types.ObjectId;
    isRead: boolean;
    isPin: boolean;
}

const MessageSchema = new Schema<IMessageModel>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        text: {
            type: String,
        },
        media: {
            type: [Schema.Types.ObjectId],
            ref: 'Media',
            default: [],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isPin: {
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
    models.Message || model<IMessageModel>('Message', MessageSchema);
export default Message;
