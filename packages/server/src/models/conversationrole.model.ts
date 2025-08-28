import { model, models, Schema, Types } from 'mongoose';

interface IConversationRoleModel {
    conversationId: Types.ObjectId;
    userIds: Types.ObjectId[];
    role: string;
    createdAt: Date;
}

const ConversationRoleSchema = new Schema<IConversationRoleModel>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        userIds: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'member'],
        },
    },
    {
        timestamps: true,
    }
);

const ConversationRole =
    models?.ConversationRole ||
    model<IConversationRoleModel>('ConversationRole', ConversationRoleSchema);

export default ConversationRole;
