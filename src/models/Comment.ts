import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IComment {
    content: string;
    userInfo: {
        id: string;
        image: string;
        name: string;
    };
    parentCommentId: Types.ObjectId;
    replies: Types.Array<Types.ObjectId>;
    reactions: Types.Array<{ userId: Types.ObjectId; reactionType: string }>;
    postId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const CommentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    userInfo: {
        id: String,
        image: String,
        name: String,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    reactions: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            reactionType: {
                type: String,
                required: true,
            },
        },
    ],
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Comment = models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
