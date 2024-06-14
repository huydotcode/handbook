import { Schema, Types, model, models } from 'mongoose';

interface IGroupConversationModel {
    name: string;
    avatar: string;
    creator: Types.ObjectId;
    group: Types.ObjectId;
    members: IGroupMember[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const GroupConversationModel = new Schema<IGroupConversationModel>(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
        members: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                role: { type: String, default: 'member' },
            },
        ],
        status: { type: String, default: 'active' },
    },
    { timestamps: true }
);

const GroupConversation =
    models.GroupConversation ||
    model<IGroupConversationModel>('GroupConversation', GroupConversationModel);

export default GroupConversation;
