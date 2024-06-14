import { Schema, Types, model, models } from 'mongoose';

interface IParticipantModel {
    conversation: Types.ObjectId;
    user: Types.ObjectId;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const ParticipantModel = new Schema<IParticipantModel>(
    {
        conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'participant' },
        status: { type: String, default: 'active' },
    },
    { timestamps: true }
);

const Participant =
    models.Participant ||
    model<IParticipantModel>('Participant', ParticipantModel);

export default Participant;
