import { Schema, model, models } from 'mongoose';

interface ICategoryModel {
    name: string;
    description: string;
    slug: string;
    icon: string;
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
        slug: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.index({ slug: 1 }, { unique: true }); // Unique index for slug
CategorySchema.index({ name: 1 }); // Index for name search

const Category =
    models.Category || model<ICategoryModel>('Category', CategorySchema);

export default Category;
