import { Schema, model, models } from 'mongoose';

interface ICategoryModel {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CategorySchema = new Schema<ICategoryModel>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category =
    models.Category || model<ICategoryModel>('Category', CategorySchema);

export default Category;
