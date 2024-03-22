import { Schema, Types, model, models } from 'mongoose';

interface IPrivateConversationModel {
    _id: string;
    members: Types.ObjectId[];
    status: string;
    background: string;
}

const PrivateConversationModel = new Schema<IPrivateConversationModel>(
    {
        _id: { type: String, required: true },
        background: { type: String, default: null },
        members: [{ type: Types.ObjectId, ref: 'User' }],
        status: {
            enum: ['active', 'archived', 'blocked'],
            type: String,
            default: 'active',
        },
    },
    { timestamps: true }
);

const PrivateConversation =
    models.PrivateConversation ||
    model<IPrivateConversationModel>(
        'PrivateConversation',
        PrivateConversationModel
    );

export default PrivateConversation;
