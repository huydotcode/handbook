import { model, models, Schema, Types } from 'mongoose';

interface SavedPostModel {
    userId: Types.ObjectId;
    posts: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const SavedPostSchema = new Schema<SavedPostModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    },
    {
        timestamps: true,
    }
);

SavedPostSchema.index({ userId: 1 });

const SavedPost =
    models.SavedPost || model<SavedPostModel>('SavedPost', SavedPostSchema);

export default SavedPost;
