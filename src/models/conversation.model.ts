import { Schema, Types, model, models } from 'mongoose';

interface IConversationModel {
    title: string;
    creator: Types.ObjectId;
    participants: Types.ObjectId[];
    group: Types.ObjectId;
    lastMessage: Types.ObjectId;
    avatar: Types.ObjectId;
    type: string;
    status: string;
    pinnedMessages: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ConversationModel = new Schema<IConversationModel>(
    {
        title: { type: String, default: '' },
        creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        participants: {
            type: [Schema.Types.ObjectId],
            ref: 'user',
            required: true,
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'message',
            required: false,
            default: null,
        },
        avatar: {
            type: Schema.Types.ObjectId,
            ref: 'media',
            required: false,
        },
        type: { type: String, default: 'private', enum: ['private', 'group'] },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'group',
            required: false,
            default: null,
        },
        pinnedMessages: {
            type: [Schema.Types.ObjectId],
            ref: 'message',
            required: false,
            default: [],
        },
        status: { type: String, default: 'active' },
    },
    { timestamps: true }
);

ConversationModel.index({ title: 'text' });

const Conversation =
    models.Conversation ||
    model<IConversationModel>('conversation', ConversationModel);

export default Conversation;
