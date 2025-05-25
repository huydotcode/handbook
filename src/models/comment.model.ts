import mongoose, { Schema, Types, model, models } from 'mongoose';

interface ICommentModel {
    text: string;
    author: Types.ObjectId;
    replyComment: Types.ObjectId;
    loves: Types.ObjectId[];
    post: Types.ObjectId;
    isDeleted: boolean;
    hasReplies: boolean;
}

export const CommentSchema = new Schema<ICommentModel>(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        replyComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        loves: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        hasReplies: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

CommentSchema.index({ post: 1 }); // Index for comments by post
CommentSchema.index({ replyComment: 1 }); // Index for replies to a comment
CommentSchema.index({ post: 1, createdAt: -1 }); // Compound index for comments in a post sorted by date

const Comment =
    models.Comment || model<ICommentModel>('Comment', CommentSchema);

export default Comment;
