import mongoose, { Schema, Types, model, models } from 'mongoose';

interface IPostInteractionModel {
    user: Types.ObjectId;
    post: Types.ObjectId;
    type: 'love' | 'share' | 'comment';
}

const PostInteractionSchema = new Schema<IPostInteractionModel>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        type: {
            type: String,
            enum: ['love', 'share', 'comment', 'save'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

PostInteractionSchema.index({ user: 1, post: 1, type: 1 }); // Index for user interactions on posts
PostInteractionSchema.index({ post: 1, type: 1 }); // Index for post
PostInteractionSchema.index({ createdAt: -1 }); // Index for interactions by date
PostInteractionSchema.index({ type: 1 }); // Index for interaction type

const PostInteraction =
    models.PostInteraction ||
    model<IPostInteractionModel>('PostInteraction', PostInteractionSchema);

export default PostInteraction;
