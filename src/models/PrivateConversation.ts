import { Schema, Types, model, models } from 'mongoose';

interface IPrivateConversationModel {
    _id: string;
    members: Types.ObjectId[];
    status: string;
    background: string;
    createdAt: Date;
    updatedAt: Date;
}

const PrivateConversationModel = new Schema<IPrivateConversationModel>(
    {
        _id: { type: String, required: true },
        members: [{ type: Types.ObjectId, ref: 'User' }],
        status: { type: String, default: 'active' },
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
