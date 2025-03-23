'use server';
import { Item } from '@/models';
import connectToDB from '@/services/mongoose';
import { getAuthSession } from '../auth';
import { revalidatePath } from 'next/cache';

export const createItem = async ({
    name,
    seller,
    description,
    price,
    images,
    location,
    category,
    status,
}: {
    name: string;
    seller: string;
    description: string;
    price: number;
    images: string[];
    location: string;
    category: string;
    status: string;
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
        const newItem = await new Item({
            name,
            seller,
            description,
            price,
            images,
            location,
            category,
            slug,
            status,
        });

        await newItem.save();

        return JSON.parse(JSON.stringify(newItem));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemById = async ({ id }: { id: string }) => {
    try {
        await connectToDB();

        const item = await Item.findById(id)
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(item));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsBySeller = async ({ seller }: { seller: string }) => {
    if (!seller) {
        throw new Error('Seller is required');
    }

    try {
        await connectToDB();

        const items = await Item.find({ seller })
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(items)) as IItem[];
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsByCategoryId = async ({
    categoryId,
}: {
    categoryId: string;
}) => {
    try {
        await connectToDB();

        const items = await Item.find({
            category: categoryId,
        })
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteItem = async ({
    itemId,
    path,
}: {
    itemId: string;
    path: string;
}) => {
    try {
        await connectToDB();

        await Item.findByIdAndDelete(itemId);

        revalidatePath(path);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
