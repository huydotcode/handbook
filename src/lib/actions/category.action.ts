'use realtime-server';
import { Category } from '@/models';
import connectToDB from '@/services/mongoose';
import { checkAdmin } from '@/lib/checkAdmin';

export const createCategory = async (data: {
    name: string;
    description: string;
    slug: string;
    icon: string;
}) => {
    try {
        const isAdmin = await checkAdmin();
        if (!isAdmin) {
            throw new Error("You don't have permission to create category");
        }

        await connectToDB();

        const { name, description, slug, icon } = data;

        const newCategory = new Category({
            name,
            description,
            slug,
            icon,
        });

        await newCategory.save();

        return JSON.parse(JSON.stringify(newCategory));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCategories = async () => {
    try {
        await connectToDB();

        const categories = await Category.find();

        return JSON.parse(JSON.stringify(categories));
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
