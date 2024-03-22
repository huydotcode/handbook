import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IPostModel {
    option: string;
    text: string;
    images: Types.ObjectId[];
    author: Types.ObjectId;
    loves: Types.ObjectId[];
    shares: Types.ObjectId[];
    group: Types.ObjectId;
    comments: Types.ObjectId[];
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
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = models.Post || model<IPostModel>('Post', PostSchema);

export default Post;
