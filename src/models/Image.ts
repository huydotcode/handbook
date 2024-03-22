// TODO CHANGE MODEL
import { Schema, model, models } from 'mongoose';

interface IImageModel {
    publicId: string;
    width: number;
    height: number;
    resourceType: string;
    type: string;
    url: string;
    creator: Schema.Types.ObjectId;
}

export const ImageSchema = new Schema<IImageModel>(
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

const Image = models.Image || model('Image', ImageSchema);

export default Image;
