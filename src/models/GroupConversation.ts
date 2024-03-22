import { Schema, Types, model, models } from 'mongoose';

interface IGroupConversationModel {
    _id: string;
    name: string;
    avatar: string;
    desc: string;
    members: Types.ObjectId[];
    status: string;
    admins: Types.ObjectId[];
    unreadMessages: number;
    lastActivityAt: Date;
    background: string;
}

const GroupConversationModel = new Schema<IGroupConversationModel>(
    {
        _id: { type: String, required: true },
        name: { type: String, default: null },
        avatar: { type: String, default: null },
        desc: { type: String, default: null },
        admins: [{ type: Types.ObjectId, ref: 'User' }],
        background: { type: String, default: null },
        members: [{ type: Types.ObjectId, ref: 'User' }],
        unreadMessages: { type: Number, default: 0 },
        lastActivityAt: { type: Date, default: Date.now },
        status: {
            enum: ['active', 'archived', 'blocked'],
            type: String,
            default: 'active',
        },
    },
    { timestamps: true }
);

const GroupConversation =
    models.GroupConversation ||
    model<IGroupConversationModel>('GroupConversation', GroupConversationModel);

export default GroupConversation;
