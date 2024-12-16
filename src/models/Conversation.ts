import { Schema, Types, model, models } from 'mongoose';

interface IConversationModel {
    title: string;
    creator: Types.ObjectId;
    participants: Types.ObjectId[];
    group: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationModel = new Schema<IConversationModel>(
    {
        title: { type: String, required: true },
        creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        participants: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: false,
            default: null,
        },
        status: { type: String, default: 'active' },
    },
    { timestamps: true }
);

ConversationModel.index({ group: 1 }); // Index for group

const Conversation =
    models.Conversation ||
    model<IConversationModel>('Conversation', ConversationModel);

export default Conversation;
