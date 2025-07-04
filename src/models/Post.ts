import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IPostModel {
    option: string;
    text: string;
    media: Types.ObjectId[];
    author: Types.ObjectId;
    group: Types.ObjectId;

    commentsCount: number;
    lovesCount: number;
    sharesCount: number;

    tags: string[];
    type: string;
    status: string;
}

const PostSchema = new Schema<IPostModel>(
    {
        option: {
            type: String,
            default: 'public',
        },
        text: {
            type: String,
            default: '',
        },
        media: {
            type: [Types.ObjectId],
            default: [],
            ref: 'Media',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lovesCount: {
            type: Number,
            default: 0,
        },
        sharesCount: {
            type: Number,
            default: 0,
        },

        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
            default: [],
        },
        type: {
            type: String,
            default: 'default',
            enum: ['default', 'group'],
        },
        status: {
            type: String,
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

PostSchema.index({ group: 1 }); // Index for posts by group
PostSchema.index({ author: 1 }); // Index for posts by author
PostSchema.index({ createdAt: -1 }); // Index for posts by date
PostSchema.index({ text: 'text' }); // Index for posts by text
PostSchema.index({ tags: 'text' }); // Index for posts by tags

const Post = models.Post || model<IPostModel>('Post', PostSchema);

export default Post;
