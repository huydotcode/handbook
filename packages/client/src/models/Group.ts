import { Schema, model, models } from 'mongoose';
import Post from './Post';

interface GroupMember {
    user: Schema.Types.ObjectId;
    role: string;
    joinedAt?: Date;
}

interface IGroupModel {
    name: string;
    description: string;
    avatar: Schema.Types.ObjectId;
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
            type: Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
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
                joinedAt: {
                    type: Date,
                    default: Date.now,
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

GroupSchema.index({ name: 'text' }); // Index for search
GroupSchema.index({ name: 1 }); // Index for name
GroupSchema.index({ creator: 1 }); // Index for creator
GroupSchema.index({ 'members.user': 1 }); // Index for members

GroupSchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function () {
        // Xóa tất cả các bài viết của nhóm
        await Post.deleteMany({ group: this.getFilter()['_id'] });
    }
);

const Group = models.Group || model<IGroupModel>('Group', GroupSchema);
export default Group;
