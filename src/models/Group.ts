import { Schema, model, models } from 'mongoose';

interface IGroup {
    name: string;
    description: string;
    image: string;
    members: Schema.Types.ObjectId[];
    owner: Schema.Types.ObjectId;
    coverPhoto: string;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    introduction: string;
}

const GroupSchema = new Schema<IGroup>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: '/assets/img/group-avatar.jpg',
        },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        members: {
            type: [Schema.Types.ObjectId],
            required: true,
        },
        type: {
            type: String,
            default: 'public',
        },
        coverPhoto: {
            type: String,
            default: '/assets/img/cover-page.jpg',
        },
        introduction: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Group = models.Group || model<IGroup>('Group', GroupSchema);
export default Group;
