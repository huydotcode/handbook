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

const Location =
    models.Location || model<ILocationModel>('Location', LocationSchema);

export default Location;
