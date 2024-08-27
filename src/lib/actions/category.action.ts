'use server';

import { Category } from '@/models';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';

const createCategory = async ({
    name,
    description,
    path,
}: {
    name: string;
    description: string;
    path: string;
}) => {
    try {
        await connectToDB();

        const newCategory = await new Category({
            name,
            description,
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

export { createCategory, getCategories };
