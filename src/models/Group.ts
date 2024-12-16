import { Schema, model, models } from 'mongoose';

interface GroupMember {
    user: Schema.Types.ObjectId;
    role: string;
}

interface IGroupModel {
    name: string;
    description: string;
    avatar: string;
    members: GroupMember[];
    creator: Schema.Types.ObjectId;
    coverPhoto: string;
    type: string;
    introduction: string;
    lastActivity: Date;
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
            ref: 'User',
        },
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                role: {
                    type: String,
                    default: 'member',
                },
            },
        ],
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
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

GroupSchema.index({ name: 1 }); // Index for name
GroupSchema.index({ creator: 1 }); // Index for creator
GroupSchema.index({ 'members.user': 1 }); // Index for members

const Group = models.Group || model<IGroupModel>('Group', GroupSchema);
export default Group;
