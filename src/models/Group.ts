import { Schema, model, models } from 'mongoose';

interface IGroupModel {
    name: string;
    description: string;
    avatar: string;
    members: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;
    coverPhoto: string;
    type: string;
    introduction: string;
}

const GroupSchema = new Schema<IGroupModel>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '/assets/img/group-avatar.jpg',
        },
        creator: {
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

const Group = models.Group || model<IGroupModel>('Group', GroupSchema);
export default Group;
