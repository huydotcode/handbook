import { Schema, model, models } from 'mongoose';

export const ImageSchema = new Schema({
    asset_id: String,
    public_id: String,
    version: Number,
    version_id: String,
    signature: String,
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
    created_at: String,
    tags: Array,
    bytes: Number,
    type: String,
    etag: String,
    placeholder: Boolean,
    url: String,
    secure_url: String,
    folder: String,
    api_key: String,
});

const Image = models.Image || model('Image', ImageSchema);

export default Image;
