// TODO CHANGE MODEL
import { Schema, model, models } from 'mongoose';

interface IMediaModel {
    publicId: string;
    width: number;
    height: number;
    resourceType: string;
    type: string;
    url: string;
    creator: Schema.Types.ObjectId;
}

export const MediaSchema = new Schema<IMediaModel>(
    {
        publicId: String,
        width: Number,
        height: Number,
        resourceType: String,
        type: String,
        url: String,
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

MediaSchema.index({ creator: 1 }); // Index for images by creator

const Media = models.Media || model('Media', MediaSchema);

export default Media;
