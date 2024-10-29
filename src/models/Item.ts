import { Schema, model, models } from 'mongoose';

interface IItemModel {
    name: string;
    seller: Schema.Types.ObjectId;
    description: string;
    price: number;
    images: Schema.Types.ObjectId[];
    location: string;
    category: Schema.Types.ObjectId;
    slug: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ItemSchema = new Schema<IItemModel>(
    {
        name: {
            type: String,
            required: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        images: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Image',
            },
        ],
        location: {
            type: String,
            required: true,
        },
        category: {
            ref: 'Category',
            type: Schema.Types.ObjectId,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Item = models.Item || model<IItemModel>('Item', ItemSchema);

export default Item;
