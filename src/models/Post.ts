import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IPost {
    option: string;
    content: string;
    images?: Types.Array<Object>;
    locale?: string;
    creator: Types.ObjectId;
    loves: Types.Array<string>;
    shares?: number;
    createdAt: Date;
    updatedAt: Date;
    commentCount?: number;
    groupId?: Types.ObjectId;
}

const PostSchema = new Schema<IPost>({
    option: {
        type: String,
        required: true,
    },
    content: String,
    images: [{ type: Object }],
    locale: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    commentCount: { type: Number, default: 0 },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null,
    },
});

const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;
