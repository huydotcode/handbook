import { Schema, model, models } from 'mongoose';

interface ILocationModel {
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
    code: string;
}

export const LocationSchema = new Schema<ILocationModel>({
    name: String,
    slug: String,
    type: String,
    nameWithType: String,
    code: String,
});

LocationSchema.index({ slug: 1 }, { unique: true }); // Unique index for slug
LocationSchema.index({ name: 1 }); // Index for name search

const Location =
    models.Location || model<ILocationModel>('Location', LocationSchema);

export default Location;
