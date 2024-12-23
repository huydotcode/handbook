'use server';
import { Category } from '@/models';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';

const createCategory = async ({
    name,
    description,
    slug,
    icon,
    path,
}: {
    name: string;
    description: string;
    slug: string;
    icon: string;
    path: string;
}) => {
    try {
        await connectToDB();

        const newCategory = await new Category({
            name,
            description,
            slug,
            icon,
        });

        await newCategory.save();

        return JSON.parse(JSON.stringify(newCategory));
    } catch (error: any) {
        throw new Error(error);
    } finally {
        revalidatePath(path);
    }
};

const getCategories = async () => {
    try {
        await connectToDB();

        const categories = await Category.find();

        return JSON.parse(JSON.stringify(categories));
    } catch (error: any) {
        throw new Error(error);
    }
};

const getCategoryById = async ({ categoryId }: { categoryId: string }) => {
    try {
        await connectToDB();

        const category = await Category.findById(categoryId);

        return JSON.parse(JSON.stringify(category));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCategoryBySlug = async ({ slug }: { slug: string }) => {
    try {
        await connectToDB();

        const category = await Category.findOne({ slug });

        return JSON.parse(JSON.stringify(category));
    } catch (error: any) {
        throw new Error(error);
    }
};

export { createCategory, getCategories, getCategoryById };
