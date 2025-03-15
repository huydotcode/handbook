import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IPostModel {
    option: string;
    text: string;
    images: Types.ObjectId[];
    author: Types.ObjectId;
    loves: Types.ObjectId[];
    shares: Types.ObjectId[];
    group: Types.ObjectId;
    comments_count: number;
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
        images: {
            type: [Types.ObjectId],
            default: [],
            ref: 'Image',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        loves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
        },
        comments_count: {
            type: Number,
            default: 0,
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

const Post = models.Post || model<IPostModel>('Post', PostSchema);

export default Post;
